import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Loader2,
  User,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TemplateReviewForm } from './TemplateReviewForm';
import type { FlowTemplate } from '@/types/templates';

interface Review {
  id: string;
  template_id: string;
  reviewer_id: string;
  reviewer_name: string;
  rating: number;
  title: string;
  review_text: string;
  pros: string[];
  cons: string[];
  status: 'pending' | 'approved' | 'rejected';
  helpful_votes: number;
  created_at: string;
  updated_at: string;
}

interface TemplateReviewsProps {
  template: FlowTemplate;
  onReviewSubmitted?: () => void;
}

export const TemplateReviews: React.FC<TemplateReviewsProps> = ({
  template,
  onReviewSubmitted
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});

  // Load reviews
  useEffect(() => {
    loadReviews();
  }, [template.id]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      
      const supabaseClient = supabase();
      if (!supabaseClient) {
        throw new Error('Supabase client not available');
      }
      
      // Get approved reviews
      const { data: reviewsData, error } = await supabaseClient
        .from('template_reviews')
        .select('*')
        .eq('template_id', template.id)
        .eq('status', 'approved')
        .order('helpful_votes', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(reviewsData || []);

      // Load user votes if authenticated
      if (user) {
        const { data: votesData } = await supabaseClient
          .from('review_votes')
          .select('review_id, is_helpful')
          .eq('voter_id', user.id);

        if (votesData) {
          const votesMap: Record<string, boolean> = {};
          votesData.forEach(vote => {
            votesMap[vote.review_id] = vote.is_helpful;
          });
          setUserVotes(votesMap);
        }
      }

    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: "Error Loading Reviews",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Vote on review helpfulness
  const voteOnReview = async (reviewId: string, isHelpful: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to vote on reviews",
        variant: "destructive"
      });
      return;
    }

    try {
      const supabaseClient = supabase();
      if (!supabaseClient) {
        throw new Error('Supabase client not available');
      }

      // Check if user already voted
      const existingVote = userVotes[reviewId];
      
      if (existingVote === isHelpful) {
        // Remove vote
        await supabaseClient
          .from('review_votes')
          .delete()
          .eq('review_id', reviewId)
          .eq('voter_id', user.id);

        setUserVotes(prev => {
          const newVotes = { ...prev };
          delete newVotes[reviewId];
          return newVotes;
        });
      } else {
        // Update or insert vote
        await supabaseClient
          .from('review_votes')
          .upsert({
            review_id: reviewId,
            voter_id: user.id,
            is_helpful: isHelpful
          });

        setUserVotes(prev => ({
          ...prev,
          [reviewId]: isHelpful
        }));
      }

      // Reload reviews to update helpful votes count
      await loadReviews();

    } catch (error) {
      console.error('Error voting on review:', error);
      toast({
        title: "Vote Failed",
        description: "Failed to submit your vote. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Calculate rating statistics
  const ratingStats = reviews.reduce((stats, review) => {
    stats.total += review.rating;
    stats.count += 1;
    stats.distribution[review.rating] = (stats.distribution[review.rating] || 0) + 1;
    return stats;
  }, {
    total: 0,
    count: 0,
    distribution: {} as Record<number, number>
  });

  const averageRating = ratingStats.count > 0 ? ratingStats.total / ratingStats.count : 0;

  // Render star rating
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-muted-foreground">Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
          <p className="text-muted-foreground">
            See what others think about this template
          </p>
        </div>
        <Button onClick={() => setShowReviewForm(true)}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Write a Review
        </Button>
      </div>

      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(averageRating), 'lg')}
              <p className="text-sm text-muted-foreground mt-2">
                Based on {ratingStats.count} review{ratingStats.count !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingStats.distribution[rating] || 0;
                const percentage = ratingStats.count > 0 ? (count / ratingStats.count) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm w-8">{rating}</span>
                    {renderStars(rating, 'sm')}
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to review this template and help others make informed decisions.
              </p>
              <Button onClick={() => setShowReviewForm(true)}>
                Write the First Review
              </Button>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Review Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{review.reviewer_name}</span>
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Title */}
                  <div>
                    <h4 className="font-semibold text-lg">{review.title}</h4>
                  </div>

                  {/* Review Text */}
                  <div>
                    <p className="text-muted-foreground leading-relaxed">
                      {review.review_text}
                    </p>
                  </div>

                  {/* Pros and Cons */}
                  {(review.pros.length > 0 || review.cons.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {review.pros.length > 0 && (
                        <div>
                          <h5 className="font-medium text-green-700 mb-2 flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            What Worked Well
                          </h5>
                          <div className="space-y-1">
                            {review.pros.map((pro, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full" />
                                <span className="text-sm">{pro}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {review.cons.length > 0 && (
                        <div>
                          <h5 className="font-medium text-red-700 mb-2 flex items-center">
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            Areas for Improvement
                          </h5>
                          <div className="space-y-1">
                            {review.cons.map((con, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-red-500 rounded-full" />
                                <span className="text-sm">{con}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Helpful Votes */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Was this review helpful?
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => voteOnReview(review.id, true)}
                        className={`h-8 px-2 ${
                          userVotes[review.id] === true ? 'text-green-600 bg-green-50' : ''
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Yes ({review.helpful_votes})
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => voteOnReview(review.id, false)}
                        className={`h-8 px-2 ${
                          userVotes[review.id] === false ? 'text-red-600 bg-red-50' : ''
                        }`}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        No
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <TemplateReviewForm
                template={template}
                onSuccess={() => {
                  setShowReviewForm(false);
                  loadReviews(); // Refresh reviews after submission
                  if (onReviewSubmitted) {
                    onReviewSubmitted();
                  }
                }}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 