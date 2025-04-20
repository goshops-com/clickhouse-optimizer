import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CardContent = styled.div``;

const RefreshButton = styled.button`
  background-color: transparent;
  border: none;
  color: #1976d2;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

function MetricsCard({ title, children, onRefresh }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {onRefresh && (
          <RefreshButton onClick={onRefresh}>
            Refresh
          </RefreshButton>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

export default MetricsCard; 