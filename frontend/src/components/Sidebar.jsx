import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.aside`
  width: 280px;
  background-color: #1e1e2d;
  color: #a2a3b7;
  padding: 1.5rem 0;
  height: 100vh;
  overflow-y: auto;
  position: sticky;
  top: 0;
  left: 0;
`;

const Logo = styled.div`
  padding: 0 1.5rem;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.25rem;
`;

const NavLinkStyled = styled(NavLink)`
  display: block;
  padding: 0.75rem 1.5rem;
  color: #a2a3b7;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  &.active {
    background-color: #1976d2;
    color: white;
  }
`;

function Sidebar() {
  return (
    <SidebarContainer>
      <Logo>ClickHouse Metrics</Logo>
      <NavList>
        <NavItem>
          <NavLinkStyled to="/" end>Dashboard</NavLinkStyled>
        </NavItem>
        <NavItem>
          <NavLinkStyled to="/query-performance">Query Performance</NavLinkStyled>
        </NavItem>
        <NavItem>
          <NavLinkStyled to="/storage-by-table">Storage by Table</NavLinkStyled>
        </NavItem>
        <NavItem>
          <NavLinkStyled to="/disk-usage-by-database">Disk Usage by DB</NavLinkStyled>
        </NavItem>
        <NavItem>
          <NavLinkStyled to="/part-level-storage">Part-Level Storage</NavLinkStyled>
        </NavItem>
        <NavItem>
          <NavLinkStyled to="/memory-usage">Memory Usage</NavLinkStyled>
        </NavItem>
        <NavItem>
          <NavLinkStyled to="/merge-process-info">Merge Process Info</NavLinkStyled>
        </NavItem>
        <NavItem>
          <NavLinkStyled to="/active-queries">Active Queries</NavLinkStyled>
        </NavItem>
        <NavItem>
          <NavLinkStyled to="/replication-status">Replication Status</NavLinkStyled>
        </NavItem>
        <NavItem>
          <NavLinkStyled to="/slow-log-analysis">Slow Log Analysis</NavLinkStyled>
        </NavItem>
      </NavList>
    </SidebarContainer>
  );
}

export default Sidebar; 