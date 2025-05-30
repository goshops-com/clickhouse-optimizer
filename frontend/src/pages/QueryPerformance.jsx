import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api';
import MetricsCard from '../components/MetricsCard';
import DataTable from '../components/DataTable';
import QueryModal from '../components/QueryModal';
import QueryAnalysisModal from '../components/QueryAnalysisModal';
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

const ViewButton = styled.button`
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  margin-left: 8px;
  flex-shrink: 0;
  
  &:hover {
    background-color: #1565c0;
  }
`;

const AnalyzeButton = styled.button`
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  margin-left: 8px;
  flex-shrink: 0;
  
  &:hover {
    background-color: #f57c00;
  }
`;

const QueryCell = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

const QueryText = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-shrink: 0;
`;

function QueryPerformance() {
  const [loading, setLoading] = useState(true);
  const [queries, setQueries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState('');
  
  // Analysis state
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [analyzingQuery, setAnalyzingQuery] = useState(false);
  const [queryToAnalyze, setQueryToAnalyze] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.fetchQueryPerformance();
      setQueries(data);
    } catch (error) {
      console.error('Error fetching query performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewQuery = (query) => {
    setSelectedQuery(query);
    setModalOpen(true);
  };
  
  const handleAnalyzeQuery = async (query) => {
    setQueryToAnalyze(query);
    setAnalysisModalOpen(true);
    setAnalyzingQuery(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    
    try {
      const result = await api.analyzeQuery(query);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing query:', error);
      setAnalysisError(error.response?.data?.error || error.message);
    } finally {
      setAnalyzingQuery(false);
    }
  };

  const columns = [
    { header: 'User', accessor: 'user' },
    { header: 'Host', accessor: 'client_hostname' },
    { header: 'Duration (ms)', accessor: 'query_duration_ms' },
    { 
      header: 'Memory Usage', 
      accessor: row => formatBytes(row.memory_usage) 
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
      header: 'Result Rows', 
      accessor: row => formatRowCount(row.result_rows) 
    },
    { 
      header: 'Query', 
      accessor: row => {
        return (
          <QueryCell>
            <QueryText title={row.query}>{row.query}</QueryText>
            <ButtonGroup>
              <ViewButton onClick={() => handleViewQuery(row.query)}>View</ViewButton>
              <AnalyzeButton onClick={() => handleAnalyzeQuery(row.query)}>Analyze</AnalyzeButton>
            </ButtonGroup>
          </QueryCell>
        );
      }
    },
  ];

  return (
    <div>
      <PageHeader>
        <PageTitle>Query Performance</PageTitle>
        <PageDescription>
          Analyze the performance of recent queries, sorted by duration in descending order.
        </PageDescription>
      </PageHeader>

      <MetricsCard title="Top 20 Slowest Queries" onRefresh={fetchData}>
        {loading ? (
          <div className="loading">Loading query data...</div>
        ) : (
          <DataTable data={queries} columns={columns} />
        )}
      </MetricsCard>

      <QueryModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        query={selectedQuery}
      />
      
      <QueryAnalysisModal
        isOpen={analysisModalOpen}
        onClose={() => setAnalysisModalOpen(false)}
        loading={analyzingQuery}
        analysis={analysisResult}
        error={analysisError}
        originalQuery={queryToAnalyze}
      />
    </div>
  );
}

export default QueryPerformance; 