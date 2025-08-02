import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Calendar } from 'lucide-react';
import { voteReview, removeReviewVote } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { TemplateReview } from '@/types/templates';

interface ReviewDisplayProps {
  reviews: TemplateReview[];
  onReviewUpdate?: () => void;
}

export const ReviewDisplay: React.FC<ReviewDisplayProps> = ({
  reviews,
  onReviewUpdate
}) => {
  const { user } = useAuth();
  const [votingStates, setVotingStates] = useState<Record<string, 'up' | 'down' | null>>({});
  const [isVoting, setIsVoting] = useState<Record<string, boolean>>({});

  const handleVote = async (reviewId: string, isHelpful: boolean) => {
    if (!user) return;

    setIsVoting(prev => ({ ...prev, [reviewId]: true }));

    try {
      const currentVote = votingStates[reviewId];
      const newVote = isHelpful ? 'up' : 'down';

      if (currentVote === newVote) {
        // Remove vote if clicking the same button
        await removeReviewVote(reviewId);
        setVotingStates(prev => ({ ...prev, [reviewId]: null }));
      } else {
        // Add or change vote
        await voteReview(reviewId, isHelpful);
        setVotingStates(prev => ({ ...prev, [reviewId]: newVote }));
      }

      if (onReviewUpdate) {
        onReviewUpdate();
      }
    } catch (error) {
      console.error('Error voting on review:', error);
    } finally {
      setIsVoting(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600">
            Be the first to share your experience with this template!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getInitials(review.reviewer_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-gray-900">{review.reviewer_name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(review.created_at)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm font-medium text-gray-900">
                  {review.rating}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Review Title */}
              <h5 className="font-medium text-gray-900">{review.title}</h5>

              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed">{review.review_text}</p>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {review.pros.length > 0 && (
                  <div>
                    <h6 className="font-medium text-green-700 mb-2">Pros</h6>
                    <ul className="space-y-1">
                      {review.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {review.cons.length > 0 && (
                  <div>
                    <h6 className="font-medium text-red-700 mb-2">Cons</h6>
                    <ul className="space-y-1">
                      {review.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(review.id, true)}
                    disabled={isVoting[review.id]}
                    className={`flex items-center gap-1 ${
                      votingStates[review.id] === 'up' ? 'text-blue-600 bg-blue-50' : ''
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful</span>
                    {review.helpful_votes > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {review.helpful_votes}
                      </Badge>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(review.id, false)}
                    disabled={isVoting[review.id]}
                    className={`flex items-center gap-1 ${
                      votingStates[review.id] === 'down' ? 'text-red-600 bg-red-50' : ''
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>Not Helpful</span>
                  </Button>
                </div>

                {review.updated_at && review.updated_at !== review.created_at && (
                  <div className="text-xs text-gray-500">
                    Edited {formatDate(review.updated_at)}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 