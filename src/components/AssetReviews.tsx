'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';

interface Review {
  id: string;
  asset_slug: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface AssetReviewsProps {
  assetSlug: string;
}

export default function AssetReviews({ assetSlug }: AssetReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [assetSlug]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?slug=${assetSlug}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Name is required');
    if (rating < 1 || rating > 5) return alert('Rating must be between 1 and 5');
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_slug: assetSlug,
          reviewer_name: name,
          rating,
          comment: comment.trim() || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.review, ...reviews]);
        setName('');
        setComment('');
        setRating(5);
      } else {
        alert('Failed to submit review: ' + data.error);
      }
    } catch (err) {
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (currentRating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < currentRating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600'}`} 
      />
    ));
  };

  return (
    <div className="space-y-8 mt-12 border-t border-slate-800/80 pt-10">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-blue-400" />
        <h3 className="text-2xl font-bold text-slate-100">Community Reviews</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Review Submission Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800/60 p-6 rounded-2xl space-y-5">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest border-b border-slate-800 pb-2">Leave a Review</h4>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase">Your Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="GamerTag..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase">Rating</label>
              <div className="flex items-center gap-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none p-1 hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={`w-6 h-6 ${(hoveredRating || rating) >= star ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase">Comment (Optional)</label>
              <textarea 
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Did this configuration help you?"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Post Review'} <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm font-mono">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 border border-slate-800/50 rounded-2xl space-y-3">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-slate-400 text-sm">No reviews yet. Be the first to review!</div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.map(review => (
                <div key={review.id} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-slate-200">{review.reviewer_name}</span>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-slate-400 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                      "{review.comment}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
