import React from 'react';
import { ExternalLink } from 'lucide-react';

const BoltBadge: React.FC = () => {
  return (
    <div className="fixed top-20 right-4 z-40">
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-purple-700 hover:to-indigo-700"
      >
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center p-1">
          <img 
            src="/black_circle_360x360.svg" 
            alt="Bolt.new" 
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-sm font-semibold">Built with Bolt.new</span>
        <ExternalLink 
          size={14} 
          className="opacity-70 group-hover:opacity-100 transition-opacity duration-200" 
        />
      </a>
    </div>
  );
};

export default BoltBadge;