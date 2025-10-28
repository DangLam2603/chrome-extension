import React from 'react';
import { AutoConnectRule } from '../../../types';

interface AutoConnectRuleCardProps {
  rule: AutoConnectRule;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const AutoConnectRuleCard: React.FC<AutoConnectRuleCardProps> = ({
  rule,
  onToggle,
  onEdit,
  onDelete
}) => {
  const getTypeIcon = (type: AutoConnectRule['type']) => {
    switch (type) {
      case 'translation':
        return '🌐';
      case 'content-writer':
        return '✍️';
      case 'data-analysis':
        return '📊';
      default:
        return '⚡';
    }
  };

  const getTypeColor = (type: AutoConnectRule['type']) => {
    switch (type) {
      case 'translation':
        return 'bg-blue-500/10 text-blue-400';
      case 'content-writer':
        return 'bg-purple-500/10 text-purple-400';
      case 'data-analysis':
        return 'bg-green-500/10 text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getStatusText = (status: AutoConnectRule['status']) => {
    return status === 'active' ? 'Active' : 'Inactive';
  };

  const formatLastRun = (lastRun?: Date) => {
    if (!lastRun) return 'Never run';

    const now = new Date();
    const date = new Date(lastRun);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getTriggerDescription = (trigger: AutoConnectRule['trigger']) => {
    switch (trigger.type) {
      case 'url-pattern':
        return `URL matches: ${trigger.value}`;
      case 'content-type':
        return `Content type: ${trigger.value}`;
      case 'schedule':
        return `Schedule: ${trigger.value}`;
      default:
        return trigger.value;
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="text-2xl mt-1">{getTypeIcon(rule.type)}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-white">{rule.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(rule.type)}`}>
                {rule.type.replace('-', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{rule.description}</p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${rule.status === 'active' ? 'bg-blue-600' : 'bg-gray-600'
            }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rule.status === 'active' ? 'translate-x-6' : 'translate-x-1'
              }`}
          />
        </button>
      </div>

      {/* Rule Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Status:</span>
          <span className={`font-medium ${rule.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
            {getStatusText(rule.status)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Trigger:</span>
          <span className="text-gray-300 text-right max-w-xs truncate">
            {getTriggerDescription(rule.trigger)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Last run:</span>
          <span className="text-gray-300">{formatLastRun(rule.lastRun)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit Rule"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            title="Delete Rule"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div className="text-xs text-gray-500">
          Rule #{rule.id}
        </div>
      </div>
    </div>
  );
};

export default AutoConnectRuleCard;