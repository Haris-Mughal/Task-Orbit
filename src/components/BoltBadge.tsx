import React from 'react';

const BoltBadge: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img 
          src="/black_circle_360x360.svg" 
          alt="Built with Bolt.new" 
          className="w-12 h-12 opacity-80 hover:opacity-100 transition-opacity duration-200"
        />
      </a>
    </div>
  );
};

export default BoltBadge;