import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import ReactMarkdown from 'react-markdown';

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
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
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

const AnalysisSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const CodeBlock = styled.div`
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
  white-space: pre-wrap;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const AIResponseBlock = styled.div`
  background-color: #f0f7ff;
  border-radius: 4px;
  padding: 1.5rem;
  line-height: 1.6;
  font-size: 0.95rem;
  
  pre {
    background-color: #f1f1f1;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.85rem;
  }
  
  code {
    background-color: #f1f1f1;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.85rem;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  ul, ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  blockquote {
    border-left: 3px solid #b3e5fc;
    padding-left: 1rem;
    margin-left: 0;
    color: #546e7a;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#f5f5f5' : 'transparent'};
  border: none;
  border-bottom: ${props => props.active ? '2px solid #1976d2' : '2px solid transparent'};
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : 'normal'};
  color: ${props => props.active ? '#1976d2' : '#757575'};
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const AITab = styled(Tab)`
  color: ${props => props.active ? '#2e7d32' : '#757575'};
  border-bottom-color: ${props => props.active ? '#2e7d32' : 'transparent'};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 6px;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #757575;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #ffebee;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const ErrorDetails = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8d7da;
  border-radius: 4px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875rem;
  overflow-x: auto;
`;

const WarningMessage = styled.div`
  color: #ff9800;
  background-color: #fff3e0;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const InfoBox = styled.div`
  color: #1976d2;
  background-color: #e3f2fd;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const AIRequestButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1b5e20;
  }
  
  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 1rem;
`;

const CopyPromptButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: #424242;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #616161;
  }
  
  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const CopySuccessToast = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #43a047;
  color: white;
  padding: 12px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1200;
  animation: fadeOut 3s forwards;
  
  @keyframes fadeOut {
    0% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

const PromptModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const PromptContent = styled.div`
  background-color: white;
  width: 80%;
  max-width: 1200px;
  max-height: 90vh;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
`;

const PromptHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const PromptBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 130px);
`;

const PromptText = styled.pre`
  white-space: pre-wrap;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow-x: auto;
`;

const PromptActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
`;

function formatJSON(data) {
  try {
    if (typeof data === 'string') {
      return JSON.stringify(JSON.parse(data), null, 2);
    }
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return data;
  }
}

function QueryAnalysisModal({ isOpen, onClose, analysis, loading, error, originalQuery }) {
  const [activeTab, setActiveTab] = useState('plan');
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  
  if (!isOpen) return null;

  // Determine if we have errors for specific tabs
  const hasPlanError = analysis?.planError;
  const hasSyntaxError = analysis?.syntaxError;
  const hasPipelineError = analysis?.pipelineError;
  
  const handleRequestAIAnalysis = async () => {
    if (!analysis || loading) return;
    
    setLoadingAI(true);
    setAiError(null);
    
    try {
      const result = await api.getAIRecommendations(originalQuery, analysis);
      setAiRecommendations(result.recommendations);
      setActiveTab('ai');
    } catch (error) {
      console.error('AI analysis error:', error);
      setAiError(error.response?.data?.error || error.message);
    } finally {
      setLoadingAI(false);
    }
  };
  
  const handleViewPrompt = async () => {
    if (!analysis || loading) return;
    
    setLoadingPrompt(true);
    
    try {
      const result = await api.getAIPrompt(originalQuery, analysis);
      setPrompt(result.prompt);
      setShowPrompt(true);
    } catch (error) {
      console.error('Error getting prompt:', error);
      alert('Failed to get the AI prompt: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoadingPrompt(false);
    }
  };
  
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt)
      .then(() => {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy prompt:', err);
        alert('Failed to copy to clipboard');
      });
  };
  
  const handleClosePromptModal = () => {
    setShowPrompt(false);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Query Analysis</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <LoadingIndicator>Analyzing query...</LoadingIndicator>
          ) : error ? (
            <>
              <ErrorMessage>
                <strong>Error analyzing query:</strong> {error}
              </ErrorMessage>
              {originalQuery && (
                <AnalysisSection>
                  <SectionTitle>Original Query</SectionTitle>
                  <CodeBlock>{originalQuery}</CodeBlock>
                  <InfoBox>
                    Note: Not all query types are supported by ClickHouse EXPLAIN. This feature works best with SELECT queries.
                    <br />For example, queries with FORMAT specifications or TABLE statements may not be analyzable.
                  </InfoBox>
                </AnalysisSection>
              )}
            </>
          ) : (
            <>
              <AnalysisSection>
                <SectionTitle>Original Query</SectionTitle>
                <CodeBlock>{originalQuery}</CodeBlock>
              </AnalysisSection>
              
              <TabsContainer>
                <Tab 
                  active={activeTab === 'plan'} 
                  onClick={() => setActiveTab('plan')}
                >
                  Execution Plan {hasPlanError && '⚠️'}
                </Tab>
                <Tab 
                  active={activeTab === 'syntax'} 
                  onClick={() => setActiveTab('syntax')}
                >
                  Syntax {hasSyntaxError && '⚠️'}
                </Tab>
                <Tab 
                  active={activeTab === 'pipeline'} 
                  onClick={() => setActiveTab('pipeline')}
                >
                  Pipeline {hasPipelineError && '⚠️'}
                </Tab>
                <AITab 
                  active={activeTab === 'ai'} 
                  onClick={() => setActiveTab('ai')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path>
                    <path d="M7 10v2a5 5 0 0 0 10 0v-2"></path>
                  </svg>
                  AI Analysis
                </AITab>
              </TabsContainer>
              
              {activeTab === 'plan' && (
                <AnalysisSection>
                  {hasPlanError ? (
                    <WarningMessage>
                      <strong>Plan analysis failed:</strong> {analysis.planError}
                    </WarningMessage>
                  ) : (
                    <CodeBlock>
                      {analysis?.plan && analysis.plan.length > 0 
                        ? formatJSON(analysis.plan) 
                        : 'No plan data available'}
                    </CodeBlock>
                  )}
                </AnalysisSection>
              )}
              
              {activeTab === 'syntax' && (
                <AnalysisSection>
                  {hasSyntaxError ? (
                    <WarningMessage>
                      <strong>Syntax analysis failed:</strong> {analysis.syntaxError}
                    </WarningMessage>
                  ) : (
                    <CodeBlock>
                      {analysis?.syntax && analysis.syntax.length > 0
                        ? formatJSON(analysis.syntax) 
                        : 'No syntax data available'}
                    </CodeBlock>
                  )}
                </AnalysisSection>
              )}
              
              {activeTab === 'pipeline' && (
                <AnalysisSection>
                  {hasPipelineError ? (
                    <WarningMessage>
                      <strong>Pipeline analysis failed:</strong> {analysis.pipelineError}
                    </WarningMessage>
                  ) : (
                    <CodeBlock>
                      {analysis?.pipeline && analysis.pipeline.length > 0
                        ? formatJSON(analysis.pipeline) 
                        : 'No pipeline data available or not applicable for this query'}
                    </CodeBlock>
                  )}
                </AnalysisSection>
              )}
              
              {activeTab === 'ai' && (
                <AnalysisSection>
                  {loadingAI ? (
                    <LoadingIndicator>Getting AI recommendations...</LoadingIndicator>
                  ) : aiError ? (
                    <ErrorMessage>
                      <strong>AI analysis error:</strong> {aiError}
                      <AIRequestButton onClick={handleRequestAIAnalysis}>
                        Try Again
                      </AIRequestButton>
                    </ErrorMessage>
                  ) : aiRecommendations ? (
                    <>
                      <AIResponseBlock>
                        <ReactMarkdown>
                          {aiRecommendations}
                        </ReactMarkdown>
                      </AIResponseBlock>
                      <ButtonGroup>
                        <CopyPromptButton 
                          onClick={handleViewPrompt}
                          disabled={loadingPrompt}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                          {loadingPrompt ? 'Loading...' : 'View Prompt'}
                        </CopyPromptButton>
                      </ButtonGroup>
                    </>
                  ) : (
                    <div>
                      <p>Get AI-powered optimization recommendations for your query.</p>
                      <InfoBox>
                        The AI will analyze your query and execution plan to suggest specific ClickHouse optimizations.
                        <br />
                        Results will be formatted using markdown for better readability.
                      </InfoBox>
                      <AIRequestButton 
                        onClick={handleRequestAIAnalysis}
                        disabled={loading || !analysis}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                        Ask AI for Optimization Advice
                      </AIRequestButton>
                    </div>
                  )}
                </AnalysisSection>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
      
      {showPrompt && (
        <PromptModal onClick={handleClosePromptModal}>
          <PromptContent onClick={e => e.stopPropagation()}>
            <PromptHeader>
              <ModalTitle>AI Prompt</ModalTitle>
              <CloseButton onClick={handleClosePromptModal}>&times;</CloseButton>
            </PromptHeader>
            <PromptBody>
              <PromptText>{prompt}</PromptText>
            </PromptBody>
            <PromptActions>
              <CopyPromptButton onClick={handleCopyPrompt}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                Copy to Clipboard
              </CopyPromptButton>
            </PromptActions>
          </PromptContent>
        </PromptModal>
      )}
      
      {showCopySuccess && (
        <CopySuccessToast>Prompt copied to clipboard!</CopySuccessToast>
      )}
    </ModalOverlay>
  );
}

export default QueryAnalysisModal; 