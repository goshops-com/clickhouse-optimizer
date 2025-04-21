const { createClient } = require('@clickhouse/client');
const config = require('./config');

// Create a ClickHouse client
const client = createClient({
  host: `http://${config.clickhouse.host}:${config.clickhouse.port}`,
  username: config.clickhouse.username,
  password: config.clickhouse.password,
  database: config.clickhouse.database,
  request_timeout: 30000, // 30 second timeout
  compression: {
    request: true,  // compress requests to server
    response: true, // decompress responses from server
  },
});

// Execute a ClickHouse query and return the result as JSON
async function executeQuery(query, parameters = {}) {
  try {
    console.log(`Executing query: ${query.slice(0, 100)}${query.length > 100 ? '...' : ''}`);
    
    const resultSet = await client.query({
      query,
      format: 'JSONEachRow',
      parameters,
    });
    
    return await resultSet.json();
  } catch (error) {
    console.error('ClickHouse query error:', error);
    throw new Error(`Database query failed: ${error.message}`);
  }
}

// Check the database connection
async function checkConnection() {
  try {
    await executeQuery('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

// Initialize the database connection
async function initialize() {
  try {
    const connected = await checkConnection();
    if (connected) {
      console.log('Successfully connected to ClickHouse database');
      return true;
    } else {
      console.error('Failed to connect to ClickHouse database');
      return false;
    }
  } catch (error) {
    console.error('Error initializing database connection:', error);
    return false;
  }
}

module.exports = {
  client,
  executeQuery,
  checkConnection,
  initialize,
}; 