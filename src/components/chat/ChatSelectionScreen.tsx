import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Shield, Clock, Users } from 'lucide-react';

interface ChatSelectionScreenProps {
  onSelectChat: (type: 'concierge' | 'safety_ai') => void;
  userInfo: {
    name: string;
    email?: string;
    roomNumber?: string;
  };
}

export const ChatSelectionScreen: React.FC<ChatSelectionScreenProps> = ({
  onSelectChat,
  userInfo
}) => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-background px-4 py-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Message Center</h1>
          <p className="text-muted-foreground">
            Welcome, {userInfo.name}
            {userInfo.roomNumber && ` • Room ${userInfo.roomNumber}`}
          </p>
        </div>
      </div>

      {/* Chat Options */}
      <div className="flex-1 p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Guest Services */}
        <div 
          className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => onSelectChat('concierge')}
        >
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">Guest Services</h3>
              <p className="text-muted-foreground text-sm">
                24/7 Hotel Assistance
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Available 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>AI + Human Support</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                General hotel services, bookings, room requests, and more
              </p>
            </div>
          </div>
        </div>

        {/* Safety Assistant */}
        <div 
          className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => onSelectChat('safety_ai')}
        >
          <div className="flex items-start space-x-4">
            <div className="bg-destructive/10 p-3 rounded-full">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">Safety Assistant</h3>
              <p className="text-muted-foreground text-sm">
                Emergency & Safety Support
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Immediate Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>AI Safety Protocols</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Emergency procedures, safety information, and urgent assistance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};