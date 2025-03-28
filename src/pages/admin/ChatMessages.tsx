
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, ArrowLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
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

// Simulated chats for demonstration - Update with Emma Watson as first user
const initialChats: Chat[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Emma Watson',
    roomNumber: '401', // Updated to match Emma's room number
    lastActivity: '10 min ago',
    unread: 2,
    messages: [
      {
        id: '1',
        text: "Hello, I'd like to request a late check-out tomorrow.",
        time: '10:30 AM',
        sender: 'user',
      },
      {
        id: '2',
        text: "I'll check the availability and get back to you shortly.",
        time: '10:32 AM',
        sender: 'staff',
        status: 'read'
      },
      {
        id: '3',
        text: "Thank you, I appreciate it.",
        time: '10:33 AM',
        sender: 'user',
      },
      {
        id: '4',
        text: "When do you need to know by?",
        time: '10:35 AM',
        sender: 'user',
      }
    ]
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'John Smith',
    roomNumber: '302',
    lastActivity: '2 hrs ago',
    unread: 0,
    messages: [
      {
        id: '1',
        text: "I need help with the Wi-Fi connection in my room.",
        time: '8:15 AM',
        sender: 'user',
      },
      {
        id: '2',
        text: "I'll send someone from IT to assist you. What's your room number?",
        time: '8:18 AM',
        sender: 'staff',
        status: 'read'
      },
      {
        id: '3',
        text: "Room 302. Thank you!",
        time: '8:20 AM',
        sender: 'user',
      },
      {
        id: '4',
        text: "Our technician will be there in about 15 minutes.",
        time: '8:22 AM',
        sender: 'staff',
        status: 'read'
      }
    ]
  }
];

const ChatMessages = () => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const { toast } = useToast();

  const handleSelectChat = (chat: Chat) => {
    // Mark messages as read when opening the chat
    const updatedChat = {
      ...chat,
      unread: 0,
      messages: chat.messages.map(msg => {
        if (msg.sender === 'user' && !msg.status) {
          return { ...msg, status: 'read' as const };
        }
        return msg;
      })
    };
    
    // Update the chats list with the read status
    setChats(chats.map(c => c.id === chat.id ? updatedChat : c));
    setActiveChat(updatedChat);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() || !activeChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: replyMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'staff',
      status: 'sent'
    };

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
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
              {getFilteredChats().length === 0 ? (
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
              {getFilteredChats().length === 0 ? (
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
