import React, { useState } from 'react';
import type { Tutor } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import StarIcon from './icons/StarIcon';
import MessageModal from './MessageModal';
import VerifiedIcon from './icons/VerifiedIcon';

interface TutorCardProps {
  tutor: Tutor;
}

const Rating: React.FC<{ rating: number; reviewCount: number }> = ({ rating, reviewCount }) => {
  return (
    <div className="flex items-center">
      <div className="flex items-center text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} isFilled={i < Math.round(rating)} className="h-5 w-5" />
        ))}
      </div>
      <span className="ml-2 text-gray-600 text-sm font-medium">{rating.toFixed(1)}</span>
      <span className="ml-1 text-gray-400 text-sm">({reviewCount})</span>
    </div>
  );
};

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleEnquiryClick = () => {
    const isLoggedIn = !!localStorage.getItem('authToken');
    if (isLoggedIn) {
      setIsMessageModalOpen(true);
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col">
        <div className="p-6 pb-4 flex-grow">
          <div className="flex items-center space-x-4 mb-4">
            <img className="h-20 w-20 rounded-full object-cover" src={tutor.imageUrl} alt={tutor.name} />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-gray-800">{tutor.name}</h3>
                {tutor.isVerified && <VerifiedIcon className="h-5 w-5 text-blue-600" />}
              </div>
              <p className="text-sm text-gray-500">{tutor.location}</p>
              <div className="mt-1">
                <Rating rating={tutor.rating} reviewCount={tutor.reviewCount} />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 text-sm line-clamp-2 h-10">{tutor.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tutor.subjects.slice(0, 3).map((subject) => (
              <span key={subject} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {subject}
              </span>
            ))}
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-3">
              <Link 
                to={`/tutor/${tutor.id}`} 
                className="w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View Profile
              </Link>
              <button
                onClick={handleEnquiryClick}
                className="w-full text-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Send Enquiry
              </button>
          </div>
        </div>
      </div>
      {isMessageModalOpen && <MessageModal tutor={tutor} onClose={() => setIsMessageModalOpen(false)} />}
    </>
  );
};

export default TutorCard;
