import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api';
import MetricsCard from '../components/MetricsCard';
import DataTable from '../components/DataTable';
import { formatBytes, formatRowCount } from '../utils/formatters';

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: #757575;
  margin-bottom: 2rem;
`;

const NoQueries = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #757575;
`;

function ActiveQueries() {
  const [loading, setLoading] = useState(true);
  const [queries, setQueries] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.fetchActiveQueries();
      setQueries(data);
    } catch (error) {
      console.error('Error fetching active queries data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto refresh every 10 seconds
    const intervalId = setInterval(fetchData, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const columns = [
    { header: 'Query ID', accessor: 'query_id' },
    { header: 'User', accessor: 'user' },
    { 
      header: 'Elapsed', 
      accessor: row => {
        const elapsed = parseFloat(row.elapsed);
        if (elapsed < 1) {
          return `${(elapsed * 1000).toFixed(2)} ms`;
        }
        return `${elapsed.toFixed(2)} s`;
      }
    },
    { 
      header: 'Read Rows', 
      accessor: row => formatRowCount(row.read_rows)
    },
    { 
      header: 'Read Bytes', 
      accessor: row => formatBytes(row.read_bytes)
    },
    { 
      header: 'Memory', 
      accessor: row => formatBytes(row.memory_usage)
    },
    { 
      header: 'Query', 
      accessor: 'query'
    },
  ];

  return (
    <div>
      <PageHeader>
        <PageTitle>Active Queries</PageTitle>
        <PageDescription>
          Monitor currently running queries in ClickHouse. This view automatically refreshes every 10 seconds.
        </PageDescription>
      </PageHeader>

      <MetricsCard title="Running Queries" onRefresh={fetchData}>
        {loading ? (
          <div className="loading">Loading active queries...</div>
        ) : queries.length > 0 ? (
          <DataTable data={queries} columns={columns} />
        ) : (
          <NoQueries>
            <p>No active queries are currently running.</p>
          </NoQueries>
        )}
      </MetricsCard>
    </div>
  );
}

export default ActiveQueries; 