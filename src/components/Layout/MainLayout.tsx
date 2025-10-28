import React from 'react';
import { SectionType } from '../../types';

interface MainLayoutProps {
  activeSection: SectionType;
  leftNavCollapsed: boolean;
  rightSidebarVisible: boolean;
  children: React.ReactNode;
  leftNavigation: React.ReactNode;
  rightSidebar?: React.ReactNode;

}

const MainLayout: React.FC<MainLayoutProps> = ({
  leftNavCollapsed,
  rightSidebarVisible,
  children,
  leftNavigation,
  rightSidebar
}) => {
  const shouldShowRightSidebar = rightSidebarVisible && rightSidebar;

  return (
    <div className="h-screen bg-gray-900 text-white flex overflow-hidden relative">
      {/* Left Navigation Sidebar */}
      <div className={`
        bg-gray-800 border-r border-gray-700 transition-all duration-300 flex-shrink-0
        ${leftNavCollapsed ? 'w-16' : 'w-64'}
      `}>
        {leftNavigation}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-w-0 relative">
        <div className="flex-1 overflow-hidden relative">
          {children}


        </div>

        {/* Right Sidebar (Contextual) */}
        {shouldShowRightSidebar && (
          <div className="flex-shrink-0">
            {rightSidebar}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;