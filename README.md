# ClickHouse Monitoring Dashboard

A comprehensive dashboard for monitoring ClickHouse database metrics and query performance.

## Features

- Query performance analysis
- Storage metrics by table
- Disk usage by database
- Memory consumption monitoring
- Active query monitoring
- Replication status
- Merge process information
- Slow query log analysis
- AI-powered query optimization suggestions

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Running with Docker Compose

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Set your OpenAI API key in an environment variable:
   ```bash
   export OPENAI_API_KEY=your_openai_api_key
   ```

3. Start the application:
   ```bash
   docker-compose up -d
   ```

4. Access the dashboard at http://localhost:3001

### Using the Multi-Stage Dockerfile

For production environments, you can use the multi-stage Dockerfile that builds both frontend and backend:

1. Build the Docker image:
   ```bash
   docker build -t clickhouse-dashboard .
   ```

2. Run the container:
   ```bash
   docker run -p 3001:3001 \
     -e CLICKHOUSE_HOST=your-clickhouse-host \
     -e CLICKHOUSE_PORT=8123 \
     -e CLICKHOUSE_DB=default \
     -e CLICKHOUSE_USER=default \
     -e CLICKHOUSE_PASSWORD= \
     -e OPENAI_API_KEY=your_openai_api_key \
     -d clickhouse-dashboard
   ```

3. Access the dashboard at http://localhost:3001

## Development Setup

### Frontend

The frontend is a React application built with Vite.

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### Backend

The backend is a Node.js Express application.

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables:
   - Copy the `.env.example` file to `.env` (if available)
   - Update the values for your ClickHouse connection
   - Add your OpenAI API key

3. Start the server:
   ```bash
   node server.js
   ```

### Deploying Frontend to Backend

To build and deploy the frontend to be served by the backend:

```bash
cd frontend
./deploy.sh
```

## License

[MIT License](LICENSE) 