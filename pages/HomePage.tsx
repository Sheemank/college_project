import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Tutor, Review } from '../types';
import { api } from '../services/api';
import TutorCard from '../components/TutorCard';
import Counter from '../components/Counter';
import ReviewCard from '../components/ReviewCard';

const HomePage = () => {
  const [topTutors, setTopTutors] = useState<Tutor[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tutorsData, reviewsData] = await Promise.all([
            api.getTopTutors(),
            api.getReviews()
        ]);
        setTopTutors(tutorsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      location: location,
      subject: subject
    }).toString();
    navigate(`/search?${query}`);
  };
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-indigo-50 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">Find Your Perfect Tutor Today</h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto">Unlock your potential with expert one-on-one tutoring tailored to your needs.</p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Location (e.g., New York, NY)" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-grow p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input 
              type="text" 
              placeholder="Subject (e.g., Physics)" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-grow p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition-colors font-semibold">Search</button>
          </form>
        </div>
      </section>
      
      {/* Top Tutors Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-10">Top Tutors Near You</h2>
          {isLoading ? (
             <div className="text-center">Loading tutors...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {topTutors.map(tutor => <TutorCard key={tutor.id} tutor={tutor} />)}
            </div>
          )}
        </div>
      </section>

      {/* Trusted Platform Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-10">A Platform Trusted by Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Counter targetValue={50000} label="Happy Students" suffix="+" />
            <Counter targetValue={10000} label="Expert Tutors" suffix="+" />
            <Counter targetValue={200000} label="Hours Tutored" suffix="+" />
          </div>
        </div>
      </section>

      {/* Students Speak Section */}
      <section className="py-16 overflow-hidden">
          <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center text-slate-800 mb-10">Students Speak</h2>
              <div className="relative w-full">
                  <div className="flex animate-infinite-scroll group-hover:pause">
                      {[...reviews, ...reviews].map((review, index) => (
                          <ReviewCard key={`${review.id}-${index}`} review={review} />
                      ))}
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
};

export default HomePage;