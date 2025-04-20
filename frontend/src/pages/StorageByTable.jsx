import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

const ChartContainer = styled.div`
  height: 400px;
  margin-bottom: 2rem;
`;

function StorageByTable() {
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState([]);
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.fetchStorageByTable();
      setTables(data);
      
      // Prepare chart data (top 10 tables by size)
      const topTables = [...data]
        .sort((a, b) => b.bytes_raw - a.bytes_raw)
        .slice(0, 10)
        .map(table => ({
          name: `${table.database}.${table.table}`,
          size: table.bytes_raw,
          formattedSize: table.size
        }));
      
      setChartData(topTables);
    } catch (error) {
      console.error('Error fetching storage by table data:', error);
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
    { header: 'Size', accessor: 'size' },
    { 
      header: 'Rows', 
      accessor: row => formatRowCount(row.rows)
    },
    { 
      header: 'Last Modified', 
      accessor: row => {
        if (!row.latest_modification) return 'N/A';
        return new Date(row.latest_modification * 1000).toLocaleString();
      }
    }
  ];

  return (
    <div>
      <PageHeader>
        <PageTitle>Storage by Table</PageTitle>
        <PageDescription>
          View storage usage metrics for all tables in the database.
        </PageDescription>
      </PageHeader>

      <MetricsCard title="Top 10 Tables by Size" onRefresh={fetchData}>
        {loading ? (
          <div className="loading">Loading storage data...</div>
        ) : (
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => formatBytes(value)} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => formatBytes(value)}
                  labelFormatter={(value) => `Table: ${value}`}
                />
                <Bar dataKey="size" fill="#1976d2" name="Size" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </MetricsCard>

      <MetricsCard title="Table Storage Details">
        {loading ? (
          <div className="loading">Loading storage data...</div>
        ) : (
          <DataTable data={tables} columns={columns} />
        )}
      </MetricsCard>
    </div>
  );
}

export default StorageByTable; 