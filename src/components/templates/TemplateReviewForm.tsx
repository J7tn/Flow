import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Send, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Plus,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { FlowTemplate } from '@/types/templates';

interface TemplateReviewFormProps {
  template: FlowTemplate;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TemplateReviewForm: React.FC<TemplateReviewFormProps> = ({
  template,
  onSuccess,
  onCancel
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewData, setReviewData] = useState({
    title: '',
    reviewText: '',
    pros: [] as string[],
    cons: [] as string[]
  });
  
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');

  // Add pro
  const addPro = () => {
    if (newPro.trim() && !reviewData.pros.includes(newPro.trim())) {
      setReviewData(prev => ({
        ...prev,
        pros: [...prev.pros, newPro.trim()]
      }));
      setNewPro('');
    }
  };

  // Remove pro
  const removePro = (proToRemove: string) => {
    setReviewData(prev => ({
      ...prev,
      pros: prev.pros.filter(pro => pro !== proToRemove)
    }));
  };

  // Add con
  const addCon = () => {
    if (newCon.trim() && !reviewData.cons.includes(newCon.trim())) {
      setReviewData(prev => ({
        ...prev,
        cons: [...prev.cons, newCon.trim()]
      }));
      setNewCon('');
    }
  };

  // Remove con
  const removeCon = (conToRemove: string) => {
    setReviewData(prev => ({
      ...prev,
      cons: prev.cons.filter(con => con !== conToRemove)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a review",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating for this template",
        variant: "destructive"
      });
      return;
    }

    if (!reviewData.title.trim() || !reviewData.reviewText.trim()) {
      toast({
        title: "Review Required",
        description: "Please provide a title and review text",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const supabaseClient = supabase();
      if (!supabaseClient) {
        throw new Error('Supabase client not available');
      }

      // Get user profile
      const { data: userProfile } = await supabaseClient
        .from('user_profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      // Prepare review data
      const reviewDataToSubmit = {
        template_id: template.id,
        reviewer_id: user.id,
        reviewer_name: userProfile?.full_name || user.email?.split('@')[0] || 'Anonymous',
        rating: rating,
        title: reviewData.title.trim(),
        review_text: reviewData.reviewText.trim(),
        pros: reviewData.pros,
        cons: reviewData.cons,
        status: 'pending'
      };

      // Insert review
      const { data: review, error } = await supabaseClient
        .from('template_reviews')
        .insert(reviewDataToSubmit)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Review Submitted Successfully!",
        description: "Thank you for your feedback. Your review will be visible after approval.",
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('Error submitting review:', error);
      
      if (error.code === '23505') {
        toast({
          title: "Review Already Exists",
          description: "You have already reviewed this template. You can update your existing review.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Review Submission Failed",
          description: "There was an error submitting your review. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
            <p className="text-muted-foreground mb-4">
              You need to be signed in to review templates.
            </p>
            <Button onClick={() => window.location.href = '/login'}>
              Sign In to Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Review Template</h2>
        <p className="text-muted-foreground">
          Share your experience with "{template.name}"
        </p>
      </div>

      {/* Template Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Template Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{template.rating?.toFixed(1) || 'N/A'}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="capitalize">
                {template.category}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {template.difficulty}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {template.targetAudience === 'individual' ? 'Individual' : 
                 template.targetAudience === 'small-team' ? 'Small Team' : 'Enterprise'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Duration:</span>
                <span>
                  {template.estimatedDuration.min}-{template.estimatedDuration.max} {template.estimatedDuration.unit}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Steps:</span>
                <span>{template.steps.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <Card>
          <CardHeader>
            <CardTitle>Your Rating</CardTitle>
            <CardDescription>
              How would you rate this template?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating > 0 && `${rating} out of 5 stars`}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Review Content */}
        <Card>
          <CardHeader>
            <CardTitle>Your Review</CardTitle>
            <CardDescription>
              Share your experience and help others make informed decisions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Review Title *</Label>
              <Input
                id="title"
                value={reviewData.title}
                onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your experience in a few words"
                maxLength={100}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {reviewData.title.length}/100 characters
              </p>
            </div>

            <div>
              <Label htmlFor="reviewText">Review Text *</Label>
              <Textarea
                id="reviewText"
                value={reviewData.reviewText}
                onChange={(e) => setReviewData(prev => ({ ...prev, reviewText: e.target.value }))}
                placeholder="Share your detailed experience with this template. What worked well? What could be improved?"
                rows={4}
                maxLength={1000}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {reviewData.reviewText.length}/1000 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                What Worked Well
              </CardTitle>
              <CardDescription>
                Add the positive aspects of this template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newPro}
                  onChange={(e) => setNewPro(e.target.value)}
                  placeholder="Add a positive point..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
                />
                <Button type="button" variant="outline" onClick={addPro}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {reviewData.pros.length > 0 && (
                <div className="space-y-2">
                  {reviewData.pros.map(pro => (
                    <Badge key={pro} variant="secondary" className="flex items-center gap-1">
                      {pro}
                      <button
                        type="button"
                        onClick={() => removePro(pro)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsDown className="h-5 w-5 text-red-600" />
                Areas for Improvement
              </CardTitle>
              <CardDescription>
                Add suggestions for how this template could be better
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newCon}
                  onChange={(e) => setNewCon(e.target.value)}
                  placeholder="Add an improvement suggestion..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
                />
                <Button type="button" variant="outline" onClick={addCon}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {reviewData.cons.length > 0 && (
                <div className="space-y-2">
                  {reviewData.cons.map(con => (
                    <Badge key={con} variant="secondary" className="flex items-center gap-1">
                      {con}
                      <button
                        type="button"
                        onClick={() => removeCon(con)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Guidelines */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Review Guidelines</p>
                <ul className="space-y-1 text-xs">
                  <li>• Be honest and constructive in your feedback</li>
                  <li>• Focus on the template's effectiveness and usability</li>
                  <li>• Avoid personal attacks or inappropriate content</li>
                  <li>• Reviews are moderated and may take 1-2 days to appear</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}; 