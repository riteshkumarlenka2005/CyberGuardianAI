
import React from 'react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isScammer = message.role === 'scammer';
  
  return (
    <div className={`flex ${isScammer ? 'justify-start' : 'justify-end'} animate-slide-up`}>
      <div className={`max-w-[80%] flex ${isScammer ? 'flex-row' : 'flex-row-reverse'} items-start gap-3`}>
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs shadow-sm ${
          isScammer ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-600 text-white'
        }`}>
          {isScammer ? 'S' : 'U'}
        </div>
        <div>
          <div className={`px-5 py-3 rounded-2xl shadow-sm border ${
            isScammer 
              ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-tl-none text-slate-800 dark:text-slate-200' 
              : 'bg-blue-500 dark:bg-blue-600 border-blue-400 dark:border-blue-500 text-white rounded-tr-none'
          }`}>
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <p className={`text-[10px] mt-1 text-slate-400 dark:text-slate-500 ${isScammer ? 'text-left' : 'text-right'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
