require('dotenv').config();

const config = {
  clickhouse: {
    host: process.env.CLICKHOUSE_HOST || 'localhost',
    port: process.env.CLICKHOUSE_PORT || 8123,
    database: process.env.CLICKHOUSE_DB || 'default',
    username: process.env.CLICKHOUSE_USER || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || '',
  },
  server: {
    port: process.env.PORT || 3001,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    enabled: !!process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o',
  },
  auth: {
    static: {
      enabled: process.env.STATIC_AUTH_ENABLED === 'true',
      username: process.env.STATIC_AUTH_USERNAME || 'admin',
      password: process.env.STATIC_AUTH_PASSWORD || 'password'
    }
  }
};

// Validate required configuration
if (!config.clickhouse.host) {
  console.error('ERROR: CLICKHOUSE_HOST environment variable is required');
  process.exit(1);
}

// Log configuration status
console.log(`Server configuration: port ${config.server.port}`);
console.log(`ClickHouse connection: ${config.clickhouse.host}:${config.clickhouse.port}`);
console.log(`OpenAI integration: ${config.openai.enabled ? 'Enabled' : 'Disabled'}`);
console.log(`Static auth: ${config.auth.static.enabled ? 'Enabled' : 'Disabled'}`);

module.exports = config; 