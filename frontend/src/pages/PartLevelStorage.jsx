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

function PartLevelStorage() {
  const [loading, setLoading] = useState(true);
  const [parts, setParts] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.fetchPartLevelStorage();
      setParts(data);
    } catch (error) {
      console.error('Error fetching part level storage data:', error);
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
    { header: 'Partition', accessor: 'partition' },
    { header: 'Part Name', accessor: 'part_name' },
    { 
      header: 'Rows', 
      accessor: row => formatRowCount(row.rows)
    },
    { header: 'Size', accessor: 'size' },
    { header: 'Primary Key Size', accessor: 'primary_key_size' },
    { header: 'Disk Size', accessor: 'disk_size' },
    { header: 'Compression Ratio', accessor: 'compression_ratio' }
  ];

  return (
    <div>
      <PageHeader>
        <PageTitle>Part-Level Storage</PageTitle>
        <PageDescription>
          Analyze storage metrics at the part level for individual tables.
        </PageDescription>
      </PageHeader>

      <MetricsCard title="Table Parts Details" onRefresh={fetchData}>
        {loading ? (
          <div className="loading">Loading part-level storage data...</div>
        ) : (
          <DataTable data={parts} columns={columns} />
        )}
      </MetricsCard>
    </div>
  );
}

export default PartLevelStorage; 