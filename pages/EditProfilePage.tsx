
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, Tutor } from '../types';
import { api } from '../services/api';
import AvailabilityEditor from '../components/AvailabilityEditor';

const EditProfilePage = () => {
  const [user, setUser] = useState<User | Tutor | null>(null);
  const [formData, setFormData] = useState<Partial<Tutor>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      setFormData(currentUser);
      setPhotoPreview(currentUser.imageUrl);
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['hourlyRate', 'experience'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
  };
  
  const handleSubjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const subjects = e.target.value.split(',').map(s => s.trim());
      setFormData(prev => ({ ...prev, subjects }));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create a preview URL
      setPhotoPreview(URL.createObjectURL(file));
      // For this mock app, we'll generate a new random image URL on save
      // instead of handling file uploads.
      setFormData(prev => ({ ...prev, imageUrl: `https://picsum.photos/seed/${prev.name}${Date.now()}/200/200` }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const { success, user: updatedUser } = await api.updateUserProfile(user.id, formData);
      if (success && updatedUser) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('storage')); // Notify other components
        setMessage('Profile updated successfully!');
        setTimeout(() => navigate('/profile'), 1500);
      } else {
        setMessage('Failed to update profile. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return null; // or a loading spinner
  }

  const isTutor = 'subjects' in user;

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8 my-8">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
            <div className="mt-1 flex items-center space-x-4">
              <span className="inline-block h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                {photoPreview ? <img src={photoPreview} alt="Avatar Preview" className="h-full w-full object-cover" /> : <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.993A1 1 0 001 19.007v-2.01a1 1 0 00-1-1H0v-2.007A1 1 0 001 13.007v-2.01a1 1 0 00-1-1H0V8.007A1 1 0 001 7.007v-2.01a1 1 0 00-1-1H0V2.007A1 1 0 001 1.007V0h22v1.007a1 1 0 001 1.006v2.006a1 1 0 00-1 .994v2.006a1 1 D0 001 .994v2.006a1 1 0 00-1 .994v2.01a1 1 0 001 1.006v2.01a1 1 0 00-1 .993zM12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>}
              </span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" />
            </div>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          
          {isTutor && (
            <>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" rows={4} value={formData.description || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">Subjects (comma-separated)</label>
                <input type="text" name="subjects" id="subjects" value={formData.subjects?.join(', ') || ''} onChange={handleSubjectsChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
                <input type="number" name="hourlyRate" id="hourlyRate" value={formData.hourlyRate || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
                <AvailabilityEditor 
                    value={formData.availability || {}} 
                    onChange={(newAvailability) => setFormData(prev => ({ ...prev, availability: newAvailability }))}
                />
              </div>
            </>
          )}

          {message && <p className="text-center text-sm text-green-600 mt-4">{message}</p>}

          <div className="flex justify-end pt-4 border-t mt-8">
            <button type="button" onClick={() => navigate('/profile')} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
