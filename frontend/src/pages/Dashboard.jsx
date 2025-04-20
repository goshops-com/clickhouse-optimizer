import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api';
import MetricsCard from '../components/MetricsCard';

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricSummary = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const MetricTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: #616161;
  margin-bottom: 1rem;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const LoadingText = styled.div`
  text-align: center;
  color: #757575;
  padding: 2rem;
`;

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    queryStats: null,
    storageStats: null,
    memoryStats: null,
    activeQueries: null,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const [queryPerformance, storageByTable, diskUsage, memoryUsage, activeQueries] = await Promise.all([
          api.fetchQueryPerformance(),
          api.fetchStorageByTable(),
          api.fetchDiskUsageByDB(),
          api.fetchMemoryUsage(),
          api.fetchActiveQueries(),
        ]);
        
        setMetrics({
          queryStats: {
            slowQueries: queryPerformance.length > 0 ? queryPerformance[0].query_duration_ms : 0,
            totalQueries: queryPerformance.length,
          },
          storageStats: {
            totalTables: storageByTable.length,
            largestTable: storageByTable.length > 0 ? `${storageByTable[0].database}.${storageByTable[0].table}` : 'N/A',
            largestTableSize: storageByTable.length > 0 ? storageByTable[0].size : 'N/A',
            totalStorageSize: diskUsage.reduce((total, db) => {
              return total + (db.bytes_raw || 0);
            }, 0),
          },
          memoryStats: {
            totalMemory: memoryUsage.find(m => m.metric === 'MemoryTracking')?.formatted_value || 'N/A',
          },
          activeQueries: {
            count: activeQueries.length,
          },
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingText>Loading dashboard metrics...</LoadingText>;
  }

  return (
    <div>
      <PageHeader>
        <PageTitle>ClickHouse Metrics Dashboard</PageTitle>
      </PageHeader>

      <DashboardGrid>
        <Link to="/query-performance" style={{ textDecoration: 'none' }}>
          <MetricSummary>
            <MetricTitle>Slowest Query</MetricTitle>
            <MetricValue>{metrics.queryStats.slowQueries} ms</MetricValue>
          </MetricSummary>
        </Link>
        
        <Link to="/query-performance" style={{ textDecoration: 'none' }}>
          <MetricSummary>
            <MetricTitle>Total Queries</MetricTitle>
            <MetricValue>{metrics.queryStats.totalQueries}</MetricValue>
          </MetricSummary>
        </Link>
        
        <Link to="/storage-by-table" style={{ textDecoration: 'none' }}>
          <MetricSummary>
            <MetricTitle>Largest Table</MetricTitle>
            <MetricValue>{metrics.storageStats.largestTableSize}</MetricValue>
          </MetricSummary>
        </Link>
        
        <Link to="/storage-by-table" style={{ textDecoration: 'none' }}>
          <MetricSummary>
            <MetricTitle>Total Tables</MetricTitle>
            <MetricValue>{metrics.storageStats.totalTables}</MetricValue>
          </MetricSummary>
        </Link>
        
        <Link to="/memory-usage" style={{ textDecoration: 'none' }}>
          <MetricSummary>
            <MetricTitle>Memory Usage</MetricTitle>
            <MetricValue>{metrics.memoryStats.totalMemory}</MetricValue>
          </MetricSummary>
        </Link>
        
        <Link to="/active-queries" style={{ textDecoration: 'none' }}>
          <MetricSummary>
            <MetricTitle>Active Queries</MetricTitle>
            <MetricValue>{metrics.activeQueries.count}</MetricValue>
          </MetricSummary>
        </Link>
      </DashboardGrid>
      
      <MetricsCard title="System Overview">
        <p>This dashboard provides real-time metrics and performance insights for your ClickHouse database.</p>
        <p>Navigate through the sidebar to explore detailed metrics on query performance, storage usage, memory consumption, and more.</p>
      </MetricsCard>
    </div>
  );
}

export default Dashboard; 