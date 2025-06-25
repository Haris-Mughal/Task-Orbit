import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useUser } from './hooks/useUser';
import { useMoodPersonalization } from './hooks/useMoodPersonalization';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Dashboard from './components/pages/Dashboard';
import Tasks from './components/pages/Tasks';
import Timer from './components/pages/Timer';
import Mood from './components/pages/Mood';
import Achievements from './components/pages/Achievements';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();
  const { profile } = useUser(user?.id);
  const { getMoodTheme } = useMoodPersonalization();

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
      default:
        return <Dashboard />;
    }
  };

  // Get mood-based theme
  const currentMood = profile?.mood || 'neutral';
  const moodTheme = getMoodTheme(currentMood);

  return (
    <div className={`min-h-screen flex flex-col ${currentMood !== 'neutral' ? moodTheme.background : 'bg-gray-50'}`}>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;