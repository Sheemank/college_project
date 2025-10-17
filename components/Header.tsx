
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import InboxIcon from './icons/InboxIcon';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // This is a simple check. In a real app, you might want to validate the token.
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

    // Listen for storage changes to update UI across tabs
    const handleStorageChange = () => {
        setIsLoggedIn(!!localStorage.getItem('authToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              FindMyTutor
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" className={({ isActive }) => `text-gray-500 hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600 font-semibold' : ''}`}>Home</NavLink>
            <NavLink to="/search" className={({ isActive }) => `text-gray-500 hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600 font-semibold' : ''}`}>Find a Tutor</NavLink>
             {isLoggedIn && (
                 <NavLink to="/inbox" className={({ isActive }) => `flex items-center text-gray-500 hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600 font-semibold' : ''}`}>
                    <InboxIcon className="h-5 w-5 mr-1" />
                    Inbox
                 </NavLink>
             )}
          </nav>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Log Out
              </button>
            ) : (
              <>
                <Link to="/login" className="text-gray-500 hover:text-blue-600">Log In</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
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
