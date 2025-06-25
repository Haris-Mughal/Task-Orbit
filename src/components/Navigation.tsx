import React from 'react';
import { Home, CheckSquare, Timer, Heart, Trophy, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { user, signOut } = useAuth();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'mood', label: 'Mood', icon: Heart },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/Untitled_design__1_-removebg-preview (1).png" 
              alt="TaskOrbit" 
              className="h-10 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700 shadow-sm'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
            
            {/* Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-gray-600 hover:text-red-600 hover:bg-red-50 ml-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-100">
          <div className="flex justify-around py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all duration-200
                    ${activeTab === tab.id
                      ? 'text-purple-700'
                      : 'text-gray-500 hover:text-purple-600'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
            
            {/* Mobile Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all duration-200 text-gray-500 hover:text-red-600"
              >
                <LogOut size={20} />
                <span className="text-xs font-medium">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;