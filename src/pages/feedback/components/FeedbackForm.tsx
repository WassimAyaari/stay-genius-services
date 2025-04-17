
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserInfo } from '@/features/services/hooks/userInfo';
import StarRating from './StarRating';

const FeedbackForm = () => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
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

    // Set submitted state
    setIsSubmitted(true);

    // Reset form after a delay
    setTimeout(() => {
      setIsSubmitted(false);
      setRating(0);
      setComment('');
    }, 3000);
  };

  // Render success state
  if (isSubmitted) {
    return (
      <div className="mb-10">
        <Card className="p-6 rounded-xl bg-green-50 border-green-200 text-center">
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h2 className="text-2xl font-bold text-green-700">Feedback Received</h2>
            <p className="text-green-600">Thank you for helping us improve!</p>
          </div>
        </Card>
      </div>
    );
  }

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
          
          <Button type="submit" className="w-full" disabled={rating === 0}>
            <Send className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default FeedbackForm;
