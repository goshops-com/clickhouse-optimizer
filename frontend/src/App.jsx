import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import QueryPerformance from './pages/QueryPerformance';
import StorageByTable from './pages/StorageByTable';
import DiskUsageByDatabase from './pages/DiskUsageByDatabase';
import PartLevelStorage from './pages/PartLevelStorage';
import MemoryUsage from './pages/MemoryUsage';
import MergeProcessInfo from './pages/MergeProcessInfo';
import ActiveQueries from './pages/ActiveQueries';
import ReplicationStatus from './pages/ReplicationStatus';
import SlowLogAnalysis from './pages/SlowLogAnalysis';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

function App() {
  return (
    <AppContainer>
      <Sidebar />
      <MainContent>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/query-performance" element={<QueryPerformance />} />
          <Route path="/storage-by-table" element={<StorageByTable />} />
          <Route path="/disk-usage-by-database" element={<DiskUsageByDatabase />} />
          <Route path="/part-level-storage" element={<PartLevelStorage />} />
          <Route path="/memory-usage" element={<MemoryUsage />} />
          <Route path="/merge-process-info" element={<MergeProcessInfo />} />
          <Route path="/active-queries" element={<ActiveQueries />} />
          <Route path="/replication-status" element={<ReplicationStatus />} />
          <Route path="/slow-log-analysis" element={<SlowLogAnalysis />} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
}

export default App; 