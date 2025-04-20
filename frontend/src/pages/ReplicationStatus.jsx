import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api';
import MetricsCard from '../components/MetricsCard';
import DataTable from '../components/DataTable';

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

const NoReplicas = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #757575;
`;

function ReplicationStatus() {
  const [loading, setLoading] = useState(true);
  const [replicas, setReplicas] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.fetchReplicationStatus();
      setReplicas(data);
    } catch (error) {
      console.error('Error fetching replication status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { header: 'Database', accessor: 'database' },
    { header: 'Table', accessor: 'table' },
    { 
      header: 'Is Leader', 
      accessor: row => row.is_leader ? 'Yes' : 'No'
    },
    { 
      header: 'Is Readonly', 
      accessor: row => row.is_readonly ? 'Yes' : 'No'
    },
    { header: 'Absolute Delay', accessor: 'absolute_delay' },
    { header: 'Total Replicas', accessor: 'total_replicas' },
    { header: 'Active Replicas', accessor: 'active_replicas' }
  ];

  return (
    <div>
      <PageHeader>
        <PageTitle>Replication Status</PageTitle>
        <PageDescription>
          Monitor the replication status for replicated tables in ClickHouse.
        </PageDescription>
      </PageHeader>

      <MetricsCard title="Replicated Tables Status" onRefresh={fetchData}>
        {loading ? (
          <div className="loading">Loading replication status data...</div>
        ) : replicas.length > 0 ? (
          <DataTable data={replicas} columns={columns} />
        ) : (
          <NoReplicas>
            <p>No replicated tables were found in the system.</p>
          </NoReplicas>
        )}
      </MetricsCard>
    </div>
  );
}

export default ReplicationStatus; 