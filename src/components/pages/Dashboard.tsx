import React, { useEffect } from 'react';
import { Rocket, TrendingUp, CheckCircle, Calendar, Target } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useUser } from '../../hooks/useUser';
import { useGamification } from '../../hooks/useGamification';
import { useMoodPersonalization } from '../../hooks/useMoodPersonalization';
import AuthForm from '../AuthForm';
import BadgeNotification from '../BadgeNotification';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks(user?.id);
  const { profile, loading: profileLoading } = useUser(user?.id);
  const { newBadges, dismissNewBadge, incrementStreak } = useGamification(user?.id);
  const { getMoodTheme, getTaskDisplayLimit, getMoodBasedTaskPriority } = useMoodPersonalization();

  // Check for daily streak increment when user visits dashboard
  useEffect(() => {
    if (user && profile) {
      const today = new Date().toDateString();
      const lastLogin = profile.last_login ? new Date(profile.last_login).toDateString() : null;
      
      // Check if user has completed any tasks today
      const todayTasks = tasks.filter(task => {
        const taskDate = new Date(task.created_at).toDateString();
        return taskDate === today && task.completed;
      });

      // If user has completed tasks today and hasn't been counted for today's streak
      if (todayTasks.length > 0 && lastLogin !== today) {
        incrementStreak();
      }
    }
  }, [user, profile, tasks, incrementStreak]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = tasks.filter(t => !t.completed).length;
  const todayTasks = tasks.filter(t => {
    if (!t.due_date) return false;
    const today = new Date();
    const taskDate = new Date(t.due_date);
    return taskDate.toDateString() === today.toDateString();
  });

  // Get mood-based personalization
  const currentMood = profile?.mood || 'neutral';
  const moodTheme = getMoodTheme(currentMood);
  const taskLimit = getTaskDisplayLimit(currentMood);
  const taskPriority = getMoodBasedTaskPriority(currentMood);

  // Filter and limit tasks based on mood
  const focusTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => {
      // Adjust sorting based on mood
      if (currentMood === 'sad') {
        // For sad mood, prioritize easier tasks (lower priority numbers)
        return a.priority - b.priority;
      } else if (currentMood === 'happy' || currentMood === 'amazing') {
        // For positive moods, prioritize challenging tasks (higher priority)
        return b.priority - a.priority;
      }
      // Default sorting for neutral mood
      return b.priority - a.priority;
    })
    .slice(0, taskLimit);

  const getMoodGreeting = () => {
    switch (currentMood) {
      case 'happy':
        return "You're glowing today! ✨";
      case 'amazing':
        return "You're absolutely incredible! 🌟";
      case 'neutral':
        return "Ready to make progress! 🎯";
      case 'sad':
        return "Taking it gentle today 💜";
      default:
        return "Welcome back!";
    }
  };

  const getMoodMessage = () => {
    switch (currentMood) {
      case 'happy':
        return "Your positive energy is perfect for tackling ambitious goals!";
      case 'amazing':
        return "Channel this incredible energy into your biggest dreams!";
      case 'neutral':
        return "Your balanced mindset is ideal for steady, consistent progress.";
      case 'sad':
        return "Small steps are still progress. Be kind to yourself today.";
      default:
        return "Ready to conquer your tasks and boost your productivity?";
    }
  };

  return (
    <>
      {/* PURE BLACK BACKGROUND FOR DARK MODE - No mood themes in dark mode */}
      <div className="space-y-8 min-h-screen -m-8 p-8">
        {/* Welcome Section */}
        <div className={`text-center py-8 bg-gradient-to-br ${moodTheme.secondary} rounded-2xl border-2 border-white/50 dark:border-gray-800/50 backdrop-blur-sm`}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg p-2 border border-gray-200 dark:border-gray-800">
              <img 
                src="/Untitled_design__4_-removebg-preview.png" 
                alt="TaskOrbit" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold ${moodTheme.text} mb-2`}>
            {getMoodGreeting()}{profile?.name ? ` ${profile.name}` : ''}
          </h2>
          <p className={`text-lg ${moodTheme.text} opacity-80`}>
            {getMoodMessage()}
          </p>
          
          {/* Mood Indicator */}
          {currentMood !== 'neutral' && (
            <div className={`mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-full border border-white/50 dark:border-gray-800/50`}>
              <span className="text-lg">
                {currentMood === 'happy' ? '😊' : 
                 currentMood === 'amazing' ? '🤩' : 
                 currentMood === 'sad' ? '💜' : '😐'}
              </span>
              <span className={`font-medium ${moodTheme.accent} capitalize`}>
                Feeling {currentMood}
              </span>
            </div>
          )}
          
          {/* Streak Display */}
          {profile?.streak_count && profile.streak_count > 0 && (
            <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 rounded-full border border-orange-200 dark:border-orange-800 ml-2">
              <span className="text-2xl">🔥</span>
              <span className="font-bold text-orange-800 dark:text-orange-300">
                {profile.streak_count} day streak!
              </span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 dark:border-gray-800/50 hover:shadow-lg transition-all duration-200 hover:bg-white/90 dark:hover:bg-gray-900/90">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tasksLoading ? '...' : completedTasks}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 dark:border-gray-800/50 hover:shadow-lg transition-all duration-200 hover:bg-white/90 dark:hover:bg-gray-900/90">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${moodTheme.secondary} rounded-lg flex items-center justify-center`}>
                <Target className={`w-6 h-6 ${moodTheme.accent}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tasksLoading ? '...' : activeTasks}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 dark:border-gray-800/50 hover:shadow-lg transition-all duration-200 hover:bg-white/90 dark:hover:bg-gray-900/90">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tasksLoading ? '...' : todayTasks.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Due Today</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 dark:border-gray-800/50 hover:shadow-lg transition-all duration-200 hover:bg-white/90 dark:hover:bg-gray-900/90">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profileLoading ? '...' : profile?.streak_count || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Focus Orbit */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl border border-white/50 dark:border-gray-800/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-semibold ${moodTheme.text}`}>
              {currentMood === 'sad' ? 'Gentle Progress Today' : 
               currentMood === 'happy' || currentMood === 'amazing' ? 'Power Goals Orbit' : 
               "Today's Focus Orbit"}
            </h3>
            {currentMood === 'sad' && (
              <span className="text-sm text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-full">
                Taking it easy today 💜
              </span>
            )}
          </div>
          
          {focusTasks.length > 0 ? (
            <div className="space-y-4">
              {focusTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`flex items-center space-x-4 p-4 bg-gradient-to-r ${moodTheme.secondary} rounded-lg border border-white/50 dark:border-gray-800/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all duration-200`}
                >
                  <div className={`w-8 h-8 bg-gradient-to-br ${moodTheme.primary} rounded-full flex items-center justify-center shadow-sm`}>
                    <span className="text-white font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${moodTheme.text}`}>{task.title}</h4>
                    <div className={`flex items-center space-x-4 text-sm ${moodTheme.text} opacity-70 mt-1`}>
                      <span className="flex items-center space-x-1">
                        <Target size={14} />
                        <span>{task.category}</span>
                      </span>
                      {task.due_date && (
                        <span className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{new Date(task.due_date).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${task.priority >= 4 
                        ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' 
                        : task.priority >= 3 
                          ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                          : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      }
                    `}>
                      {currentMood === 'sad' ? 'Gentle' : `Priority ${task.priority}`}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Mood-based encouragement */}
              {currentMood === 'sad' && (
                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-300 text-center">
                    💜 Remember: Small steps are still progress. You're doing great by showing up today.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-900/50">
              <div className="text-center">
                <Rocket className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {currentMood === 'sad' 
                    ? "No pressure today - your wellbeing comes first" 
                    : "Your focus tasks will appear here"
                  }
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  {currentMood === 'sad' 
                    ? "Add gentle tasks when you're ready" 
                    : "Add tasks to see your personalized orbit"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Badge Notifications */}
      {newBadges.map((badge) => (
        <BadgeNotification
          key={badge.id}
          badge={badge}
          onDismiss={dismissNewBadge}
          autoHide={true}
          duration={10000}
        />
      ))}
    </>
  );
};

export default Dashboard;