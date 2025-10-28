import React from 'react';
import { useAppContext } from '../../../context/AppContext';
import { MCPConnection } from '../../../types';
import MCPConnectionCard from './MCPConnectionCard';

const MCPManagementSection: React.FC = () => {
  const { state } = useAppContext();
  const { connections, isLoading } = state.mcp;

  // Sample MCP connections for demo
  const sampleConnections: MCPConnection[] = [
    {
      id: '1',
      name: 'Local Files',
      type: 'local-files',
      status: 'connected',
      lastSync: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      description: 'Desktop & Documents',
      icon: '📁',
      settings: {}
    },
    {
      id: '2',
      name: 'SharePoint',
      type: 'sharepoint',
      status: 'connected',
      lastSync: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      description: 'Corporate Documents',
      icon: '🏢',
      settings: {}
    },
    {
      id: '3',
      name: 'Confluence',
      type: 'confluence',
      status: 'disconnected',
      lastSync: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      description: 'Wiki & Knowledge Base',
      icon: '📚',
      settings: {}
    },
    {
      id: '4',
      name: 'Google Drive',
      type: 'google-drive',
      status: 'connected',
      lastSync: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      description: 'Cloud Storage',
      icon: '☁️',
      settings: {}
    },
    {
      id: '5',
      name: 'Notion',
      type: 'notion',
      status: 'syncing',
      lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      description: 'Workspace & Notes',
      icon: '📝',
      settings: {}
    },
    {
      id: '6',
      name: 'Slack',
      type: 'slack',
      status: 'connected',
      lastSync: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      description: 'Team Communication',
      icon: '💬',
      settings: {}
    }
  ];

  const displayConnections = connections.length > 0 ? connections : sampleConnections;

  const handleAddConnection = () => {
    // TODO: Implement add connection modal
    console.log('Add new connection');
  };

  const handleToggleConnection = (id: string) => {
    // TODO: Implement connection toggle
    console.log('Toggle connection:', id);
  };

  const handleConfigureConnection = (id: string) => {
    // TODO: Implement connection configuration
    console.log('Configure connection:', id);
  };

  const handleDeleteConnection = (id: string) => {
    // TODO: Implement connection deletion
    console.log('Delete connection:', id);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải kết nối MCP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Quản lý Kết nối MCP</h2>
            <p className="text-gray-400 mt-1">Kết nối và quản lý các nguồn dữ liệu bên ngoài</p>
          </div>
          <button
            onClick={handleAddConnection}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Thêm Kết nối</span>
          </button>
        </div>
      </div>

      {/* Connections Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {displayConnections.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Chưa có kết nối nào</h3>
              <p className="text-gray-400 max-w-md mb-4">
                Thêm kết nối MCP để truy cập dữ liệu từ các nguồn bên ngoài như SharePoint, Google Drive, Notion và nhiều hơn nữa.
              </p>
              <button
                onClick={handleAddConnection}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Thêm Kết nối Đầu tiên
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayConnections.map((connection) => (
              <MCPConnectionCard
                key={connection.id}
                connection={connection}
                onToggle={() => handleToggleConnection(connection.id)}
                onConfigure={() => handleConfigureConnection(connection.id)}
                onDelete={() => handleDeleteConnection(connection.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MCPManagementSection;