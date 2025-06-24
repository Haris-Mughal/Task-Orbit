import React from 'react';
import { Smile, Meh, Frown, Heart } from 'lucide-react';

const Mood: React.FC = () => {
  const moods = [
    { id: 'amazing', label: 'Amazing', icon: Heart, color: 'text-pink-500' },
    { id: 'good', label: 'Good', icon: Smile, color: 'text-green-500' },
    { id: 'okay', label: 'Okay', icon: Meh, color: 'text-yellow-500' },
    { id: 'low', label: 'Low', icon: Frown, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">How are you feeling today?</h2>
        <p className="text-gray-600">Your mood helps us personalize your experience</p>
      </div>

      {/* Mood Selection */}
      <div className="bg-white p-8 rounded-xl border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moods.map((mood) => {
            const Icon = mood.icon;
            return (
              <button
                key={mood.id}
                className="flex flex-col items-center space-y-3 p-6 rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
              >
                <Icon size={32} className={mood.color} />
                <span className="font-medium text-gray-900">{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mood Insights */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Insights</h3>
        <div className="flex items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Track your daily mood</p>
            <p className="text-sm text-gray-500 mt-2">Select your mood to see personalized insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mood;