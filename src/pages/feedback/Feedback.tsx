
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, Star, MessageSquare, Send, ExternalLink, Upload, Link as LinkIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUserInfo } from '@/features/services/hooks/userInfo';
import { useHotelConfig } from '@/hooks/useHotelConfig';

const Feedback = () => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  const { toast } = useToast();
  const { userInfo } = useUserInfo();
  const { config, isLoading } = useHotelConfig();

  // Pré-remplir avec les informations du guest
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

  // Charger l'image d'en-tête depuis la configuration
  useEffect(() => {
    console.log("Config loaded:", config);
    if (config && config.feedback_hero_image && config.feedback_hero_image.trim() !== '') {
      console.log("Setting hero image to:", config.feedback_hero_image);
      setHeroImage(config.feedback_hero_image);
    }
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ici vous enverriez normalement ces données à votre backend
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
    // Ne pas réinitialiser le nom et l'email pour une meilleure expérience utilisateur
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-3xl overflow-hidden">
          <img 
            src={heroImage} 
            alt="Feedback" 
            className="w-full h-64 object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Your Feedback Matters</h1>
            <p className="text-xl mb-6">Help us improve your experience</p>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Share Your Experience</h2>
          <Card className="p-6 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="rating">How would you rate your overall experience?</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setRating(star)} 
                      className="p-2 rounded-full transition-colors"
                    >
                      <Star className={`h-8 w-8 ${rating >= star ? 'fill-primary text-primary' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
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

        {/* TripAdvisor Integration Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Share on TripAdvisor</h2>
          <Card className="p-6 rounded-xl border-2 border-primary/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-full">
                <ExternalLink className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Share your review on TripAdvisor</h3>
                <p className="text-gray-600">Let the world know about your experience</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                Your opinion matters! By sharing your experience on TripAdvisor, you help other 
                travelers make informed decisions. Plus, you'll earn 500 reward points that can be 
                redeemed for hotel services.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 gap-2" onClick={() => window.open('https://www.tripadvisor.com/UserReview', '_blank')}>
                <Upload className="h-4 w-4" />
                Write a Review
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <LinkIcon className="h-4 w-4" />
                Link Existing Review
              </Button>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <Card className="p-4 rounded-xl">
              <h3 className="font-semibold mb-2">How do I request special accommodations?</h3>
              <p className="text-sm text-gray-600">
                You can request special accommodations by contacting our concierge service directly through the app or by visiting the front desk.
              </p>
            </Card>
            
            <Card className="p-4 rounded-xl">
              <h3 className="font-semibold mb-2">What is the check-out process?</h3>
              <p className="text-sm text-gray-600">
                You can check out directly through the app, or visit the front desk. All room charges will be compiled and ready for review.
              </p>
            </Card>
            
            <Card className="p-4 rounded-xl">
              <h3 className="font-semibold mb-2">How can I extend my stay?</h3>
              <p className="text-sm text-gray-600">
                To extend your stay, please contact the front desk at least 24 hours before your scheduled check-out time to check availability.
              </p>
            </Card>
          </div>
        </div>

        {/* Contact Card */}
        <div className="mb-8">
          <Card className="p-6 rounded-xl bg-primary text-white">
            <h3 className="font-semibold text-lg mb-2">Need Immediate Assistance?</h3>
            <p className="mb-4">Our team is available 24/7 to address any concerns or answer questions.</p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="w-full bg-white text-primary hover:bg-gray-100">
                Call Reception
              </Button>
              <Button variant="outline" className="w-full border-white text-white hover:bg-white/20">
                Live Chat
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
