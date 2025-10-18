import React from 'react';
import type { Review } from '../types';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mx-4 flex-shrink-0 w-80 md:w-96">
      <div className="flex items-center mb-4">
        <img src={review.studentImageUrl} alt={review.studentName} className="w-14 h-14 rounded-full object-cover mr-4" />
        <div>
          <p className="font-bold text-slate-800">{review.studentName}</p>
          <p className="text-sm text-slate-500">Verified Student</p>
        </div>
      </div>
      <p className="text-slate-600 italic">"{review.text}"</p>
    </div>
  );
};

export default ReviewCard;