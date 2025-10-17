import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Tutor } from '../types';
import { api } from '../services/api';
import TutorCard from '../components/TutorCard';

const PAGE_SIZE = 4;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // Form state
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [minRate, setMinRate] = useState(searchParams.get('minRate') || '');
  const [maxRate, setMaxRate] = useState(searchParams.get('maxRate') || '');
  const [minExperience, setMinExperience] = useState(searchParams.get('minExperience') || '');

  const fetchTutors = useCallback(async (isNewSearch: boolean) => {
    setIsLoading(true);
    const currentOffset = isNewSearch ? 0 : offset;
    
    try {
      const { tutors: newTutors, hasMore: newHasMore } = await api.searchTutors({
        location: searchParams.get('location') || undefined,
        subject: searchParams.get('subject') || undefined,
        minRate: searchParams.get('minRate') ? Number(searchParams.get('minRate')) : undefined,
        maxRate: searchParams.get('maxRate') ? Number(searchParams.get('maxRate')) : undefined,
        minExperience: searchParams.get('minExperience') ? Number(searchParams.get('minExperience')) : undefined,
        offset: currentOffset,
        limit: PAGE_SIZE,
      });

      if (isNewSearch) {
        setTutors(newTutors);
      } else {
        setTutors(prev => [...prev, ...newTutors]);
      }
      
      setHasMore(newHasMore);
      setOffset(currentOffset + PAGE_SIZE);
    } catch (error) {
      console.error("Failed to search for tutors:", error);
    } finally {
      setIsLoading(false);
    }
  }, [offset, searchParams]);
  
  useEffect(() => {
    setTutors([]);
    setOffset(0);
    setHasMore(true);
    // This effect is triggered by searchParams change. 
    // We use a timeout to avoid a flash of 'no results' when the page loads before fetchTutors is called.
    const timer = setTimeout(() => {
        fetchTutors(true);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: { [key: string]: string } = {};
    if (location) params.location = location;
    if (subject) params.subject = subject;
    if (minRate) params.minRate = minRate;
    if (maxRate) params.maxRate = maxRate;
    if (minExperience) params.minExperience = minExperience;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setLocation('');
    setSubject('');
    setMinRate('');
    setMaxRate('');
    setMinExperience('');
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Tutor</h2>
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Location (e.g., New York, NY)" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input 
              type="text" 
              placeholder="Subject (e.g., Physics)" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div>
              <label htmlFor="minRate" className="block text-sm font-medium text-gray-700 mb-1">Min Rate ($/hr)</label>
              <input
                  id="minRate"
                  type="number"
                  placeholder="e.g., 20"
                  value={minRate}
                  onChange={(e) => setMinRate(e.target.value)}
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
            </div>
            <div>
              <label htmlFor="maxRate" className="block text-sm font-medium text-gray-700 mb-1">Max Rate ($/hr)</label>
              <input
                  id="maxRate"
                  type="number"
                  placeholder="e.g., 100"
                  value={maxRate}
                  onChange={(e) => setMaxRate(e.target.value)}
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
            </div>
            <div>
              <label htmlFor="minExperience" className="block text-sm font-medium text-gray-700 mb-1">Min Experience (years)</label>
              <input
                  id="minExperience"
                  type="number"
                  placeholder="e.g., 2"
                  value={minExperience}
                  onChange={(e) => setMinExperience(e.target.value)}
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end items-center pt-6 border-t gap-4">
             <button
              type="button"
              onClick={handleClearFilters}
              className="w-full sm:w-auto bg-gray-100 border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-200 transition-colors font-semibold"
            >
              Clear Filters
            </button>
            <button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:bg-blue-300">
                {isLoading ? 'Searching...' : 'Search Tutors'}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {tutors.map(tutor => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>

      {!isLoading && tutors.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700">No Tutors Found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
        </div>
      )}

      {hasMore && (
        <div className="text-center mt-12">
          <button 
            onClick={() => fetchTutors(false)} 
            disabled={isLoading}
            className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-900 transition-colors font-semibold disabled:bg-gray-400"
          >
            {isLoading ? 'Loading...' : 'Show More Tutors'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;