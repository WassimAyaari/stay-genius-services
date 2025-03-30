import React, { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Paperclip } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'staff';
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface ServiceChatProps {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
  userInfo: { name: string; roomNumber: string };
}

const ServiceChat = ({ isChatOpen, setIsChatOpen, userInfo }: ServiceChatProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        text: `Welcome to Hotel Genius, ${userInfo.name}! How may I assist you today?`,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        sender: 'staff'
      }]);
    }
  }, [isChatOpen, userInfo.name, messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      time: formattedTime,
      sender: 'user',
      status: 'sent'
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');

    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('user_id', userId);
    }
    
    const userData = {
      name: userInfo.name,
      roomNumber: userInfo.roomNumber
    };
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    try {
      const {
        data,
        error
      } = await supabase.from('chat_messages').insert([{
        user_id: userId,
        user_name: userInfo.name,
        room_number: userInfo.roomNumber,
        text: inputMessage,
        sender: 'user',
        status: 'sent',
        created_at: currentTime.toISOString()
      }]).select();
      
      if (inputMessage.toLowerCase().includes('request') || 
          inputMessage.toLowerCase().includes('service') ||
          inputMessage.toLowerCase().includes('clean') ||
          inputMessage.toLowerCase().includes('laundry') ||
          inputMessage.toLowerCase().includes('help') ||
          inputMessage.toLowerCase().includes('need')) {
        
        let requestType = 'general';
        if (inputMessage.toLowerCase().includes('clean')) requestType = 'cleaning';
        else if (inputMessage.toLowerCase().includes('laundry')) requestType = 'laundry';
        else if (inputMessage.toLowerCase().includes('maintenance')) requestType = 'maintenance';
        else if (inputMessage.toLowerCase().includes('food') || inputMessage.toLowerCase().includes('meal')) requestType = 'food';
        
        await supabase.from('service_requests').insert([{
          guest_id: userId,
          guest_name: userInfo.name,
          room_number: userInfo.roomNumber,
          type: requestType,
          description: inputMessage,
          status: 'pending',
          created_at: currentTime.toISOString()
        }]);
      }
      
      if (error) {
        console.error("Error saving message:", error);
        toast({
          title: "Error",
          description: "Failed to send your message. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      setTimeout(async () => {
        const staffResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thank you for your message. Our concierge team will assist you shortly.",
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          sender: 'staff'
        };
        setMessages(prevMessages => [...prevMessages, staffResponse]);
        await supabase.from('chat_messages').insert([{
          user_id: userId,
          recipient_id: userId,
          user_name: "Concierge",
          room_number: userInfo.roomNumber,
          text: staffResponse.text,
          sender: 'staff',
          status: 'sent',
          created_at: new Date().toISOString()
        }]);
        toast({
          title: "New message",
          description: "You have received a response from our concierge team."
        });
      }, 2000);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
      <SheetContent className="sm:max-w-md p-0 flex flex-col h-full">
        <SheetHeader className="h-16 border-b px-4 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {userInfo.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle>Concierge Chat</SheetTitle>
                <p className="text-xs text-muted-foreground">Room: {userInfo.roomNumber}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCloseChat}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1 px-4 py-3">
          <div className="space-y-4">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${message.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted rounded-tl-none'}`}>
                  <p>{message.text}</p>
                  <div className="flex justify-end items-center gap-1 mt-1 text-xs opacity-70">
                    <span>{message.time}</span>
                    {message.status === 'read' && <span>✓✓</span>}
                    {message.status === 'delivered' && <span>✓✓</span>}
                    {message.status === 'sent' && <span>✓</span>}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <SheetFooter className="border-t p-4 mt-auto">
          <form onSubmit={handleMessageSubmit} className="flex items-center gap-2 w-full">
            <Button type="button" variant="ghost" size="icon" className="rounded-full">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Textarea 
              value={inputMessage} 
              onChange={e => setInputMessage(e.target.value)} 
              placeholder="Type a message..." 
              className="resize-none min-h-0 h-10 py-2 rounded-full" 
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }} 
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full" 
              disabled={!inputMessage.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ServiceChat;
