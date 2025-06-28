import React, { useState } from 'react';
import { Home, CheckSquare, Timer, Heart, Trophy, LogOut, Sun, Moon, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  isDarkMode, 
  onToggleTheme 
}) => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'mood', label: 'Mood', icon: Heart },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings, iconOnly: true },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Dynamic based on theme */}
            <div className="flex items-center space-x-3">
              <img 
                src={isDarkMode ? "/Task_Orbit-removebg-preview.png" : "/Task_Orbit__1_-removebg-preview.png"}
                alt="TaskOrbit" 
                className="h-14 w-auto sm:h-16"
              />
            </div>

            {/* Desktop Navigation - All items moved to right */}
            <div className="hidden lg:flex items-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${activeTab === tab.id
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                      }
                    `}
                  >
                    <Icon size={18} />
                    {!tab.iconOnly && <span>{tab.label}</span>}
                  </button>
                );
              })}
              
              {/* Theme Toggle */}
              <button
                onClick={onToggleTheme}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 ml-2"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span className="hidden xl:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>
              
              {/* Logout Button */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 ml-2"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              )}
            </div>

            {/* Mobile/Tablet Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-200"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <img 
                  src={isDarkMode ? "/Task_Orbit-removebg-preview.png" : "/Task_Orbit__1_-removebg-preview.png"}
                  alt="TaskOrbit" 
                  className="h-10 w-auto"
                />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left
                      ${activeTab === tab.id
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 bg-white dark:bg-gray-900">
              {/* Theme Toggle */}
              <button
                onClick={() => {
                  onToggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
              </button>
              
              {/* Logout Button */}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;