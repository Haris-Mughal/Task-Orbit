import React from 'react';
import { CheckCircle2, Circle, Calendar, Tag, Trash2, Clock } from 'lucide-react';
import type { Task } from '../lib/database.types';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  loading?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggleTask, 
  onDeleteTask, 
  loading = false 
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 5: return 'text-red-600 bg-red-50 border-red-200';
      case 4: return 'text-orange-600 bg-orange-50 border-orange-200';
      case 3: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 2: return 'text-blue-600 bg-blue-50 border-blue-200';
      case 1: return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 5: return 'Urgent';
      case 4: return 'High';
      case 3: return 'Medium';
      case 2: return 'Low';
      case 1: return 'Minimal';
      default: return 'Medium';
    }
  };

  const isOverdue = (dateString: string | null) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-600">Create your first task using natural language above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`
            bg-white p-4 rounded-lg border transition-all duration-200 hover:shadow-md
            ${task.completed 
              ? 'border-green-200 bg-green-50' 
              : isOverdue(task.due_date) 
                ? 'border-red-200 bg-red-50' 
                : 'border-gray-200'
            }
          `}
        >
          <div className="flex items-start space-x-3">
            <button
              onClick={() => onToggleTask(task.id)}
              className={`
                mt-0.5 transition-colors duration-200
                ${task.completed 
                  ? 'text-green-600 hover:text-green-700' 
                  : 'text-gray-400 hover:text-purple-600'
                }
              `}
            >
              {task.completed ? (
                <CheckCircle2 size={20} />
              ) : (
                <Circle size={20} />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h3 className={`
                font-medium text-gray-900 mb-1
                ${task.completed ? 'line-through text-gray-500' : ''}
              `}>
                {task.title}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                {task.due_date && (
                  <div className={`
                    flex items-center space-x-1
                    ${isOverdue(task.due_date) && !task.completed 
                      ? 'text-red-600' 
                      : 'text-gray-600'
                    }
                  `}>
                    <Calendar size={14} />
                    <span>{formatDate(task.due_date)}</span>
                    {formatTime(task.due_date) && (
                      <>
                        <Clock size={14} />
                        <span>{formatTime(task.due_date)}</span>
                      </>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-1 text-gray-600">
                  <Tag size={14} />
                  <span>{task.category}</span>
                </div>

                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium border
                  ${getPriorityColor(task.priority)}
                `}>
                  {getPriorityLabel(task.priority)}
                </span>
              </div>
            </div>

            <button
              onClick={() => onDeleteTask(task.id)}
              className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;