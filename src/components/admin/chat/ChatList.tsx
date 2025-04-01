
import React from 'react';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Chat } from './types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatTimeAgo } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ChatListProps {
  chats: Chat[];
  loading: boolean;
  onSelectChat: (chat: Chat) => void;
  onDeleteClick: (chat: Chat, e: React.MouseEvent) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  loading,
  onSelectChat,
  onDeleteClick,
  activeTab,
  onTabChange
}) => {
  return (
    <Card>
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {chats.filter(chat => chat.unread > 0).length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {chats.filter(chat => chat.unread > 0).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <CardContent className="p-0 pt-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-muted-foreground">No messages found</p>
            </div>
          ) : (
            <div className="divide-y">
              {chats.map((chat) => {
                // Get full guest name if available, with proper fallback
                const guestName = chat.userInfo && 
                  (chat.userInfo.firstName || chat.userInfo.lastName) ? 
                  `${chat.userInfo?.firstName || ''} ${chat.userInfo?.lastName || ''}`.trim() : 
                  null;

                return (
                  <div 
                    key={chat.id} 
                    className="hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => onSelectChat(chat)}
                  >
                    <div className="flex items-start p-4 gap-3 relative">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {guestName ? guestName.charAt(0) : chat.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">
                            {guestName || chat.userName}
                            {chat.unread > 0 && (
                              <Badge variant="default" className="ml-2">
                                {chat.unread} new
                              </Badge>
                            )}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(new Date(chat.lastActivity))}
                          </span>
                        </div>
                        
                        <div className="flex flex-col mt-1">
                          {chat.roomNumber && (
                            <p className="text-xs text-muted-foreground">
                              Room: {chat.roomNumber}
                            </p>
                          )}
                          
                          {/* Display Guest name prominently */}
                          {guestName && (
                            <p className="text-xs font-medium text-primary">
                              Guest: {guestName}
                            </p>
                          )}
                          
                          {/* Only display username if different from the guest name */}
                          {guestName && chat.userName !== guestName && (
                            <p className="text-xs text-muted-foreground">
                              Username: {chat.userName}
                            </p>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {chat.messages.length > 0 ? chat.messages[0].text : 'No messages'}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => onDeleteClick(chat, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default ChatList;
