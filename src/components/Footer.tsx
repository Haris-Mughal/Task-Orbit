import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="text-sm">© 2025 TaskOrbit. Built with</span>
            <a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full text-xs font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 hover:shadow-md transform hover:scale-105"
            >
              <span>Bolt.new</span>
              <ExternalLink size={12} />
            </a>
          </div>
          
          <div className="text-xs text-gray-500">
            AI-Powered Task Management for Peak Productivity
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;