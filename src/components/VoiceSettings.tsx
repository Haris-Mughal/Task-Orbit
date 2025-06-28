import React from 'react';
import { Volume2, Mic, Settings } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

const VoiceSettings: React.FC = () => {
  const { selectedVoice, getVoiceOptions, selectVoice, speak } = useVoiceAssistant();
  const voiceOptions = getVoiceOptions();

  const testVoice = () => {
    speak("Hello! I'm your AI assistant. I'm here to help you manage your tasks with a friendly voice!", { 
      rate: 0.95, 
      pitch: 1.1 
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
          <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Voice Assistant</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Customize your AI voice experience</p>
        </div>
      </div>

      {/* Current Voice Display */}
      <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-900 dark:text-purple-300">Current Voice</p>
            <p className="text-lg font-semibold text-purple-700 dark:text-purple-400">
              {selectedVoice?.name || 'Default System Voice'}
            </p>
            {selectedVoice && (
              <p className="text-xs text-purple-600 dark:text-purple-500">
                {selectedVoice.lang} • {selectedVoice.name.includes('Google') ? 'High Quality' : 'Standard'}
              </p>
            )}
          </div>
          <button
            onClick={testVoice}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <Volume2 size={16} />
            <span>Test Voice</span>
          </button>
        </div>
      </div>

      {/* Voice Selection */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center space-x-2">
          <Settings size={16} />
          <span>Available Voices</span>
        </h4>
        
        <div className="max-h-48 overflow-y-auto space-y-2">
          {voiceOptions.map((voice, index) => (
            <button
              key={index}
              onClick={() => selectVoice(voice.name)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                selectedVoice?.name === voice.name
                  ? 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 hover:bg-purple-25 dark:hover:bg-purple-900/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {voice.name}
                    {voice.isFemale && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200">
                        ♀ Female
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {voice.lang}
                    {voice.name.includes('Google') && (
                      <span className="ml-2 text-green-600 dark:text-green-400 font-medium">• Premium Quality</span>
                    )}
                    {voice.isDefault && (
                      <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">• System Default</span>
                    )}
                  </p>
                </div>
                {selectedVoice?.name === voice.name && (
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Features */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Voice Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <Mic className="w-4 h-4 text-green-500" />
            <span>Voice-to-text task creation</span>
          </div>
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-blue-500" />
            <span>Spoken confirmations</span>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-purple-500" />
            <span>Mood-adaptive speech</span>
          </div>
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-orange-500" />
            <span>Motivational pep talks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSettings;