import React from 'react';
import { Rocket, TrendingUp, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <Rocket className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Welcome to TaskOrbit
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your AI-powered mission control for peak productivity. Transform your tasks into achievements with natural language input, smart prioritization, and gamified progress tracking.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Tasks Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Rocket className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Ready</p>
              <p className="text-sm text-gray-600">Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white p-8 rounded-xl border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Today's Focus Orbit</h3>
        <div className="flex items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <Rocket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Your focus tasks will appear here</p>
            <p className="text-sm text-gray-500 mt-2">Add tasks to see your personalized orbit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;