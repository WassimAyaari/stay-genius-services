import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader, 
  MessageCircle, 
  FileText, 
  Clock, 
  Check, 
  X, 
  Send, 
  Paperclip,
  Headphones as HeadphonesIcon
} from 'lucide-react';
import { requestService } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/hooks/use-toast';
import { useRoom } from '@/hooks/useRoom';
import RequestCategoryList from '@/features/services/components/RequestCategoryList';
import RequestItemList from '@/features/services/components/RequestItemList';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

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
  const { data: room } = useRoom(userInfo.roomNumber);
  
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData.name && parsedUserData.roomNumber) {
          setUserInfo({
            name: parsedUserData.name,
            roomNumber: parsedUserData.roomNumber
          });
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleStartChat = () => {
    if (!userInfo.name.trim() || !userInfo.roomNumber.trim()) {
      setIsUserInfoDialogOpen(true);
      return;
    }
    
    setIsChatOpen(true);
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

    localStorage.setItem('user_data', JSON.stringify(userInfo));
    
    setIsUserInfoDialogOpen(false);
    setIsChatOpen(true);
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

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
      userId = `user_${Date.now()}`;
      localStorage.setItem('user_id', userId);
    }

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            user_id: userId,
            user_name: userInfo.name,
            room_number: userInfo.roomNumber,
            text: inputMessage,
            sender: 'user',
            status: 'sent',
            created_at: currentTime.toISOString()
          }
        ])
        .select();

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
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'staff'
        };
        
        setMessages(prevMessages => [...prevMessages, staffResponse]);
        
        await supabase
          .from('chat_messages')
          .insert([
            {
              user_id: userId,
              recipient_id: userId,
              user_name: "Concierge",
              room_number: userInfo.roomNumber,
              text: staffResponse.text,
              sender: 'staff',
              status: 'sent',
              created_at: new Date().toISOString()
            }
          ]);
        
        toast({
          title: "New message",
          description: "You have received a response from our concierge team.",
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

  const handleOpenRequestDialog = () => {
    setIsRequestDialogOpen(true);
    setSelectedCategory(null);
    setSelectedItems([]);
  };

  const handleSelectCategory = (category: RequestCategory) => {
    setSelectedCategory(category);
    setSelectedItems([]);
  };

  const handleGoBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedItems([]);
  };

  const handleToggleRequestItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSubmitRequests = async () => {
    if (!selectedItems.length || !room) {
      toast({
        title: "No items selected",
        description: "Please select at least one request item",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const getUserInfo = () => {
        const userInfoStr = localStorage.getItem('user_data');
        if (userInfoStr) {
          try {
            return JSON.parse(userInfoStr);
          } catch (error) {
            console.error("Error parsing user info:", error);
          }
        }
        return { name: userInfo.name, roomNumber: userInfo.roomNumber };
      };
      
      const currentUserInfo = getUserInfo();
      
      for (const itemId of selectedItems) {
        await requestService(
          room.id, 
          selectedCategory?.name.toLowerCase() as any || 'custom',
          `Request for ${selectedCategory?.name}`,
          itemId,
          undefined,
          currentUserInfo.name,
          currentUserInfo.roomNumber || room.room_number
        );
      }
      
      toast({
        title: "Requests Submitted",
        description: `${selectedItems.length} request(s) have been sent successfully.`,
      });
      
      setIsRequestDialogOpen(false);
      setSelectedCategory(null);
      setSelectedItems([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit requests. Please try again.",
        variant: "destructive",
      });
      console.error("Error submitting requests:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigateToRequests = () => {
    handleOpenRequestDialog();
  };

  const handleNavigateToSupport = () => {
    navigate('/messages?contact=1');
  };

  const handleWhatsAppService = () => {
    toast({
      title: "WhatsApp Service",
      description: "Opening WhatsApp to connect with our concierge team.",
    });
    window.open('https://wa.me/1234567890', '_blank');
  };

  const handleNavigateToAdminChat = () => {
    navigate('/admin/chat-messages');
  };

  const handleNavigateToRequestManager = () => {
    navigate('/admin/request-manager');
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

        <div className="mt-12 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Staff Access</h2>
          <div className="grid md:grid-cols-2 gap-6">
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
            
            <Card className="p-6 bg-muted/30">
              <div className="flex items-start gap-4">
                <FileText className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Request Management</h3>
                  <p className="text-gray-600 mb-4">
                    Manage request categories and track request status
                  </p>
                  <Button variant="outline" onClick={handleNavigateToRequestManager}>Manage Requests</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory 
                ? `Select ${selectedCategory.name} Requests` 
                : "Select Request Category"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {selectedCategory ? (
              <RequestItemList
                category={selectedCategory}
                onGoBack={handleGoBackToCategories}
                onSelectItem={() => {}}
                selectedItems={selectedItems}
                onToggleItem={handleToggleRequestItem}
              />
            ) : (
              <RequestCategoryList
                onSelectCategory={handleSelectCategory}
              />
            )}
          </div>
          
          <DialogFooter>
            {selectedCategory && (
              <div className="flex w-full justify-between items-center">
                <div className="text-sm">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </div>
                <Button 
                  onClick={handleSubmitRequests}
                  disabled={selectedItems.length === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Submit Requests
                    </>
                  )}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUserInfoDialogOpen} onOpenChange={setIsUserInfoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Please provide your information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Your Name</label>
              <Input 
                id="name" 
                value={userInfo.name} 
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} 
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="roomNumber" className="text-sm font-medium">Room Number</label>
              <Input 
                id="roomNumber" 
                value={userInfo.roomNumber} 
                onChange={(e) => setUserInfo({ ...userInfo, roomNumber: e.target.value })} 
                placeholder="Enter your room number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitUserInfo}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
