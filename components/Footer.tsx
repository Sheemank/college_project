import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-indigo-600 mb-4">FindMyTutor</h3>
            <p className="text-slate-500 text-sm">Connecting students and tutors, one lesson at a time.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-500 hover:text-indigo-600">Home</Link></li>
              <li><Link to="/search" className="text-slate-500 hover:text-indigo-600">Find a Tutor</Link></li>
              <li><Link to="/register" className="text-slate-500 hover:text-indigo-600">Become a Tutor</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-3">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-500 hover:text-indigo-600">FAQ</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600">Contact Us</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-500 hover:text-indigo-600">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} FindMyTutor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;