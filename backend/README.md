# ClickHouse Monitoring Dashboard - Backend

This is the backend server for the ClickHouse Monitoring Dashboard.

## Features

- RESTful API to fetch ClickHouse metrics
- Static file serving for the frontend application
- OpenAI integration for query analysis

## Directory Structure

- `/config.js` - Configuration settings
- `/db.js` - Database connection and query execution utilities
- `/queries.js` - SQL queries for ClickHouse metrics
- `/routes.js` - API route definitions
- `/server.js` - Express server setup
- `/public/` - Static files served by the backend (frontend build)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Copy the `.env.example` file to `.env` (if available)
   - Update the values for your ClickHouse connection
   - Add your OpenAI API key

3. Start the server:
   ```
   node server.js
   ```

## Deploying the Frontend

The backend is configured to serve the frontend application from the `/public` directory. To deploy the frontend:

1. Navigate to the frontend directory
2. Run the deployment script:
   ```
   ./deploy.sh
   ```

This script will:
- Build the frontend application
- Copy the build output to the backend's `/public` directory
- The backend will then serve the frontend application

## API Endpoints

- `/api/metrics/query-performance` - Get query performance metrics
- `/api/metrics/storage-by-table` - Get storage metrics by table
- `/api/metrics/disk-usage-by-db` - Get disk usage by database
- `/api/metrics/part-level-storage` - Get part-level storage metrics
- `/api/metrics/memory-usage` - Get memory usage metrics
- `/api/metrics/merge-process-info` - Get merge process information
- `/api/metrics/active-queries` - Get currently running queries
- `/api/metrics/replication-status` - Get replication status
- `/api/metrics/slow-log-analysis` - Get slow query log analysis
- `/api/analyze-query` - Analyze a query using ClickHouse EXPLAIN
- `/api/ai-analyze-query` - Analyze a query using OpenAI 