import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

const ChartContainer = styled.div`
  height: 400px;
  margin-bottom: 2rem;
`;

function MemoryUsage() {
  const [loading, setLoading] = useState(true);
  const [memoryData, setMemoryData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.fetchMemoryUsage();
      setMemoryData(data);
      
      // Prepare data for chart (top 15 memory metrics)
      const topMemoryMetrics = [...data]
        .sort((a, b) => b.value - a.value)
        .slice(0, 15)
        .map(metric => ({
          name: metric.metric,
          value: metric.value,
          formattedValue: metric.formatted_value
        }));
      
      setChartData(topMemoryMetrics);
    } catch (error) {
      console.error('Error fetching memory usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { header: 'Metric', accessor: 'metric' },
    { header: 'Value', accessor: 'formatted_value' },
    { header: 'Raw Value', accessor: 'value' },
  ];

  return (
    <div>
      <PageHeader>
        <PageTitle>Memory Usage</PageTitle>
        <PageDescription>
          Analyze memory consumption across different parts of ClickHouse.
        </PageDescription>
      </PageHeader>

      <MetricsCard title="Top Memory Consumers" onRefresh={fetchData}>
        {loading ? (
          <div className="loading">Loading memory data...</div>
        ) : (
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={200} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name, props) => [props.payload.formattedValue, 'Memory Usage']}
                  labelFormatter={(value) => `Metric: ${value}`}
                />
                <Bar dataKey="value" fill="#1976d2" name="Memory" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </MetricsCard>

      <MetricsCard title="All Memory Metrics">
        {loading ? (
          <div className="loading">Loading memory data...</div>
        ) : (
          <DataTable data={memoryData} columns={columns} />
        )}
      </MetricsCard>
    </div>
  );
}

export default MemoryUsage; 