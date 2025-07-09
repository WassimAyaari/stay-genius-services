import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center justify-start px-4 py-3">
      <div className="flex items-center space-x-3">
        <div className="bg-primary/10 p-3 rounded-lg max-w-xs border border-primary/20">
          <div className="flex items-center space-x-2">
            <div className="text-xs text-primary font-medium">Concierge is typing</div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;