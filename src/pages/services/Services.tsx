
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, FileText, Clock, HeadphonesIcon, Send, X, Paperclip } from 'lucide-react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useRoom } from '@/hooks/useRoom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'staff';
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface UserInfo {
  name: string;
  roomNumber: string;
}

const Services = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUserInfoDialogOpen, setIsUserInfoDialogOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: 'Emma Watson', roomNumber: '401' });
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);

  const handleStartChat = () => {
    // Auto-fill user info already exists, proceed directly to chat
    setIsChatOpen(true);
    
    // Initialize the chat with a welcome message
    setMessages([
      {
        id: '1',
        text: `Welcome to Hotel Genius, ${userInfo.name}! How may I assist you today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'staff'
      }
    ]);
  };

  const handleSubmitUserInfo = () => {
    if (!userInfo.name.trim() || !userInfo.roomNumber.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your name and room number.",
        variant: "destructive"
      });
      return;
    }

    setIsUserInfoDialogOpen(false);
    setIsChatOpen(true);
    
    // Initialize the chat with a welcome message
    setMessages([
      {
        id: '1',
        text: `Welcome to Hotel Genius, ${userInfo.name}! How may I assist you today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'staff'
      }
    ]);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate response from staff after a short delay
    setTimeout(() => {
      const staffResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message. Our concierge team will assist you shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'staff'
      };
      setMessages(prevMessages => [...prevMessages, staffResponse]);
      
      toast({
        title: "New message",
        description: "You have received a response from our concierge team.",
      });
    }, 2000);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleNavigateToRequests = () => {
    navigate('/messages');
  };

  const handleNavigateToSupport = () => {
    navigate('/messages?contact=1');
  };

  const handleWhatsAppService = () => {
    // This would ideally open WhatsApp with a predefined number
    toast({
      title: "WhatsApp Service",
      description: "Opening WhatsApp to connect with our concierge team.",
    });
    window.open('https://wa.me/1234567890', '_blank');
  };

  const handleNavigateToAdminChat = () => {
    navigate('/admin/chat-messages');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-secondary mb-4">Hotel Services</h1>
          <p className="text-gray-600">24/7 dedicated concierge support</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <MessageCircle className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">
                  Instant messaging with our concierge team
                </p>
                <Button variant="outline" onClick={handleStartChat}>Start Chat</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <FileText className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Inquiries & Requests</h3>
                <p className="text-gray-600 mb-4">
                  Submit and track your requests
                </p>
                <Button variant="outline" onClick={handleNavigateToRequests}>New Request</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600 mb-4">
                  Round-the-clock assistance for all your needs
                </p>
                <Button variant="outline" onClick={handleNavigateToSupport}>Contact Support</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <HeadphonesIcon className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">WhatsApp Service</h3>
                <p className="text-gray-600 mb-4">
                  Direct messaging via WhatsApp
                </p>
                <Button variant="outline" onClick={handleWhatsAppService}>Message Us</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Staff Only Section - visible only to staff members in a real implementation */}
        <div className="mt-12 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Staff Access</h2>
          <Card className="p-6 bg-muted/30">
            <div className="flex items-start gap-4">
              <MessageCircle className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Chat Management</h3>
                <p className="text-gray-600 mb-4">
                  Staff access to view and respond to guest messages
                </p>
                <Button variant="outline" onClick={() => handleNavigateToAdminChat()}>Access Chat Portal</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* User Information Dialog - No longer needed as we auto-fill user info */}
      <Dialog open={isUserInfoDialogOpen} onOpenChange={setIsUserInfoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Before we start chatting</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Your Name
              </Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                className="col-span-3"
                placeholder="Enter your name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomNumber" className="text-right">
                Room Number
              </Label>
              <Input
                id="roomNumber"
                value={userInfo.roomNumber}
                onChange={(e) => setUserInfo({...userInfo, roomNumber: e.target.value})}
                className="col-span-3"
                placeholder="Enter your room number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitUserInfo}>Start Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Live Chat Sheet */}
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
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-muted rounded-tl-none'
                    }`}
                  >
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
            </div>
          </ScrollArea>
          
          <SheetFooter className="border-t p-4 mt-auto">
            <form onSubmit={handleMessageSubmit} className="flex items-center gap-2 w-full">
              <Button type="button" variant="ghost" size="icon" className="rounded-full">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Textarea 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="resize-none min-h-0 h-10 py-2 rounded-full"
                onKeyDown={(e) => {
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
    </Layout>
  );
};

export default Services;
