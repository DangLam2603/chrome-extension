import React from 'react';
import { SectionType } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface NavItem {
  id: SectionType;
  icon: React.ReactNode;
  label: string;
  tooltip: string;
}

const navItems: NavItem[] = [
  {
    id: 'chatbox',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    label: 'ChatBox',
    tooltip: 'Trò chuyện với AI'
  },
  {
    id: 'mcp',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    label: 'MCP Management',
    tooltip: 'Quản lý Kết nối MCP'
  },
  {
    id: 'autoconnect',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: 'Auto-Connect',
    tooltip: 'Tác nhận tự động'
  }
];

const LeftNavigation: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { activeSection, leftNavCollapsed } = state.ui;

  const handleSectionChange = (section: SectionType) => {
    dispatch({ type: 'SET_ACTIVE_SECTION', payload: section });
  };

  const toggleCollapse = () => {
    dispatch({ type: 'TOGGLE_LEFT_NAV' });
  };

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!leftNavCollapsed && (
            <h1 className="text-lg font-semibold text-white">Extension</h1>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            title={leftNavCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={leftNavCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleSectionChange(item.id)}
                className={`
                  w-full flex items-center p-3 rounded-lg transition-all duration-200
                  ${activeSection === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                  ${leftNavCollapsed ? 'justify-center' : 'justify-start'}
                `}
                title={leftNavCollapsed ? item.tooltip : ''}
              >
                <span className="flex-shrink-0">
                  {item.icon}
                </span>
                {!leftNavCollapsed && (
                  <span className="ml-3 text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className={`flex items-center ${leftNavCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!leftNavCollapsed && (
            <div className="text-xs text-gray-400">
              v1.0.0
            </div>
          )}
          <button
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            title="Settings"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftNavigation;