
import React, { useState } from 'react';
import { api } from '../services/api';

type Role = 'student' | 'teacher';

const RegistrationPage = () => {
  const [role, setRole] = useState<Role>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    profilePhoto: null as File | null,
    experience: '',
    subjects: '',
    qualifications: '',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, profilePhoto: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    const { profilePhoto, ...dataToSend } = formData;
    const finalData = { ...dataToSend, role };
    // In a real app, you would handle file upload separately
    console.log("Submitting:", finalData, "Photo:", profilePhoto?.name);

    try {
      const response = await api.registerUser(finalData);
      setMessage(response.message);
      if (!response.success) {
        // handle error styling
      }
    } catch (error) {
      setMessage('An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setRole('student')}
            className={`flex-1 py-2 text-sm font-medium text-center ${role === 'student' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            I'm a Student
          </button>
          <button
            onClick={() => setRole('teacher')}
            className={`flex-1 py-2 text-sm font-medium text-center ${role === 'teacher' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            I'm a Teacher
          </button>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Full Name" />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleInputChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Phone Number" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required value={formData.password} onChange={handleInputChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
          </div>

          {role === 'teacher' && (
            <div className="space-y-4">
              <textarea name="subjects" placeholder="Subjects you teach (comma-separated)" value={formData.subjects} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              <textarea name="qualifications" placeholder="Qualifications" value={formData.qualifications} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              <input type="number" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                {formData.profilePhoto ? <img src={URL.createObjectURL(formData.profilePhoto)} alt="Avatar Preview" className="h-full w-full object-cover" /> : <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.993A1 1 0 001 19.007v-2.01a1 1 0 00-1-1H0v-2.007A1 1 0 001 13.007v-2.01a1 1 0 00-1-1H0V8.007A1 1 0 001 7.007v-2.01a1 1 0 00-1-1H0V2.007A1 1 0 001 1.007V0h22v1.007a1 1 0 001 1.006v2.006a1 1 0 00-1 .994v2.006a1 1 0 001 .994v2.006a1 1 0 00-1 .994v2.01a1 1 0 001 1.006v2.01a1 1 0 00-1 .993zM12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>}
              </span>
              <input type="file" onChange={handleFileChange} className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <button type="submit" disabled={isSubmitting} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
              {isSubmitting ? 'Submitting...' : 'Sign up'}
            </button>
          </div>
          {message && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
