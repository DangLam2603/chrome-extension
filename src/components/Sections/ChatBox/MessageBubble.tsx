import React from 'react';
import { ChatMessage } from '../../../types';

interface MessageBubbleProps {
    message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
                {!isUser && (
                    <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-sm text-gray-400">AI Assistant</span>
                    </div>
                )}

                <div className={`
          rounded-2xl px-4 py-3 text-sm
          ${isUser
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-gray-800 text-gray-100 rounded-bl-md border border-gray-700'
                    }
        `}>
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    {message.sources && message.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-600">
                            <p className="text-xs text-gray-300 mb-2">Nguồn dữ liệu tham khảo:</p>
                            <div className="bg-gray-700 rounded-lg p-2">
                                <div className="flex items-center text-xs text-gray-300">
                                    <span className="mr-2">📄</span>
                                    <span className="flex-1">{message.sources[0].name}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;