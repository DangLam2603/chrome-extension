import React from 'react';
import { MCPConnection } from '../../../types';

interface MCPConnectionCardProps {
  connection: MCPConnection;
  onToggle: () => void;
  onConfigure: () => void;
  onDelete: () => void;
}

const MCPConnectionCard: React.FC<MCPConnectionCardProps> = ({
  connection,
  onToggle,
  onConfigure,
  onDelete
}) => {
  const getStatusColor = (status: MCPConnection['status']) => {
    switch (status) {
      case 'connected':
        return 'text-green-400 bg-green-400/10';
      case 'syncing':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'disconnected':
        return 'text-gray-400 bg-gray-400/10';
      case 'error':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusText = (status: MCPConnection['status']) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'syncing':
        return 'Syncing';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const formatLastSync = (lastSync: Date) => {
    const now = new Date();
    const date = new Date(lastSync);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{connection.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{connection.name}</h3>
            <p className="text-sm text-gray-400">{connection.description}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connection.status)}`}>
          <div className="flex items-center space-x-1">
            {connection.status === 'syncing' && (
              <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
            )}
            <span>{getStatusText(connection.status)}</span>
          </div>
        </div>
      </div>

      {/* Last Sync */}
      <div className="mb-4">
        <p className="text-xs text-gray-500">Last sync: {formatLastSync(connection.lastSync)}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <button
            onClick={onConfigure}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Configure"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${connection.status === 'connected' || connection.status === 'syncing'
              ? 'bg-blue-600'
              : 'bg-gray-600'
            }`}
          disabled={connection.status === 'syncing'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${connection.status === 'connected' || connection.status === 'syncing'
                ? 'translate-x-6'
                : 'translate-x-1'
              }`}
          />
        </button>
      </div>
    </div>
  );
};

export default MCPConnectionCard;