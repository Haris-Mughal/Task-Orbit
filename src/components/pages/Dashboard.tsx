import React from 'react';
import { Rocket, TrendingUp, CheckCircle, Calendar, Target } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useUser } from '../../hooks/useUser';
import AuthForm from '../AuthForm';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks(user?.id);
  const { profile, loading: profileLoading } = useUser(user?.id);

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

  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = tasks.filter(t => !t.completed).length;
  const todayTasks = tasks.filter(t => {
    if (!t.due_date) return false;
    const today = new Date();
    const taskDate = new Date(t.due_date);
    return taskDate.toDateString() === today.toDateString();
  });

  const focusTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <Rocket className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Welcome back{profile?.name ? `, ${profile.name}` : ''}!
        </h2>
        <p className="text-lg text-gray-600">
          Ready to conquer your tasks and boost your productivity?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {tasksLoading ? '...' : completedTasks}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {tasksLoading ? '...' : activeTasks}
              </p>
              <p className="text-sm text-gray-600">Active Tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {tasksLoading ? '...' : todayTasks.length}
              </p>
              <p className="text-sm text-gray-600">Due Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {profileLoading ? '...' : profile?.streak_count || 0}
              </p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Focus Orbit */}
      <div className="bg-white p-8 rounded-xl border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Today's Focus Orbit</h3>
        
        {focusTasks.length > 0 ? (
          <div className="space-y-4">
            {focusTasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
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
                      ? 'bg-red-100 text-red-700' 
                      : task.priority >= 3 
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }
                  `}>
                    Priority {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <Rocket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Your focus tasks will appear here</p>
              <p className="text-sm text-gray-500 mt-2">Add tasks to see your personalized orbit</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;