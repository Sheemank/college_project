import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import InboxIcon from './icons/InboxIcon';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuthState = () => {
      const token = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
      setIsLoggedIn(!!token);
      setCurrentUser(user);
    };

    updateAuthState(); // Initial check

    window.addEventListener('storage', updateAuthState);
    return () => window.removeEventListener('storage', updateAuthState);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              FindMyTutor
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({ isActive }) => `text-slate-500 hover:text-indigo-600 transition-colors ${isActive ? 'text-indigo-600 font-semibold' : ''}`}>Home</NavLink>
            <NavLink to="/search" className={({ isActive }) => `text-slate-500 hover:text-indigo-600 transition-colors ${isActive ? 'text-indigo-600 font-semibold' : ''}`}>Find a Tutor</NavLink>
             {isLoggedIn && (
                 <NavLink to="/inbox" className={({ isActive }) => `flex items-center text-slate-500 hover:text-indigo-600 transition-colors ${isActive ? 'text-indigo-600 font-semibold' : ''}`}>
                    <InboxIcon className="h-5 w-5 mr-1" />
                    Inbox
                 </NavLink>
             )}
          </nav>
          <div className="flex items-center space-x-4">
            {isLoggedIn && currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex items-center space-x-2 focus:outline-none">
                  <img src={(currentUser as any).imageUrl} alt="profile" className="w-9 h-9 rounded-full object-cover"/>
                  <span className="hidden sm:inline text-slate-700 font-medium">{(currentUser as any).name}</span>
                   <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" onClick={() => setIsDropdownOpen(false)}>My Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-slate-500 hover:text-indigo-600">Log In</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;