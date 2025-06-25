import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import TaskInput from '../TaskInput';
import TaskList from '../TaskList';
import AuthForm from '../AuthForm';

const Tasks: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    tasks, 
    loading: tasksLoading, 
    createTask, 
    toggleTask, 
    deleteTask 
  } = useTasks(user?.id);

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        <p className="text-gray-600">Manage your tasks with AI-powered organization</p>
      </div>

      {/* Task Input */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <TaskInput 
          onTaskCreated={handleTaskCreated}
          loading={tasksLoading}
        />
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {tasks.filter(t => !t.completed).length}
          </div>
          <div className="text-sm text-gray-600">Active Tasks</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">
            {tasks.filter(t => t.completed).length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {tasks.length}
          </div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Tasks</h3>
        <TaskList
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          loading={tasksLoading}
        />
      </div>
    </div>
  );
};

export default Tasks;