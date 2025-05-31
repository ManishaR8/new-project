'use client';
import React from 'react';
import { Home, Heart, Calendar, User } from 'lucide-react';

const Footer = ({ onAddReminder }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        <button className="text-gray-400 flex flex-col items-center justify-center">
          <Home size={20} />
        </button>
        
        <button className="text-gray-400 flex flex-col items-center justify-center">
          <Heart size={20} />
        </button>
        
        <button className="bg-gray-900 text-white rounded-full px-5 py-2 flex items-center space-x-1">
          <Calendar size={18} />
          <span className="text-sm">reminders</span>
        </button>
        
        <button className="text-gray-400 flex flex-col items-center justify-center">
          <User size={20} />
        </button>
      </div>
    </div>
  );
};

export default Footer;
