import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Star, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import { submitReview, updateReview } from '@/lib/api';
import type { TemplateReview } from '@/types/templates';

// Form validation schema
const reviewFormSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  title: z.string().min(1, 'Review title is required').max(100, 'Title must be less than 100 characters'),
  review_text: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review must be less than 1000 characters'),
  pros: z.array(z.string()).min(1, 'At least one pro is required').max(5, 'Maximum 5 pros allowed'),
  cons: z.array(z.string()).max(5, 'Maximum 5 cons allowed'),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface ReviewSubmissionFormProps {
  templateId: string;
  existingReview?: TemplateReview;
  onSuccess?: (review: TemplateReview) => void;
  onCancel?: () => void;
}

export const ReviewSubmissionForm: React.FC<ReviewSubmissionFormProps> = ({
  templateId,
  existingReview,
  onSuccess,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: existingReview?.rating || 5,
      title: existingReview?.title || '',
      review_text: existingReview?.review_text || '',
      pros: existingReview?.pros || [''],
      cons: existingReview?.cons || [],
    },
  });

  const pros = form.watch('pros');
  const cons = form.watch('cons');

  const addPro = () => {
    if (newPro.trim() && pros.length < 5) {
      form.setValue('pros', [...pros, newPro.trim()]);
      setNewPro('');
    }
  };

  const removePro = (index: number) => {
    form.setValue('pros', pros.filter((_, i) => i !== index));
  };

  const addCon = () => {
    if (newCon.trim() && cons.length < 5) {
      form.setValue('cons', [...cons, newCon.trim()]);
      setNewCon('');
    }
  };

  const removeCon = (index: number) => {
    form.setValue('cons', cons.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      let result;
      
      if (existingReview) {
        // Update existing review
        result = await updateReview(existingReview.id, {
          rating: data.rating,
          title: data.title,
          review_text: data.review_text,
          pros: data.pros,
          cons: data.cons,
        });
      } else {
        // Submit new review
        result = await submitReview(templateId, {
          rating: data.rating,
          title: data.title,
          review_text: data.review_text,
          pros: data.pros,
          cons: data.cons,
        });
      }

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        setSubmitStatus('success');
        if (onSuccess) {
          onSuccess(result.data);
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit review');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          {existingReview ? 'Edit Review' : 'Write a Review'}
        </CardTitle>
        <CardDescription>
          {existingReview 
            ? 'Update your review to help others make informed decisions.'
            : 'Share your experience with this template to help others.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Status Messages */}
          {submitStatus === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {existingReview ? 'Review updated successfully!' : 'Review submitted successfully!'}
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => form.setValue('rating', star)}
                  className={`p-1 rounded transition-colors ${
                    form.watch('rating') >= star
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {form.watch('rating')} out of 5 stars
              </span>
            </div>
            {form.formState.errors.rating && (
              <p className="text-sm text-red-600">{form.formState.errors.rating.message}</p>
            )}
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Summarize your experience in a few words"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review_text">Review *</Label>
            <Textarea
              id="review_text"
              {...form.register('review_text')}
              placeholder="Share your detailed experience with this template. What worked well? What could be improved?"
              rows={4}
            />
            {form.formState.errors.review_text && (
              <p className="text-sm text-red-600">{form.formState.errors.review_text.message}</p>
            )}
          </div>

          {/* Pros */}
          <div className="space-y-2">
            <Label>Pros *</Label>
            <div className="space-y-2">
              {pros.map((pro, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={pro}
                    onChange={(e) => {
                      const newPros = [...pros];
                      newPros[index] = e.target.value;
                      form.setValue('pros', newPros);
                    }}
                    placeholder="Enter a pro"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removePro(index)}
                    disabled={pros.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {pros.length < 5 && (
                <div className="flex items-center gap-2">
                  <Input
                    value={newPro}
                    onChange={(e) => setNewPro(e.target.value)}
                    placeholder="Add another pro"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPro}
                    disabled={!newPro.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {form.formState.errors.pros && (
              <p className="text-sm text-red-600">{form.formState.errors.pros.message}</p>
            )}
          </div>

          {/* Cons */}
          <div className="space-y-2">
            <Label>Cons (Optional)</Label>
            <div className="space-y-2">
              {cons.map((con, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={con}
                    onChange={(e) => {
                      const newCons = [...cons];
                      newCons[index] = e.target.value;
                      form.setValue('cons', newCons);
                    }}
                    placeholder="Enter a con"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCon(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {cons.length < 5 && (
                <div className="flex items-center gap-2">
                  <Input
                    value={newCon}
                    onChange={(e) => setNewCon(e.target.value)}
                    placeholder="Add another con"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCon}
                    disabled={!newCon.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {form.formState.errors.cons && (
              <p className="text-sm text-red-600">{form.formState.errors.cons.message}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || submitStatus === 'success'}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {existingReview ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  {existingReview ? 'Update Review' : 'Submit Review'}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 