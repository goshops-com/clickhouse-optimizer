import axios from 'axios';

const API_BASE_URL = '/api';

const api = {
  fetchQueryPerformance: async () => {
    const response = await axios.get(`${API_BASE_URL}/metrics/query-performance`);
    return response.data;
  },
  
  fetchStorageByTable: async () => {
    const response = await axios.get(`${API_BASE_URL}/metrics/storage-by-table`);
    return response.data;
  },
  
  fetchDiskUsageByDB: async () => {
    const response = await axios.get(`${API_BASE_URL}/metrics/disk-usage-by-db`);
    return response.data;
  },
  
  fetchPartLevelStorage: async () => {
    const response = await axios.get(`${API_BASE_URL}/metrics/part-level-storage`);
    return response.data;
  },
  
  fetchMemoryUsage: async () => {
    const response = await axios.get(`${API_BASE_URL}/metrics/memory-usage`);
    return response.data;
  },
  
  fetchMergeProcessInfo: async () => {
    const response = await axios.get(`${API_BASE_URL}/metrics/merge-process-info`);
    return response.data;
  },
  
  fetchActiveQueries: async () => {
    const response = await axios.get(`${API_BASE_URL}/metrics/active-queries`);
    return response.data;
  },
  
  fetchReplicationStatus: async () => {
    const response = await axios.get(`${API_BASE_URL}/metrics/replication-status`);
    return response.data;
  },
  
  fetchSlowLogAnalysis: async () => {
    const response = await axios.get(`${API_BASE_URL}/metrics/slow-log-analysis`);
    return response.data;
  },
  
  analyzeQuery: async (query) => {
    const response = await axios.post(`${API_BASE_URL}/analyze-query`, { query });
    return response.data;
  },
  
  getAIRecommendations: async (query, analysis) => {
    const response = await axios.post(`${API_BASE_URL}/ai-analyze-query`, { 
      query, 
      analysis 
    });
    return response.data;
  },
  
  getAIPrompt: async (query, analysis) => {
    const response = await axios.post(`${API_BASE_URL}/ai-analyze-query?prompt_only=true`, { 
      query, 
      analysis 
    });
    return response.data;
  }
};

export default api; 