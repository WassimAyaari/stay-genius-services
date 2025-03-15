
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, Send, User, Calendar, CheckCircle, PencilLine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your valuable feedback!",
    });
    
    // Reset form
    setRating(0);
    setFeedbackText('');
  };

  const reviews = [
    {
      id: 1,
      author: 'James Wilson',
      date: 'June 10, 2023',
      rating: 5,
      comment: 'Absolutely amazing service! The staff went above and beyond to make our stay memorable.',
      response: {
        text: 'Thank you for your kind words, James! We're delighted to hear you enjoyed your stay with us.',
        date: 'June 11, 2023'
      }
    },
    {
      id: 2,
      author: 'Sarah Johnson',
      date: 'May 22, 2023',
      rating: 4,
      comment: 'Beautiful hotel with excellent amenities. The spa treatments were particularly impressive.',
    }
  ];

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-secondary mb-4">Feedback & Reviews</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We value your opinions and strive to improve your experience
        </p>
      </div>

      {/* Submit Feedback */}
      <section className="px-6 mb-10">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-secondary mb-4">Share Your Experience</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Rate your overall experience</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-all"
                  >
                    <Star 
                      className={`h-8 w-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="feedback" className="block text-gray-700 mb-2">Your feedback</label>
              <Textarea
                id="feedback"
                placeholder="Tell us about your experience..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="h-32"
              />
            </div>
            
            <Button type="submit" className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Submit Feedback
            </Button>
          </form>
        </Card>
      </section>

      {/* Recent Reviews */}
      <section className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-secondary mb-4">Recent Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <h3 className="font-semibold text-secondary">{review.author}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{review.date}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
              
              {review.response && (
                <div className="mt-3 pt-3 border-t">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Hotel Response</span>
                      <span className="text-xs text-gray-500">({review.response.date})</span>
                    </div>
                    <p className="text-sm text-gray-600">{review.response.text}</p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Contact for More Feedback */}
      <section className="px-6 mb-10">
        <Card className="bg-primary/5 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-secondary mb-3">Have More to Share?</h3>
          <p className="text-gray-600 mb-4">
            We appreciate detailed feedback and would love to hear more about your experience.
          </p>
          <Button className="w-full">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Manager
          </Button>
        </Card>
      </section>
    </Layout>
  );
};

export default Feedback;
