
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserInfo } from '@/features/services/hooks/userInfo';
import StarRating from './StarRating';

const FeedbackForm = () => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const { userInfo } = useUserInfo();

  // Pre-fill with guest information
  useEffect(() => {
    if (userInfo) {
      if (userInfo.name && userInfo.name !== 'Guest') {
        setName(userInfo.name);
      }
      if (userInfo.email) {
        setEmail(userInfo.email);
      }
    }
  }, [userInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would normally send these data to your backend
    console.log({
      rating,
      comment,
      name,
      email
    });
    
    toast({
      title: 'Thank you for your feedback!',
      description: 'Your comments have been submitted successfully.'
    });

    // Reset form
    setRating(0);
    setComment('');
    // Don't reset name and email for better user experience
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-secondary mb-4">Share Your Experience</h2>
      <Card className="p-6 rounded-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <StarRating rating={rating} setRating={setRating} />
          
          <div className="space-y-2">
            <Label htmlFor="comment">Your comments</Label>
            <Textarea 
              id="comment" 
              placeholder="Tell us about your experience..." 
              className="resize-none" 
              rows={5} 
              value={comment} 
              onChange={e => setComment(e.target.value)} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="Your name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Your email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default FeedbackForm;
