import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useUser } from '../../hooks/useUser';
import { useMoodPersonalization } from '../../hooks/useMoodPersonalization';
import TaskInput from '../TaskInput';
import TaskList from '../TaskList';
import AuthForm from '../AuthForm';

const Tasks: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile } = useUser(user?.id);
  const { 
    tasks, 
    loading: tasksLoading, 
    createTask, 
    toggleTask, 
    deleteTask 
  } = useTasks(user?.id);
  const { getMoodTheme, getTaskDisplayLimit } = useMoodPersonalization();

  const handleTaskCreated = async (taskData: any) => {
    const result = await createTask(taskData);
    if (result.error) {
      console.error('Error creating task:', result.error);
    }
  };

  const handleToggleTask = async (id: string) => {
    const result = await toggleTask(id);
    if (result?.error) {
      console.error('Error toggling task:', result.error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    const result = await deleteTask(id);
    if (result.error) {
      console.error('Error deleting task:', result.error);
    }
  };

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

  // Get mood-based personalization
  const currentMood = profile?.mood || 'neutral';
  const moodTheme = getMoodTheme(currentMood);
  const taskLimit = getTaskDisplayLimit(currentMood);

  // Filter tasks based on mood
  const displayTasks = currentMood === 'sad' 
    ? tasks.slice(0, taskLimit) // Limit tasks for sad mood to avoid overwhelm
    : tasks;

  const getMoodTitle = () => {
    switch (currentMood) {
      case 'happy':
        return "Tasks - Powered by Positivity! ✨";
      case 'amazing':
        return "Tasks - You're Unstoppable! 🚀";
      case 'neutral':
        return "Tasks";
      case 'sad':
        return "Tasks - Gentle Progress 💜";
      default:
        return "Tasks";
    }
  };

  const getMoodSubtitle = () => {
    switch (currentMood) {
      case 'happy':
        return "Channel your positive energy into productive action!";
      case 'amazing':
        return "Your incredible energy is perfect for tackling big goals!";
      case 'neutral':
        return "Manage your tasks with AI-powered organization";
      case 'sad':
        return "Small steps forward are still progress. Be gentle with yourself.";
      default:
        return "Manage your tasks with AI-powered organization";
    }
  };

  return (
    <div className={`space-y-6 ${moodTheme.background} min-h-screen -m-8 p-8`}>
      <div className="text-center">
        <h2 className={`text-2xl font-bold ${moodTheme.text}`}>{getMoodTitle()}</h2>
        <p className={`${moodTheme.text} opacity-80`}>{getMoodSubtitle()}</p>
      </div>

      {/* Mood-based encouragement for sad users */}
      {currentMood === 'sad' && (
        <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💜</span>
            <div>
              <p className="text-purple-800 dark:text-purple-300 font-medium">Taking care of you today</p>
              <p className="text-purple-700 dark:text-purple-400 text-sm">I'm showing fewer tasks to keep things manageable. Focus on what feels right for you.</p>
            </div>
          </div>
        </div>
      )}

      {/* Task Input */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 dark:border-gray-700/50 shadow-sm">
        <TaskInput 
          onTaskCreated={handleTaskCreated}
          loading={tasksLoading}
        />
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-white/50 dark:border-gray-700/50 text-center hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200">
          <div className={`text-2xl font-bold ${moodTheme.accent}`}>
            {tasks.filter(t => !t.completed).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Tasks</div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-white/50 dark:border-gray-700/50 text-center hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {tasks.filter(t => t.completed).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-white/50 dark:border-gray-700/50 text-center hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200">
          <div className={`text-2xl font-bold ${moodTheme.text}`}>
            {tasks.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 dark:border-gray-700/50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${moodTheme.text}`}>Your Tasks</h3>
          {currentMood === 'sad' && tasks.length > taskLimit && (
            <span className="text-sm text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-full">
              Showing {taskLimit} of {tasks.length} tasks
            </span>
          )}
        </div>
        <TaskList
          tasks={displayTasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          loading={tasksLoading}
        />
        
        {/* Show hidden tasks message for sad mood */}
        {currentMood === 'sad' && tasks.length > taskLimit && (
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
            <p className="text-sm text-purple-700 dark:text-purple-300 text-center">
              💜 {tasks.length - taskLimit} more tasks are hidden to keep things manageable today. 
              <br />
              <span className="text-xs">You can view all tasks by updating your mood when you're ready.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;