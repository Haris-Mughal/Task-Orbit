import React from 'react';
import { Trophy, Star, Target, Zap } from 'lucide-react';

const Achievements: React.FC = () => {
  const badges = [
    { id: 'first-task', name: 'First Steps', description: 'Complete your first task', icon: Star, earned: false },
    { id: 'streak-7', name: 'Week Warrior', description: '7-day completion streak', icon: Target, earned: false },
    { id: 'pomodoro-10', name: 'Focus Master', description: 'Complete 10 Pomodoro sessions', icon: Zap, earned: false },
    { id: 'streak-30', name: 'Month Champion', description: '30-day completion streak', icon: Trophy, earned: false },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
        <p className="text-gray-600">Track your progress and unlock badges</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
          <div className="text-sm text-gray-600">0 / 4 badges earned</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full" style={{ width: '0%' }}></div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`
                p-6 rounded-xl border-2 transition-all duration-200
                ${badge.earned
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-200 bg-white hover:shadow-md'
                }
              `}
            >
              <div className="flex items-start space-x-4">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center
                  ${badge.earned
                    ? 'bg-purple-100'
                    : 'bg-gray-100'
                  }
                `}>
                  <Icon
                    size={24}
                    className={badge.earned ? 'text-purple-600' : 'text-gray-400'}
                  />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${badge.earned ? 'text-purple-900' : 'text-gray-900'}`}>
                    {badge.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                  {badge.earned && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Earned
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;