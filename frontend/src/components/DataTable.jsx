import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  min-width: 100%;
`;

const TableHeader = styled.thead`
  background-color: #f5f5f5;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 500;
  color: #616161;
  border-bottom: 1px solid #e0e0e0;
`;

const TableCell = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e0e0e0;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem 0;
`;

const PaginationButton = styled.button`
  background: ${props => props.disabled ? '#e0e0e0' : '#1976d2'};
  color: ${props => props.disabled ? '#9e9e9e' : 'white'};
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

const PageInfo = styled.span`
  margin: 0 1rem;
`;

function DataTable({ data, columns, pageSize = 10 }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  
  if (!data || data.length === 0) {
    return <div className="loading">No data available</div>;
  }
  
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  return (
    <>
      <TableContainer>
        <StyledTable>
          <TableHeader>
            <tr>
              {columns.map((column, index) => (
                <TableHeaderCell key={index}>{column.header}</TableHeaderCell>
              ))}
            </tr>
          </TableHeader>
          <TableBody>
            {currentData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {typeof column.accessor === 'function' 
                      ? column.accessor(row) 
                      : row[column.accessor]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationButton 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
          >
            Previous
          </PaginationButton>
          <PageInfo>
            Page {currentPage} of {totalPages}
          </PageInfo>
          <PaginationButton 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
          >
            Next
          </PaginationButton>
        </Pagination>
      )}
    </>
  );
}

export default DataTable; 