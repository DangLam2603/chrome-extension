import React from 'react';
import { SourceItem } from '../../types';

interface RightSidebarProps {
  visible: boolean;
  content: 'sources' | 'none';
  sources?: SourceItem[];
}

const RightSidebar: React.FC<RightSidebarProps> = ({ visible, content, sources = [] }) => {
  if (!visible || content === 'none') {
    return null;
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return '📄';
      case 'file':
        return '📁';
      case 'web':
        return '🌐';
      case 'chat':
        return '💬';
      default:
        return '📄';
    }
  };

  const formatFileSize = (size?: string) => {
    if (!size) return '';
    return ` • ${size}`;
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  return (
    <div className="w-80 sm:w-72 md:w-80 bg-gray-800 border-l border-gray-700 flex-shrink-0 h-full overflow-hidden">
      {content === 'sources' && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Nguồn gần đây</h3>
                <p className="text-sm text-gray-400 mt-1">Tài liệu và tệp đã sử dụng</p>
              </div>
              {/* Close button for mobile - will be handled by parent component */}
            </div>
          </div>

          {/* Sources List */}
          <div className="flex-1 overflow-y-auto">
            {sources.length === 0 ? (
              <div className="p-4 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Chưa có nguồn dữ liệu nào</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg flex-shrink-0 mt-0.5">
                        {getSourceIcon(source.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">
                          {source.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimeAgo(source.timestamp)}
                          {formatFileSize(source.size)}
                        </p>
                        {source.path && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {source.path}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sample Sources for Demo */}
          <div className="p-4 space-y-3 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Tài liệu mẫu</h4>

            <div className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer">
              <div className="flex items-start space-x-3">
                <span className="text-lg flex-shrink-0 mt-0.5">📄</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white">Banking Terms</h4>
                  <p className="text-xs text-gray-400 mt-1">Credit_Default_Swap.pdf</p>
                  <p className="text-xs text-gray-400">Sử dụng 2 phút trước</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer">
              <div className="flex items-start space-x-3">
                <span className="text-lg flex-shrink-0 mt-0.5">📊</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white">Finance Docs</h4>
                  <p className="text-xs text-gray-400 mt-1">derivatives_overview.docx</p>
                  <p className="text-xs text-gray-400">Sử dụng 15 phút trước</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer">
              <div className="flex items-start space-x-3">
                <span className="text-lg flex-shrink-0 mt-0.5">💬</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white">Team Chat</h4>
                  <p className="text-xs text-gray-400 mt-1">#finance-discussion</p>
                  <p className="text-xs text-gray-400">Sử dụng 1 giờ trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;