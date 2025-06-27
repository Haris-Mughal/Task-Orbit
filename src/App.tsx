import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useUser } from './hooks/useUser';
import { useMoodPersonalization } from './hooks/useMoodPersonalization';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import BoltBadge from './components/BoltBadge';
import Dashboard from './components/pages/Dashboard';
import Tasks from './components/pages/Tasks';
import Timer from './components/pages/Timer';
import Mood from './components/pages/Mood';
import Achievements from './components/pages/Achievements';
import Settings from './components/pages/Settings';
import AuthForm from './components/AuthForm';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { profile } = useUser(user?.id);
  const { getMoodTheme } = useMoodPersonalization();

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
    } else {
      // Auto-detect system preference
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <Tasks />;
      case 'timer':
        return <Timer />;
      case 'mood':
        return <Mood />;
      case 'achievements':
        return <Achievements />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Show auth form without header/footer if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <AuthForm />
      </div>
    );
  }

  // Get mood-based theme for authenticated users
  const currentMood = profile?.mood || 'neutral';
  const moodTheme = getMoodTheme(currentMood);

  return (
    <div className={`min-h-screen flex flex-col ${currentMood !== 'neutral' ? moodTheme.background : 'bg-gray-50 dark:bg-gray-900'}`}>
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Bolt.new Badge - positioned in body section */}
        <BoltBadge />
        
        {renderActiveTab()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;