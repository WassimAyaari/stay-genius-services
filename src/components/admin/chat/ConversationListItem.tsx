import React from 'react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { Conversation } from '@/types/chat';

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  unreadCount?: number;
}

export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  isSelected,
  onClick,
  unreadCount = 0
}) => {
  const initials = conversation.guest_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors border-l-[3px]",
        isSelected
          ? "bg-muted border-l-primary"
          : "border-l-transparent"
      )}
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm truncate">{conversation.guest_name}</span>
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
            {unreadCount > 0 && (
              <span className="min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: false })}
            </span>
          </div>
        </div>
        {conversation.room_number && (
          <p className="text-xs text-muted-foreground truncate">Room {conversation.room_number}</p>
        )}
      </div>
    </div>
  );
};
