import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const Timer: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Pomodoro Timer</h2>
        <p className="text-gray-600">Stay focused with timed work sessions</p>
      </div>

      {/* Timer Display */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
        <div className="w-64 h-64 mx-auto bg-gradient-to-br from-purple-50 to-indigo-50 rounded-full flex items-center justify-center mb-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">25:00</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Focus Session</div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
            <Play size={18} />
            <span>Start</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200">
            <Pause size={18} />
            <span>Pause</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200">
            <RotateCcw size={18} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Session Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-600">Sessions Today</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">25</div>
          <div className="text-sm text-gray-600">Minutes Focus</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">5</div>
          <div className="text-sm text-gray-600">Minutes Break</div>
        </div>
      </div>
    </div>
  );
};

export default Timer;