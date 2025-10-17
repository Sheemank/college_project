import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Tutor } from '../types';
import { api } from '../services/api';
import StarIcon from '../components/icons/StarIcon';
import MessageModal from '../components/MessageModal';
import VerifiedIcon from '../components/icons/VerifiedIcon';

const TutorProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  const isLoggedIn = !!localStorage.getItem('authToken');

  useEffect(() => {
    const fetchTutor = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const tutorData = await api.getTutorById(id);
        if (tutorData) {
          setTutor(tutorData);
        } else {
          // Handle tutor not found
        }
      } catch (error) {
        console.error("Failed to fetch tutor:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTutor();
  }, [id]);
  
  const handleContactClick = () => {
    if (isLoggedIn) {
      setIsMessageModalOpen(true);
    } else {
      alert('Please log in to contact this tutor.');
    }
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  if (!tutor) {
    return <div className="text-center py-20">Tutor not found.</div>;
  }

  return (
    <>
      <div className="bg-gray-100">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img src={tutor.imageUrl} alt={tutor.name} className="w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-blue-200" />
                <h1 className="text-2xl font-bold text-gray-800">{tutor.name}</h1>
                {tutor.isVerified && (
                  <div className="flex items-center justify-center gap-2 mt-2 text-blue-600">
                    <VerifiedIcon className="h-6 w-6" />
                    <span className="font-semibold text-md">Verified Tutor</span>
                  </div>
                )}
                <p className="text-gray-500 mt-2">{tutor.location}</p>
                <div className="flex justify-center items-center mt-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} isFilled={i < Math.round(tutor.rating)} className="h-5 w-5" />)}
                  </div>
                  <span className="ml-2 text-gray-600 font-medium">{tutor.rating.toFixed(1)}</span>
                  <span className="ml-1 text-gray-400 text-sm">({tutor.reviewCount} reviews)</span>
                </div>
                <p className="text-4xl font-bold text-gray-800 mt-4">${tutor.hourlyRate}<span className="text-lg font-normal text-gray-500">/hr</span></p>
                <button 
                  onClick={handleContactClick}
                  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Contact Tutor
                </button>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">About {tutor.name}</h2>
                <p className="text-gray-600 leading-relaxed">{tutor.description}</p>
                
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map(subject => (
                      <span key={subject} className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">{subject}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                   <h3 className="font-semibold text-gray-700 mb-2">Experience</h3>
                   <p className="text-gray-600">{tutor.experience} years</p>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Qualifications</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {tutor.qualifications.map(q => <li key={q}>{q}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isMessageModalOpen && <MessageModal tutor={tutor} onClose={() => setIsMessageModalOpen(false)} />}
    </>
  );
};

export default TutorProfilePage;
