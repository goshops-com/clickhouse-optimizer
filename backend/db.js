const { createClient } = require('@clickhouse/client');
const config = require('./config');

const client = createClient({
  host: `http://${config.clickhouse.host}:${config.clickhouse.port}`,
  username: config.clickhouse.username,
  password: config.clickhouse.password,
  database: config.clickhouse.database,
});

async function executeQuery(query) {
  try {
    const resultSet = await client.query({
      query,
      format: 'JSONEachRow',
    });
    
    return await resultSet.json();
  } catch (error) {
    console.error('ClickHouse query error:', error);
    throw error;
  }
}

module.exports = {
  client,
  executeQuery,
}; 