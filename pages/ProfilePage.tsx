
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { User, Tutor } from '../types';
import StarIcon from '../components/icons/StarIcon';
import VerifiedIcon from '../components/icons/VerifiedIcon';
import AvailabilityDisplay from '../components/AvailabilityDisplay';

const ProfilePage = () => {
  const [user, setUser] = useState<User | Tutor | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);
  
  // This effect listens for changes in localStorage to update the profile page live
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      setUser(updatedUser);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!user) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  const isTutor = 'subjects' in user;

  const renderStudentProfile = (student: User) => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm mx-auto">
      <img src={student.imageUrl} alt={student.name} className="w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-blue-200" />
      <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
      <p className="text-gray-500 mt-2">Student Account</p>
      <Link 
        to="/profile/edit"
        className="mt-6 inline-block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
        Edit Profile
      </Link>
    </div>
  );

  const renderTutorProfile = (tutor: Tutor) => (
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
          <Link 
            to="/profile/edit"
            className="mt-6 block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Edit Profile
          </Link>
        </div>
      </div>
      
      {/* Right Column */}
      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">About Me</h2>
          <p className="text-gray-600 leading-relaxed">{tutor.description}</p>
          
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Availability</h3>
            <AvailabilityDisplay availability={tutor.availability} />
          </div>
          
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
  );

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
        {isTutor ? renderTutorProfile(user as Tutor) : renderStudentProfile(user)}
      </div>
    </div>
  );
};

export default ProfilePage;
