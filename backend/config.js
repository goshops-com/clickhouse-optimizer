require('dotenv').config();

module.exports = {
  clickhouse: {
    host: process.env.CLICKHOUSE_HOST || 'localhost',
    port: process.env.CLICKHOUSE_PORT || 8123,
    database: process.env.CLICKHOUSE_DB || 'default',
    username: process.env.CLICKHOUSE_USER || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || '',
  },
  server: {
    port: process.env.PORT || 3001,
  }
}; 