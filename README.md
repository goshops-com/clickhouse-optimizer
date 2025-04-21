# ClickHouse Monitoring Dashboard

A comprehensive monitoring and query optimization platform for ClickHouse databases.

## Features

- **Metrics Dashboard**: Real-time visualization of key ClickHouse metrics
- **Storage Analysis**: Detailed breakdown of storage usage by table and database
- **Query Performance**: Monitor and analyze query execution times and resource usage
- **Replication Monitoring**: Track replication status and delays
- **Merge Process Visualization**: Monitor background merge processes
- **Query Analysis & Optimization**: Analyze and optimize complex queries
- **OpenAI Integration**: AI-powered query analysis and optimization suggestions

## System Requirements

- Node.js 18 or later
- npm or yarn package manager
- Access to a ClickHouse database instance
- 512MB+ RAM for the dashboard service
- Optional: OpenAI API key for AI-powered query analysis

## Architecture

The application consists of two main components:

- **Backend**: Express.js server providing RESTful API endpoints and static file serving
- **Frontend**: React-based web application for visualization and user interaction

## Directory Structure

- `/backend` - Server-side code
  - `/config.js` - Configuration settings
  - `/db.js` - Database connection and query execution utilities
  - `/queries.js` - SQL queries for ClickHouse metrics
  - `/routes.js` - API route definitions
  - `/server.js` - Express server setup
  - `/public/` - Static files served by the backend (frontend build)
- `/frontend` - Client-side application
  - `/src` - Source code
  - `/dist` - Production build

## Installation

### Standard Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/clickhouse-dashboard.git
   cd clickhouse-dashboard
   ```

2. Install dependencies for both backend and frontend:
   ```
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the backend directory
   - Set the required environment variables (see Environment Variables section)

4. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

5. Start the backend server:
   ```
   cd ../backend
   node server.js
   ```

### Docker Setup

The easiest way to run the ClickHouse Monitoring Dashboard is with Docker:

1. Using Docker Compose:
   ```
   docker-compose up -d
   ```

2. Using Docker directly:
   ```
   docker pull goshops/clickhouse-optimizer
   docker run -p 3001:3001 \
     -e CLICKHOUSE_HOST=your-clickhouse-host \
     -e CLICKHOUSE_PORT=8123 \
     -e CLICKHOUSE_USER=default \
     -e CLICKHOUSE_PASSWORD=your-password \
     -e OPENAI_API_KEY=your-openai-key \
     goshops/clickhouse-optimizer
   ```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `CLICKHOUSE_HOST` | ClickHouse server hostname | localhost | Yes |
| `CLICKHOUSE_PORT` | ClickHouse HTTP port | 8123 | Yes |
| `CLICKHOUSE_DB` | ClickHouse database name | default | Yes |
| `CLICKHOUSE_USER` | ClickHouse username | default | Yes |
| `CLICKHOUSE_PASSWORD` | ClickHouse password | (empty) | No |
| `PORT` | Port for the dashboard server | 3001 | No |
| `OPENAI_API_KEY` | OpenAI API key for query analysis | (none) | No |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/metrics/query-performance` | GET | Get query performance metrics |
| `/api/metrics/storage-by-table` | GET | Get storage metrics by table |
| `/api/metrics/disk-usage-by-db` | GET | Get disk usage by database |
| `/api/metrics/part-level-storage` | GET | Get part-level storage metrics |
| `/api/metrics/memory-usage` | GET | Get memory usage metrics |
| `/api/metrics/merge-process-info` | GET | Get merge process information |
| `/api/metrics/active-queries` | GET | Get currently running queries |
| `/api/metrics/replication-status` | GET | Get replication status |
| `/api/metrics/slow-log-analysis` | GET | Get slow query log analysis |
| `/api/analyze-query` | POST | Analyze a query using ClickHouse EXPLAIN |
| `/api/ai-analyze-query` | POST | Analyze a query using OpenAI |

## OpenAI Integration

The dashboard includes an optional AI-powered query analysis feature using OpenAI. This functionality:
- Helps optimize and analyze complex ClickHouse queries
- Provides recommendations for query improvements
- Explains query execution plans in plain language
- Suggests schema improvements based on query patterns

To enable this feature, set the `OPENAI_API_KEY` environment variable. If not provided, the dashboard will still function normally, but the AI analysis features will be disabled.

## Security Considerations

- **API Key Security**: Store your OpenAI API key securely and never commit it to version control
- **ClickHouse Credentials**: Use a read-only user for the dashboard to prevent accidental data modification
- **Network Security**: Consider running the dashboard behind a reverse proxy with HTTPS
- **Access Control**: Implement authentication if deploying in a multi-user environment

## Development

### Frontend Development

```
cd frontend
npm run dev
```

### Backend Development

```
cd backend
npm run dev
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 