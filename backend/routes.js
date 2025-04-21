const express = require('express');
const { executeQuery } = require('./db');
const QUERIES = require('./queries');
const OpenAI = require('openai');
const config = require('./config');

// Initialize OpenAI only if API key is provided
let openai = null;
if (config.openai.enabled) {
  try {
    openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    console.log('OpenAI client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error.message);
  }
}

const router = express.Router();

// Middleware to check if OpenAI is available for AI routes
const requireOpenAI = (req, res, next) => {
  if (!config.openai.enabled || !openai) {
    return res.status(503).json({
      error: 'AI features are not available',
      details: 'OpenAI API key is not configured or client initialization failed',
    });
  }
  next();
};

router.get('/metrics/query-performance', async (req, res) => {
  try {
    const data = await executeQuery(QUERIES.QUERY_PERFORMANCE);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/metrics/storage-by-table', async (req, res) => {
  try {
    const data = await executeQuery(QUERIES.STORAGE_BY_TABLE);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/metrics/disk-usage-by-db', async (req, res) => {
  try {
    const data = await executeQuery(QUERIES.DISK_USAGE_BY_DB);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/metrics/part-level-storage', async (req, res) => {
  try {
    const data = await executeQuery(QUERIES.PART_LEVEL_STORAGE);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/metrics/memory-usage', async (req, res) => {
  try {
    const data = await executeQuery(QUERIES.MEMORY_USAGE);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/metrics/merge-process-info', async (req, res) => {
  try {
    const data = await executeQuery(QUERIES.MERGE_PROCESS_INFO);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/metrics/active-queries', async (req, res) => {
  try {
    const data = await executeQuery(QUERIES.ACTIVE_QUERIES);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/metrics/replication-status', async (req, res) => {
  try {
    const data = await executeQuery(QUERIES.REPLICATION_STATUS);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/metrics/slow-log-analysis', async (req, res) => {
  try {
    const data = await executeQuery(QUERIES.SLOW_LOG_ANALYSIS);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to detect query type and clean it up for EXPLAIN
function prepareQueryForExplain(query) {
  // Remove FORMAT clause if present (not supported in EXPLAIN)
  const formatRegex = /\s+FORMAT\s+\w+\s*$/i;
  query = query.replace(formatRegex, '');
  
  // Check if it's a SELECT query (most common case for EXPLAIN)
  if (/^\s*SELECT\b/i.test(query)) {
    return {
      isExplainable: true,
      query
    };
  }
  
  // Check if it starts with common keywords that might be explainable
  if (/^\s*(WITH|FROM|INSERT|CREATE|ALTER|OPTIMIZE|DESCRIBE|SHOW)\b/i.test(query)) {
    return {
      isExplainable: true,
      query 
    };
  }
  
  return {
    isExplainable: false,
    query,
    reason: "Query doesn't appear to be a SELECT or other explainable statement"
  };
}

// New endpoint to analyze a query
router.post('/analyze-query', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // Prepare the query for EXPLAIN analysis
    const { isExplainable, query: cleanedQuery, reason } = prepareQueryForExplain(query);
    
    if (!isExplainable) {
      return res.status(400).json({
        error: 'Query cannot be analyzed with EXPLAIN',
        details: reason,
        originalQuery: query
      });
    }
    
    // Result storage
    const result = {
      plan: [],
      syntax: [],
      pipeline: []
    };
    
    // Try different EXPLAIN types, catching errors individually
    try {
      result.plan = await executeQuery(`EXPLAIN PLAN ${cleanedQuery}`);
    } catch (error) {
      console.warn('Plan explain failed:', error.message);
      result.planError = error.message;
    }
    
    try {
      result.syntax = await executeQuery(`EXPLAIN SYNTAX ${cleanedQuery}`);
    } catch (error) {
      console.warn('Syntax explain failed:', error.message);
      result.syntaxError = error.message;
    }
    
    try {
      result.pipeline = await executeQuery(`EXPLAIN PIPELINE ${cleanedQuery}`);
    } catch (error) {
      console.warn('Pipeline explain failed:', error.message);
      result.pipelineError = error.message;
    }
    
    // If all explanation methods failed, return an error
    if (result.planError && result.syntaxError && result.pipelineError) {
      return res.status(400).json({
        error: 'Query cannot be explained with any EXPLAIN method',
        details: {
          plan: result.planError,
          syntax: result.syntaxError,
          pipeline: result.pipelineError
        },
        originalQuery: query
      });
    }
    
    // Return available results even if some failed
    res.json(result);
    
  } catch (error) {
    console.error('Query analysis error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'The query might contain syntax errors or reference non-existent tables',
      originalQuery: req.body.query
    });
  }
});

// Function to get all tables in the database
async function getAllTables() {
  try {
    const result = await executeQuery(`SELECT database, name FROM system.tables WHERE engine != 'View'`);
    return result;
  } catch (error) {
    console.error('Error getting tables:', error);
    return [];
  }
}

// Function to get DDL for tables
async function getTableDDLs(tableInfos) {
  const ddls = {};
  
  for (const tableInfo of tableInfos) {
    try {
      const database = tableInfo.database;
      const table = tableInfo.name;
      const fullTableName = `${database}.${table}`;
      
      const result = await executeQuery(`SHOW CREATE TABLE ${fullTableName}`);
      
      if (result && result.length > 0) {
        ddls[fullTableName] = result[0].statement;
      }
    } catch (error) {
      console.warn(`Could not get DDL for table ${tableInfo.database}.${tableInfo.name}: ${error.message}`);
    }
  }
  
  return ddls;
}

// Endpoint to get AI-powered optimization recommendations
router.post('/ai-analyze-query', requireOpenAI, async (req, res) => {
  try {
    const { query, analysis } = req.body;
    const returnPromptOnly = req.query.prompt_only === 'true';
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // Get all tables from the database
    const allTables = await getAllTables();
    console.log(`Found ${allTables.length} tables in the database`);
    
    // Find tables that are mentioned in the query
    const mentionedTables = allTables.filter(tableInfo => {
      const tableName = tableInfo.name;
      const fullTableName = `${tableInfo.database}.${tableInfo.name}`;
      
      // Simple string matching
      return query.includes(tableName) || query.includes(fullTableName);
    });
    
    console.log('Tables mentioned in query:', mentionedTables.map(t => `${t.database}.${t.name}`));
    
    // Get DDL for mentioned tables
    const tableDDLs = await getTableDDLs(mentionedTables);
    
    // Get additional table information for the mentioned tables
    const tableDetails = {};
    for (const tableInfo of mentionedTables) {
      const database = tableInfo.database;
      const table = tableInfo.name;
      const fullTableName = `${database}.${table}`;
      
      try {
        // Get partitioning information
        const partitions = await executeQuery(`
          SELECT 
            partition,
            count() as parts,
            sum(rows) as rows,
            formatReadableSize(sum(bytes)) as size
          FROM system.parts
          WHERE database = '${database}' AND table = '${table}' AND active = 1
          GROUP BY partition
          ORDER BY partition
        `);
        
        // Get index information
        const indexes = await executeQuery(`
          SELECT 
            name,
            type,
            expression
          FROM system.data_skipping_indices
          WHERE database = '${database}' AND table = '${table}'
        `);
        
        tableDetails[fullTableName] = {
          partitions: partitions || [],
          indexes: indexes || []
        };
      } catch (error) {
        console.warn(`Error getting details for table ${fullTableName}:`, error.message);
        tableDetails[fullTableName] = { error: error.message };
      }
    }
    
    // Prepare DDL section for the prompt
    let ddlSection = '';
    if (Object.keys(tableDDLs).length > 0) {
      ddlSection = `\nTable Schemas:\n`;
      for (const [tableName, ddl] of Object.entries(tableDDLs)) {
        ddlSection += `\n\`\`\`sql\n-- ${tableName} Schema\n${ddl}\n\`\`\`\n`;
        
        // Add partition information if available
        if (tableDetails[tableName]?.partitions?.length > 0) {
          ddlSection += `\n-- ${tableName} Partitions:\n\`\`\`\n`;
          ddlSection += JSON.stringify(tableDetails[tableName].partitions, null, 2);
          ddlSection += `\n\`\`\`\n`;
        }
        
        // Add index information if available
        if (tableDetails[tableName]?.indexes?.length > 0) {
          ddlSection += `\n-- ${tableName} Indexes:\n\`\`\`\n`;
          ddlSection += JSON.stringify(tableDetails[tableName].indexes, null, 2);
          ddlSection += `\n\`\`\`\n`;
        }
      }
    }
    
    // Prepare the prompt for OpenAI
    const prompt = `You are an expert ClickHouse database performance engineer. Analyze this ClickHouse query and its execution plan, and provide specific optimization recommendations.
    
Query:
\`\`\`sql
${query}
\`\`\`

Execution Plan:
\`\`\`json
${JSON.stringify(analysis.plan || {})}
\`\`\`
${ddlSection}
Please provide:
1. An analysis of the query's performance characteristics
2. Specific optimization suggestions 
3. Any potential issues or bottlenecks
4. Schema recommendations if applicable

Focus on ClickHouse-specific optimizations like proper indexing, materialized views, join order, filtering, and aggregation strategies.

Format your response using Markdown with:
- Headers for different sections
- Code blocks for SQL examples
- Lists for recommendations
- Bold or italics for emphasis
`;

    // If only the prompt was requested, return it
    if (returnPromptOnly) {
      return res.json({ 
        prompt,
        analyzedTables: Object.keys(tableDDLs)
      });
    }

    try {
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          { role: "system", content: "You are an expert ClickHouse database performance engineer, specialized in query optimization. Format your responses in markdown for better readability." },
          { role: "user", content: prompt }
        ],
        temperature: 0.1, // Lower temperature for more focused, analytical responses
        max_tokens: 1500
      });
      
      // Extract the response
      const aiResponse = completion.choices[0].message.content;
      
      // Return the AI's optimization recommendations
      res.json({ 
        recommendations: aiResponse,
        analyzedTables: Object.keys(tableDDLs)
      });
    } catch (aiError) {
      console.error('OpenAI API error:', aiError);
      res.status(500).json({ 
        error: 'Error calling OpenAI API',
        details: aiError.message,
        suggestion: 'Check your API key and quota limits'
      });
    }
    
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ 
      error: error.message || 'Error getting AI recommendations',
      details: 'There was an issue analyzing your query with AI'
    });
  }
});

module.exports = router; 