import React, { useRef, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { ChatMessage } from '../../../types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

const ChatBoxSection: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { messages, isLoading } = state.chat;
  const { rightSidebarVisible } = state.ui;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggleSources = () => {
    dispatch({ type: 'SET_RIGHT_SIDEBAR_VISIBLE', payload: !rightSidebarVisible });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_CHAT_LOADING', payload: true });

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Tôi hiểu bạn đã hỏi: "${content}". Đây là một phản hồi mẫu từ AI. Trong thực tế, điều này sẽ được kết nối với một dịch vụ AI thực sự.`,
        sender: 'ai',
        timestamp: new Date(),
        sources: [
          {
            id: '1',
            name: 'Credit_Default_Swap.pdf',
            type: 'document',
            timestamp: new Date(),
            icon: '📄',
            size: '2.3 MB'
          }
        ]
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiMessage });
      dispatch({ type: 'SET_CHAT_LOADING', payload: false });
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Trò chuyện với AI</h2>
            <p className="text-sm text-gray-400">Hỏi bất cứ điều gì về dữ liệu kết nối</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Sources toggle button */}
            <button
              onClick={handleToggleSources}
              className={`
                flex items-center text-xs px-3 py-1.5 rounded-full border transition-all duration-200
                ${rightSidebarVisible
                  ? 'text-blue-400 bg-blue-500/20 border-blue-500/40 shadow-sm'
                  : 'text-gray-400 bg-gray-500/10 border-gray-500/20 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20'
                }
              `}
              title={rightSidebarVisible ? 'Ẩn nguồn gần đây' : 'Hiện nguồn gần đây'}
            >
              <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">Nguồn</span>
              <div className={`w-1.5 h-1.5 rounded-full ml-1.5 transition-colors ${rightSidebarVisible ? 'bg-blue-400' : 'bg-green-500'}`}></div>
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              + Cuộc trò chuyện mới
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Bắt đầu cuộc trò chuyện</h3>
              <p className="text-gray-400 max-w-md">
                Hỏi tôi về bất kỳ điều gì liên quan đến dữ liệu của bạn, tài liệu hoặc các kết nối MCP.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">AI đang trả lời...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 p-4 border-t border-gray-700">
        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatBoxSection;