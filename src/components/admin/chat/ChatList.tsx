
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2, MessageCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Chat } from '@/components/admin/chat/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChatListProps {
  chats: Chat[];
  loading: boolean;
  onSelectChat: (chat: Chat) => void;
  onDeleteClick: (chat: Chat, e: React.MouseEvent) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ChatList = ({ chats, loading, onSelectChat, onDeleteClick, activeTab, onTabChange }: ChatListProps) => {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-2 text-gray-500">Loading conversations...</p>
      </div>
    );
  }

  const filteredChats = activeTab === 'all' 
    ? chats 
    : activeTab === 'messages' 
      ? chats.filter(chat => !chat.type || chat.type === 'chat')
      : chats.filter(chat => chat.type === 'request');

  if (filteredChats.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        {activeTab === 'messages' 
          ? "No chat messages available" 
          : activeTab === 'requests' 
            ? "No service requests available" 
            : "No communications available"}
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="mb-6">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredChats.map(chat => (
          <Card 
            key={chat.id} 
            className={cn(
              "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
              chat.unread > 0 ? "border-l-4 border-l-primary" : ""
            )}
            onClick={() => onSelectChat(chat)}
          >
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback className={chat.type === 'request' ? "bg-amber-100 text-amber-800" : ""}>
                  {chat.type === 'request' ? <FileText className="h-4 w-4" /> : chat.userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      {chat.userInfo?.firstName && chat.userInfo?.lastName 
                        ? `${chat.userInfo.firstName} ${chat.userInfo.lastName}` 
                        : chat.userName}
                      {chat.type === 'request' && (
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                          Request
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-col gap-0.5">
                      {chat.roomNumber && (
                        <p className="text-xs text-primary font-medium">Room: {chat.roomNumber}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{chat.lastActivity}</span>
                </div>
                {chat.messages.length > 0 && (
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {chat.messages[chat.messages.length - 1].text}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2">
                  {chat.unread > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {chat.unread} new {chat.unread === 1 ? 'message' : 'messages'}
                    </span>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1 h-auto ml-auto"
                    onClick={(e) => onDeleteClick(chat, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete conversation</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
