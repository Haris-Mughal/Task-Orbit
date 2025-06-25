import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target, Clock } from 'lucide-react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { useMotivation } from '../../hooks/useMotivation';
import MotivationalToast from '../MotivationalToast';

const Timer: React.FC = () => {
  const { 
    session, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    formatTime, 
    getProgress 
  } = usePomodoro();

  const { messages, showPepTalk, dismissMessage } = useMotivation();

  // Handle session completion and show motivational messages
  useEffect(() => {
    if (session.timeRemaining === 0 && session.state === 'running') {
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        if (session.mode === 'focus') {
          new Notification('Focus Session Complete!', {
            body: 'Time for a 5-minute break 🎉',
            icon: '/vite.svg'
          });
        } else if (session.mode === 'break') {
          new Notification('Break Complete!', {
            body: 'Ready for another focus session? 💪',
            icon: '/vite.svg'
          });
        }
      }

      // Show motivational pep talk
      if (session.mode === 'focus') {
        showPepTalk('focus');
      } else if (session.mode === 'break') {
        showPepTalk('break');
      }
    }
  }, [session.timeRemaining, session.state, session.mode, showPepTalk]);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const getModeIcon = () => {
    switch (session.mode) {
      case 'focus':
        return <Target className="w-8 h-8 text-purple-600" />;
      case 'break':
        return <Coffee className="w-8 h-8 text-green-600" />;
      default:
        return <Clock className="w-8 h-8 text-gray-400" />;
    }
  };

  const getModeColor = () => {
    switch (session.mode) {
      case 'focus':
        return 'from-purple-500 to-indigo-600';
      case 'break':
        return 'from-green-500 to-emerald-600';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getModeBackground = () => {
    switch (session.mode) {
      case 'focus':
        return 'from-purple-50 to-indigo-50';
      case 'break':
        return 'from-green-50 to-emerald-50';
      default:
        return 'from-gray-50 to-gray-100';
    }
  };

  const getModeText = () => {
    switch (session.mode) {
      case 'focus':
        return 'Focus Session';
      case 'break':
        return 'Break Time';
      default:
        return 'Ready to Focus';
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Pomodoro Timer</h2>
          <p className="text-gray-600">Stay focused with timed work sessions</p>
        </div>

        {/* Timer Display */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
          <div className="text-center">
            {/* Timer Circle */}
            <div className="relative w-80 h-80 mx-auto mb-8">
              {/* Progress Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-gray-200"
                />
                {/* Progress Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                  className={`text-purple-500 transition-all duration-1000 ease-linear ${
                    session.mode === 'break' ? 'text-green-500' : 'text-purple-500'
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Timer Content */}
              <div className={`absolute inset-4 rounded-full bg-gradient-to-br ${getModeBackground()} flex flex-col items-center justify-center`}>
                <div className="mb-4">
                  {getModeIcon()}
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {formatTime(session.timeRemaining)}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide font-medium">
                  {getModeText()}
                </div>
                {session.mode === 'focus' && session.state === 'running' && (
                  <div className="mt-2 text-xs text-gray-500">
                    Session {session.sessionsCompleted + 1}
                  </div>
                )}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center space-x-4">
              {session.state === 'running' ? (
                <button
                  onClick={pauseTimer}
                  className="flex items-center space-x-2 px-8 py-4 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Pause size={20} />
                  <span className="font-medium">Pause</span>
                </button>
              ) : (
                <button
                  onClick={startTimer}
                  className={`flex items-center space-x-2 px-8 py-4 bg-gradient-to-r ${getModeColor()} text-white rounded-xl hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
                >
                  <Play size={20} />
                  <span className="font-medium">
                    {session.state === 'paused' ? 'Resume' : 'Start'}
                  </span>
                </button>
              )}
              
              <button
                onClick={resetTimer}
                className="flex items-center space-x-2 px-8 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RotateCcw size={20} />
                <span className="font-medium">Reset</span>
              </button>
            </div>

            {/* Session Status */}
            {session.mode !== 'idle' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <span className={`w-2 h-2 rounded-full ${
                    session.state === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></span>
                  <span>
                    {session.state === 'running' 
                      ? `${session.mode === 'focus' ? 'Focusing' : 'On Break'}...` 
                      : 'Paused'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Session Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {session.sessionsCompleted}
                </div>
                <div className="text-sm text-gray-600">Sessions Today</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.floor(session.totalFocusTime / 60)}
                </div>
                <div className="text-sm text-gray-600">Minutes Focused</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Coffee className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {session.mode === 'break' ? '5' : '25'}
                </div>
                <div className="text-sm text-gray-600">
                  {session.mode === 'break' ? 'Break Minutes' : 'Focus Minutes'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">Pomodoro Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Focus completely during the 25-minute sessions</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Take real breaks - step away from your screen</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Turn off notifications during focus time</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Use breaks for stretching or hydration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Toast Messages */}
      <div className="fixed top-0 right-0 z-50 space-y-4 p-4">
        {messages.map((message) => (
          <MotivationalToast
            key={message.id}
            message={message}
            onDismiss={dismissMessage}
            autoHide={true}
            duration={8000}
          />
        ))}
      </div>
    </>
  );
};

export default Timer;