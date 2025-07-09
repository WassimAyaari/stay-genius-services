import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnifiedChatContainer } from '@/components/chat/UnifiedChatContainer';
import { RefreshCw, MessageSquare, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import type { Conversation } from '@/types/chat';

export const AdminChatDashboard: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    escalated: 0,
    total: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
    
    // Real-time subscription for new conversations
    const channel = supabase
      .channel('admin-conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setConversations(data || []);
      
      // Calculate stats
      const active = data?.filter(c => c.status === 'active').length || 0;
      const escalated = data?.filter(c => c.status === 'escalated').length || 0;
      const total = data?.length || 0;
      
      setStats({ active, escalated, total });
      
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string, currentHandler: string) => {
    if (status === 'escalated' || currentHandler === 'human') {
      return <Badge variant="destructive">Needs Attention</Badge>;
    }
    if (status === 'active' && currentHandler === 'ai') {
      return <Badge variant="secondary">AI Handling</Badge>;
    }
    return <Badge variant="outline">Completed</Badge>;
  };

  const filterConversations = (filter: string) => {
    switch (filter) {
      case 'escalated':
        return conversations.filter(c => c.status === 'escalated' || c.current_handler === 'human');
      case 'ai':
        return conversations.filter(c => c.current_handler === 'ai' && c.status === 'active');
      case 'all':
      default:
        return conversations;
    }
  };

  if (selectedConversation) {
    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 border-b bg-card">
          <Button 
            variant="outline" 
            onClick={() => setSelectedConversation(null)}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h2 className="text-lg font-semibold">
            Chat with {selectedConversation.guest_name}
            {selectedConversation.room_number && ` (Room ${selectedConversation.room_number})`}
          </h2>
        </div>
        
        <div className="flex-1">
          <UnifiedChatContainer
            userInfo={{
              name: 'Admin',
              email: 'admin@hotel.com'
            }}
            isAdmin={true}
            className="h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chat Management</h1>
        <Button 
          variant="outline" 
          onClick={fetchConversations}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.escalated}</div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="escalated">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="escalated">Needs Attention ({stats.escalated})</TabsTrigger>
              <TabsTrigger value="ai">AI Handled</TabsTrigger>
              <TabsTrigger value="all">All Chats</TabsTrigger>
            </TabsList>
            
            {['escalated', 'ai', 'all'].map((filter) => (
              <TabsContent key={filter} value={filter} className="mt-4">
                <div className="space-y-3">
                  {filterConversations(filter).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No conversations found
                    </div>
                  ) : (
                    filterConversations(filter).map((conversation) => (
                      <div
                        key={conversation.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{conversation.guest_name}</h3>
                            {getStatusBadge(conversation.status, conversation.current_handler)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {conversation.room_number && `Room ${conversation.room_number} • `}
                            Last update: {format(new Date(conversation.updated_at), 'MMM d, HH:mm')}
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {conversation.current_handler === 'ai' ? 'AI' : 'Human'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};