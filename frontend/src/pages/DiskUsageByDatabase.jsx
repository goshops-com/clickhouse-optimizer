import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
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

const COLORS = ['#1976d2', '#2196f3', '#64b5f6', '#bbdefb', '#0d47a1', '#0277bd', '#01579b', '#006064', '#004d40', '#1b5e20'];

function DiskUsageByDatabase() {
  const [loading, setLoading] = useState(true);
  const [databases, setDatabases] = useState([]);
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.fetchDiskUsageByDB();
      setDatabases(data);
      
      // Prepare chart data
      const pieData = data.map((db, index) => ({
        name: db.database,
        value: db.bytes_raw,
        rows: db.rows,
        size: db.size,
        fill: COLORS[index % COLORS.length]
      }));
      
      setChartData(pieData);
    } catch (error) {
      console.error('Error fetching disk usage by database data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { header: 'Database', accessor: 'database' },
    { header: 'Size', accessor: 'size' },
    { 
      header: 'Rows', 
      accessor: row => formatRowCount(row.rows)
    },
    { header: 'Number of Parts', accessor: 'part_count' }
  ];

  return (
    <div>
      <PageHeader>
        <PageTitle>Disk Usage by Database</PageTitle>
        <PageDescription>
          Analyze disk usage across different databases in your ClickHouse cluster.
        </PageDescription>
      </PageHeader>

      <MetricsCard title="Database Size Distribution" onRefresh={fetchData}>
        {loading ? (
          <div className="loading">Loading disk usage data...</div>
        ) : (
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  fill="#8884d8"
                  label={entry => entry.name}
                  labelLine
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [formatBytes(value), 'Size']}
                  labelFormatter={(value) => `Database: ${value}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </MetricsCard>

      <MetricsCard title="Database Storage Details">
        {loading ? (
          <div className="loading">Loading disk usage data...</div>
        ) : (
          <DataTable data={databases} columns={columns} />
        )}
      </MetricsCard>
    </div>
  );
}

export default DiskUsageByDatabase; 