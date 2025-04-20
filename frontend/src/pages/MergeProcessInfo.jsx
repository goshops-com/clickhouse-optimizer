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

const NoMerges = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #757575;
`;

function MergeProcessInfo() {
  const [loading, setLoading] = useState(true);
  const [merges, setMerges] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.fetchMergeProcessInfo();
      setMerges(data);
    } catch (error) {
      console.error('Error fetching merge process info:', error);
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
    { header: 'Database', accessor: 'database' },
    { header: 'Table', accessor: 'table' },
    { header: 'Elapsed', accessor: 'elapsed' },
    { header: 'Progress', accessor: 'progress' },
    { header: 'Num Parts', accessor: 'num_parts' },
    { 
      header: 'Source Rows', 
      accessor: row => formatRowCount(row.source_rows)
    },
    { 
      header: 'Source Bytes', 
      accessor: row => formatBytes(row.source_bytes)
    },
    { 
      header: 'Result Rows', 
      accessor: row => formatRowCount(row.result_rows)
    },
    { 
      header: 'Result Bytes', 
      accessor: row => formatBytes(row.result_bytes)
    }
  ];

  return (
    <div>
      <PageHeader>
        <PageTitle>Merge Process Information</PageTitle>
        <PageDescription>
          Monitor current merge processes in ClickHouse. This view automatically refreshes every 10 seconds.
        </PageDescription>
      </PageHeader>

      <MetricsCard title="Active Merge Processes" onRefresh={fetchData}>
        {loading ? (
          <div className="loading">Loading merge process data...</div>
        ) : merges.length > 0 ? (
          <DataTable data={merges} columns={columns} />
        ) : (
          <NoMerges>
            <p>No active merge processes are currently running.</p>
          </NoMerges>
        )}
      </MetricsCard>
    </div>
  );
}

export default MergeProcessInfo; 