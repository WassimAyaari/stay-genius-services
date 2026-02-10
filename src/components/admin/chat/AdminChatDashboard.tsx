import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UnifiedChatContainer } from '@/components/chat/UnifiedChatContainer';
import { ConversationListItem } from './ConversationListItem';
import { RefreshCw, MessageSquare, Clock, Users } from 'lucide-react';
import type { Conversation } from '@/types/chat';

export const AdminChatDashboard: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, escalated: 0, total: 0 });
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
    const channel = supabase
      .channel('admin-conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
        fetchConversations();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
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
      const active = data?.filter(c => c.status === 'active').length || 0;
      const escalated = data?.filter(c => c.status === 'escalated').length || 0;
      setStats({ active, escalated, total: data?.length || 0 });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({ title: "Error", description: "Failed to load conversations.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const filterConversations = (filter: string) => {
    switch (filter) {
      case 'escalated':
        return conversations.filter(c => c.status === 'escalated' || c.current_handler === 'human');
      case 'ai':
        return conversations.filter(c => c.current_handler === 'ai' && c.status === 'active');
      default:
        return conversations;
    }
  };

  const renderConversationList = (filter: string) => {
    const filtered = filterConversations(filter);
    if (filtered.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">No conversations found</div>;
    }
    return filtered.map(conversation => (
      <ConversationListItem
        key={conversation.id}
        conversation={conversation}
        isSelected={selectedConversation?.id === conversation.id}
        onClick={() => setSelectedConversation(conversation)}
      />
    ));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex justify-between items-center p-6 pb-4">
        <h1 className="text-2xl font-bold">Chat Management</h1>
        <Button variant="outline" onClick={fetchConversations} disabled={isLoading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="shrink-0 grid grid-cols-3 gap-4 px-6 pb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.active}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-destructive">{stats.escalated}</div></CardContent>
        </Card>
      </div>

      {/* Side-by-side: Conversations + Chat */}
      <div className="flex flex-1 min-h-0 mx-6 mb-2 gap-4 overflow-hidden">
        {/* Left panel */}
        <div className="w-[35%] border rounded-lg flex flex-col overflow-hidden">
          <Tabs defaultValue="escalated" className="flex flex-col flex-1 overflow-hidden">
            <div className="p-3 border-b">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="escalated" className="text-xs">Attention ({stats.escalated})</TabsTrigger>
                <TabsTrigger value="ai" className="text-xs">AI Handled</TabsTrigger>
                <TabsTrigger value="all" className="text-xs">All Chats</TabsTrigger>
              </TabsList>
            </div>
            {['escalated', 'ai', 'all'].map(filter => (
              <TabsContent key={filter} value={filter} className="flex-1 m-0 overflow-hidden">
                <ScrollArea className="h-full">
                  {renderConversationList(filter)}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
          {selectedConversation ? (
            <UnifiedChatContainer
              userInfo={{ name: 'Admin', email: 'admin@hotel.com' }}
              isAdmin={true}
              className="h-full"
              conversationId={selectedConversation.id}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-3">
                <MessageSquare className="h-12 w-12 mx-auto opacity-30" />
                <p>Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
