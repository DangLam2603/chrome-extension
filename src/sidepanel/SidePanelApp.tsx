import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../components/Layout/MainLayout';
import LeftNavigation from '../components/Navigation/LeftNavigation';
import RightSidebar from '../components/Layout/RightSidebar';
import ChatBoxSection from '../components/Sections/ChatBox/ChatBoxSection';
import MCPManagementSection from '../components/Sections/MCP/MCPManagementSection';
import AutoConnectSection from '../components/Sections/AutoConnect/AutoConnectSection';
import LoginScreen from '../components/Auth/LoginScreen';

// Import debug utilities in development
if (import.meta.env.DEV) {
  import('../utils/authDebug');
}

const SidePanelApp: React.FC = () => {
  const { state } = useAppContext();
  const { activeSection, leftNavCollapsed, rightSidebarVisible } = state.ui;
  const { sources } = state.chat;
  const { isAuthChecking, isLoggedIn, refreshAuth } = useAuth();

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

  // Show loading state while checking authentication
  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={refreshAuth} />;
  }

  // Show main app if authenticated
  return (
    <MainLayout
      activeSection={activeSection}
      leftNavCollapsed={leftNavCollapsed}
      rightSidebarVisible={rightSidebarVisible}
      leftNavigation={<LeftNavigation />}
      rightSidebar={renderRightSidebar()}
    >
      {renderMainContent()}
    </MainLayout>
  );
};

export default SidePanelApp;