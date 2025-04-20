import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 900px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #757575;
  
  &:hover {
    color: #1976d2;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
`;

const QueryContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
  white-space: pre-wrap;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
`;

function QueryModal({ query, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Query Details</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          <QueryContainer>
            {query}
          </QueryContainer>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default QueryModal; 