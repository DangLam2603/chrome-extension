import React from 'react';
import { useAppContext } from '../../../context/AppContext';
import { AutoConnectRule } from '../../../types';
import AutoConnectRuleCard from './AutoConnectRuleCard';

const AutoConnectSection: React.FC = () => {
  const { state } = useAppContext();
  const { rules, isLoading } = state.autoConnect;

  // Sample auto-connect rules for demo
  const sampleRules: AutoConnectRule[] = [
    {
      id: '1',
      name: 'Hỗ trợ dịch thuật',
      description: 'Giúp bạn dịch nhanh và chính xác các tài liệu từ nhiều ngôn ngữ khác nhau.',
      type: 'translation',
      status: 'active',
      trigger: {
        type: 'url-pattern',
        value: '*translate*'
      },
      action: {
        type: 'auto-translate',
        config: { targetLanguage: 'vi' }
      },
      lastRun: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    },
    {
      id: '2',
      name: 'Content Writer',
      description: 'Giúp bạn sáng tạo và tối ưu nội dung cho nhiều mục đích khác nhau.',
      type: 'content-writer',
      status: 'active',
      trigger: {
        type: 'content-type',
        value: 'text/html'
      },
      action: {
        type: 'content-optimization',
        config: { style: 'professional' }
      },
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: '3',
      name: 'Phân tích dữ liệu',
      description: 'Giúp bạn phân tích dữ liệu, tạo báo cáo và rút ra những insight quan trọng để hỗ trợ quyết định.',
      type: 'data-analysis',
      status: 'inactive',
      trigger: {
        type: 'schedule',
        value: '0 9 * * 1' // Every Monday at 9 AM
      },
      action: {
        type: 'data-report',
        config: { format: 'pdf' }
      }
    }
  ];

  const displayRules = rules.length > 0 ? rules : sampleRules;

  const handleCreateRule = () => {
    // TODO: Implement create rule modal
    console.log('Create new rule');
  };

  const handleToggleRule = (id: string) => {
    // TODO: Implement rule toggle
    console.log('Toggle rule:', id);
  };

  const handleEditRule = (id: string) => {
    // TODO: Implement rule editing
    console.log('Edit rule:', id);
  };

  const handleDeleteRule = (id: string) => {
    // TODO: Implement rule deletion
    console.log('Delete rule:', id);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải quy tắc tự động...</p>
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
            <h2 className="text-2xl font-semibold text-white">Tác nhận tự động</h2>
            <p className="text-gray-400 mt-1">Quản lý tác nhận tự động</p>
          </div>
          <button
            onClick={handleCreateRule}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Tạo Mới</span>
          </button>
        </div>
      </div>

      {/* Rules List */}
      <div className="flex-1 overflow-y-auto p-6">
        {displayRules.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Chưa có quy tắc tự động nào</h3>
              <p className="text-gray-400 max-w-md mb-4">
                Tạo quy tắc tự động để hệ thống có thể thực hiện các tác vụ một cách tự động dựa trên điều kiện bạn đặt ra.
              </p>
              <button
                onClick={handleCreateRule}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Tạo Quy tắc Đầu tiên
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayRules.map((rule) => (
              <AutoConnectRuleCard
                key={rule.id}
                rule={rule}
                onToggle={() => handleToggleRule(rule.id)}
                onEdit={() => handleEditRule(rule.id)}
                onDelete={() => handleDeleteRule(rule.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoConnectSection;