
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, ArrowLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'staff';
  status?: 'sent' | 'delivered' | 'read';
}

interface Chat {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastActivity: string;
  messages: Message[];
  unread: number;
  roomNumber?: string;
}

interface ChatMessage {
  id: string;
  user_id: string;
  user_name: string;
  room_number?: string;
  recipient_id?: string;
  text: string;
  sender: 'user' | 'staff';
  status?: 'sent' | 'delivered' | 'read';
  created_at: string;
}

const ChatMessages = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    try {
      // Fetch all unique users who have sent messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('user_id, user_name, room_number')
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Create a map to deduplicate users
      const uniqueUsers = new Map();
      messagesData?.forEach(msg => {
        if (msg.user_id && !uniqueUsers.has(msg.user_id)) {
          uniqueUsers.set(msg.user_id, {
            userId: msg.user_id,
            userName: msg.user_name || 'Guest',
            roomNumber: msg.room_number
          });
        }
      });

      // For each unique user, fetch their conversation
      const userChats: Chat[] = [];
      
      for (const [userId, userInfo] of uniqueUsers.entries()) {
        const { data: userMessages, error: userMessagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .or(`user_id.eq.${userId},recipient_id.eq.${userId}`)
          .order('created_at', { ascending: true });

        if (userMessagesError) {
          console.error('Error fetching user messages:', userMessagesError);
          continue;
        }

        if (!userMessages || userMessages.length === 0) continue;

        // Count unread messages
        const unreadCount = userMessages.filter(
          msg => msg.sender === 'user' && msg.status !== 'read'
        ).length || 0;

        // Get last message timestamp for "last activity"
        const lastMessage = userMessages[userMessages.length - 1];
        const lastActivity = lastMessage 
          ? formatTimeAgo(new Date(lastMessage.created_at))
          : 'No activity';

        // Format messages for our Chat interface
        const formattedMessages: Message[] = userMessages.map(msg => ({
          id: msg.id,
          text: msg.text,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: msg.sender as 'user' | 'staff',
          status: msg.status as 'sent' | 'delivered' | 'read' | undefined
        }));

        userChats.push({
          id: userId,
          userId: userId,
          userName: userInfo.userName,
          roomNumber: userInfo.roomNumber,
          lastActivity: lastActivity,
          messages: formattedMessages,
          unread: unreadCount
        });
      }

      setChats(userChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast({
        title: "Error loading chats",
        description: "There was a problem loading the chat data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const handleSelectChat = async (chat: Chat) => {
    // Mark messages as read when opening the chat
    const unreadMessages = chat.messages.filter(
      msg => msg.sender === 'user' && msg.status !== 'read'
    );
    
    if (unreadMessages.length > 0) {
      try {
        const messageIds = unreadMessages.map(msg => msg.id);
        
        // Update messages status in the database
        const { error } = await supabase
          .from('chat_messages')
          .update({ status: 'read' })
          .in('id', messageIds);
          
        if (error) throw error;
        
        // Update the local state
        const updatedMessages = chat.messages.map(msg => {
          if (msg.sender === 'user' && msg.status !== 'read') {
            return { ...msg, status: 'read' as const };
          }
          return msg;
        });
        
        const updatedChat = {
          ...chat,
          unread: 0,
          messages: updatedMessages
        };
        
        setChats(chats.map(c => c.id === chat.id ? updatedChat : c));
        setActiveChat(updatedChat);
      } catch (error) {
        console.error('Error marking messages as read:', error);
        toast({
          title: "Error",
          description: "Could not mark messages as read.",
          variant: "destructive"
        });
        setActiveChat(chat);
      }
    } else {
      setActiveChat(chat);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !activeChat) return;

    const newMessage = {
      text: replyMessage,
      sender: 'staff' as const,
      user_id: activeChat.userId,
      user_name: activeChat.userName,
      recipient_id: activeChat.userId,
      room_number: activeChat.roomNumber,
      status: 'sent',
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert(newMessage)
        .select();

      if (error) throw error;

      const sentMessage: Message = {
        id: data[0].id,
        text: replyMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'staff',
        status: 'sent'
      };

      const updatedChat = {
        ...activeChat,
        messages: [...activeChat.messages, sentMessage],
        lastActivity: 'just now'
      };

      setChats(chats.map(chat => 
        chat.id === activeChat.id ? updatedChat : chat
      ));
      setActiveChat(updatedChat);
      setReplyMessage('');

      toast({
        title: "Message sent",
        description: "Your reply has been sent to " + activeChat.userName,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Your message could not be sent. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBackToList = () => {
    setActiveChat(null);
  };

  const getFilteredChats = () => {
    if (currentTab === 'all') return chats;
    if (currentTab === 'unread') return chats.filter(chat => chat.unread > 0);
    return chats;
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-semibold mb-6">Chat Messages</h1>
      
      {!activeChat ? (
        <>
          <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Chats</TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({chats.reduce((count, chat) => count + (chat.unread > 0 ? 1 : 0), 0)})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {loading ? (
                <div className="text-center py-10">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  <p className="mt-2 text-gray-500">Loading conversations...</p>
                </div>
              ) : getFilteredChats().length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No chat messages available
                </div>
              ) : (
                getFilteredChats().map(chat => (
                  <Card 
                    key={chat.id} 
                    className={cn(
                      "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                      chat.unread > 0 ? "border-l-4 border-l-primary" : ""
                    )}
                    onClick={() => handleSelectChat(chat)}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>{chat.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div>
                            <h3 className="font-medium">{chat.userName}</h3>
                            {chat.roomNumber && (
                              <p className="text-xs text-muted-foreground">Room: {chat.roomNumber}</p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{chat.lastActivity}</span>
                        </div>
                        {chat.messages.length > 0 && (
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.messages[chat.messages.length - 1].text}
                          </p>
                        )}
                        {chat.unread > 0 && (
                          <div className="mt-2">
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                              {chat.unread} new {chat.unread === 1 ? 'message' : 'messages'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="unread" className="space-y-4">
              {loading ? (
                <div className="text-center py-10">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  <p className="mt-2 text-gray-500">Loading conversations...</p>
                </div>
              ) : getFilteredChats().length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No unread messages
                </div>
              ) : (
                getFilteredChats().map(chat => (
                  <Card 
                    key={chat.id} 
                    className="p-4 border-l-4 border-l-primary cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSelectChat(chat)}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>{chat.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div>
                            <h3 className="font-medium">{chat.userName}</h3>
                            {chat.roomNumber && (
                              <p className="text-xs text-muted-foreground">Room: {chat.roomNumber}</p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{chat.lastActivity}</span>
                        </div>
                        {chat.messages.length > 0 && (
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.messages[chat.messages.length - 1].text}
                          </p>
                        )}
                        <div className="mt-2">
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                            {chat.unread} new {chat.unread === 1 ? 'message' : 'messages'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="flex flex-col h-[calc(100vh-12rem)]">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBackToList}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarFallback>{activeChat.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium">{activeChat.userName}</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <p>User ID: {activeChat.userId}</p>
                {activeChat.roomNumber && (
                  <p className="font-medium text-primary">Room: {activeChat.roomNumber}</p>
                )}
              </div>
            </div>
          </div>
          
          <Card className="flex-1 mb-4 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {activeChat.messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={cn(
                      "flex", 
                      message.sender === 'staff' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div 
                      className={cn(
                        "max-w-[80%] px-4 py-2 rounded-2xl", 
                        message.sender === 'staff' 
                          ? "bg-primary text-primary-foreground rounded-tr-none" 
                          : "bg-muted rounded-tl-none"
                      )}
                    >
                      <p className="text-sm">{message.text}</p>
                      <div className="flex justify-end items-center gap-1 mt-1 text-xs opacity-70">
                        <span>{message.time}</span>
                        {message.sender === 'staff' && message.status && (
                          <span>
                            {message.status === 'read' && '✓✓'}
                            {message.status === 'delivered' && '✓✓'}
                            {message.status === 'sent' && '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
          
          <div className="flex items-center gap-2">
            <Textarea 
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply..."
              className="resize-none min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
            />
            <Button 
              onClick={handleSendReply}
              disabled={!replyMessage.trim()}
              className="self-end h-10"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
