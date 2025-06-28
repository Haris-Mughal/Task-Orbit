import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import VoiceSettings from '../VoiceSettings';
import AuthForm from '../AuthForm';

const Settings: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Customize your TaskOrbit experience</p>
      </div>

      <VoiceSettings />
    </div>
  );
};

export default Settings;