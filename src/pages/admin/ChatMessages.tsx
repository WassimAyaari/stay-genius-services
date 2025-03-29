import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, ArrowLeft, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useRoom } from '@/hooks/useRoom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'staff';
  status?: 'sent' | 'delivered' | 'read';
}

interface UserInfo {
  firstName?: string;
  lastName?: string;
  roomNumber?: string;
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
  userInfo?: UserInfo;
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
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (activeChat) {
      scrollToBottom();
    }
  }, [activeChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChats = async () => {
    setLoading(true);
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('user_id, user_name, room_number')
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

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

      const filteredUsers = Array.from(uniqueUsers.values()).filter(user => user.userId);
      
      const userChats: Chat[] = [];
      
      for (const userInfo of filteredUsers) {
        let userDetails: UserInfo = {};
        
        try {
          const userData = localStorage.getItem(`user_data_${userInfo.userId}`);
          if (userData) {
            const parsedData = JSON.parse(userData);
            userDetails = {
              firstName: parsedData.firstName || parsedData.name?.split(' ')[0],
              lastName: parsedData.lastName || parsedData.name?.split(' ')[1],
              roomNumber: parsedData.roomNumber || userInfo.roomNumber
            };
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }

        const { data: userMessages, error: userMessagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .or(`user_id.eq.${userInfo.userId},recipient_id.eq.${userInfo.userId}`)
          .order('created_at', { ascending: true });

        if (userMessagesError) {
          console.error('Error fetching user messages:', userMessagesError);
          continue;
        }

        if (!userMessages || userMessages.length === 0) continue;

        const unreadCount = userMessages.filter(
          msg => msg.sender === 'user' && msg.status !== 'read'
        ).length || 0;

        const lastMessage = userMessages[userMessages.length - 1];
        const lastActivity = lastMessage 
          ? formatTimeAgo(new Date(lastMessage.created_at))
          : 'No activity';

        const formattedMessages: Message[] = userMessages.map(msg => ({
          id: msg.id,
          text: msg.text,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: msg.sender as 'user' | 'staff',
          status: msg.status as 'sent' | 'delivered' | 'read' | undefined
        }));

        const displayRoomNumber = userInfo.roomNumber || userDetails.roomNumber || '';

        userChats.push({
          id: userInfo.userId,
          userId: userInfo.userId,
          userName: userInfo.userName,
          roomNumber: displayRoomNumber,
          lastActivity: lastActivity,
          messages: formattedMessages,
          unread: unreadCount,
          userInfo: userDetails
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
    const unreadMessages = chat.messages.filter(
      msg => msg.sender === 'user' && msg.status !== 'read'
    );
    
    if (unreadMessages.length > 0) {
      try {
        const messageIds = unreadMessages.map(msg => msg.id);
        
        const { error } = await supabase
          .from('chat_messages')
          .update({ status: 'read' })
          .in('id', messageIds);
          
        if (error) throw error;
        
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

    const userName = activeChat.userInfo?.firstName 
      ? `${activeChat.userInfo.firstName}` 
      : activeChat.userName;

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
        description: "Your reply has been sent to " + userName,
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

  const handleDeleteClick = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the chat from being selected
    setChatToDelete(chat);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!chatToDelete) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .or(`user_id.eq.${chatToDelete.userId},recipient_id.eq.${chatToDelete.userId}`);

      if (error) throw error;

      if (activeChat && activeChat.id === chatToDelete.id) {
        setActiveChat(null);
      }

      setChats(chats.filter(chat => chat.id !== chatToDelete.id));

      toast({
        title: "Conversation supprimée",
        description: `La conversation avec ${chatToDelete.userInfo?.firstName || chatToDelete.userName} a été supprimée.`,
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la conversation.",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setChatToDelete(null);
    }
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
                            <h3 className="font-medium">
                              {chat.userInfo?.firstName && chat.userInfo?.lastName 
                                ? `${chat.userInfo.firstName} ${chat.userInfo.lastName}` 
                                : chat.userName}
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
                            onClick={(e) => handleDeleteClick(chat, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete conversation</span>
                          </Button>
                        </div>
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
                            <h3 className="font-medium">
                              {chat.userInfo?.firstName && chat.userInfo?.lastName 
                                ? `${chat.userInfo.firstName} ${chat.userInfo.lastName}` 
                                : chat.userName}
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
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                            {chat.unread} new {chat.unread === 1 ? 'message' : 'messages'}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1 h-auto ml-auto"
                            onClick={(e) => handleDeleteClick(chat, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete conversation</span>
                          </Button>
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
              <AvatarFallback>
                {activeChat.userInfo?.firstName 
                  ? activeChat.userInfo.firstName.charAt(0) 
                  : activeChat.userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-medium">
                {activeChat.userInfo?.firstName && activeChat.userInfo?.lastName 
                  ? `${activeChat.userInfo.firstName} ${activeChat.userInfo.lastName}` 
                  : activeChat.userName}
              </h2>
              <div className="flex items-center gap-2 text-xs">
                {activeChat.roomNumber && (
                  <p className="font-medium text-primary">Room: {activeChat.roomNumber}</p>
                )}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => handleDeleteClick(activeChat, e)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
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
                      {message.sender === 'user' && (
                        <div className="text-xs font-medium mb-1 text-muted-foreground">
                          {activeChat.userInfo?.firstName || activeChat.userName}
                        </div>
                      )}
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
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </Card>
          
          <div className="flex items-center gap-2">
            <Textarea 
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder={`Type your reply to ${activeChat.userInfo?.firstName || activeChat.userName}...`}
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette conversation avec {chatToDelete?.userInfo?.firstName || chatToDelete?.userName} ?
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatMessages;
