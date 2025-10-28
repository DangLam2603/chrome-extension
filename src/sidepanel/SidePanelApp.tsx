import React from 'react';
import { useAppContext } from '../context/AppContext';
import MainLayout from '../components/Layout/MainLayout';
import LeftNavigation from '../components/Navigation/LeftNavigation';
import RightSidebar from '../components/Layout/RightSidebar';
import ChatBoxSection from '../components/Sections/ChatBox/ChatBoxSection';
import MCPManagementSection from '../components/Sections/MCP/MCPManagementSection';
import AutoConnectSection from '../components/Sections/AutoConnect/AutoConnectSection';

const SidePanelApp: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { activeSection, leftNavCollapsed, rightSidebarVisible } = state.ui;
  const { sources } = state.chat;

  const handleToggleRightSidebar = () => {
    dispatch({ type: 'SET_RIGHT_SIDEBAR_VISIBLE', payload: !rightSidebarVisible });
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'chatbox':
        return <ChatBoxSection />;
      case 'mcp':
        return <MCPManagementSection />;
      case 'autoconnect':
        return <AutoConnectSection />;
      default:
        return <ChatBoxSection />;
    }
  };

  const renderRightSidebar = () => {
    if (activeSection === 'chatbox') {
      return (
        <RightSidebar
          visible={rightSidebarVisible}
          content="sources"
          sources={sources}
        />
      );
    }
    return null;
  };

  return (
    <MainLayout
      activeSection={activeSection}
      leftNavCollapsed={leftNavCollapsed}
      rightSidebarVisible={rightSidebarVisible}
      leftNavigation={<LeftNavigation />}
      rightSidebar={renderRightSidebar()}
      onToggleRightSidebar={handleToggleRightSidebar}
    >
      {renderMainContent()}
    </MainLayout>
  );
};

export default SidePanelApp;