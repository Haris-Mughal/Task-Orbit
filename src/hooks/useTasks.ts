import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Task, NewTask, UpdateTask } from '../lib/database.types';

export function useTasks(userId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: Omit<NewTask, 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...task, user_id: userId! })
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const updateTask = async (id: string, updates: UpdateTask) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => prev.map(task => task.id === id ? data : task));
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { error };
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const result = await updateTask(id, { completed: !task.completed });
    
    // If task was just completed, check for streak increment
    if (!task.completed && result.data?.completed) {
      await checkAndUpdateStreak();
    }
    
    return result;
  };

  const checkAndUpdateStreak = async () => {
    try {
      // Check if user has completed at least one task today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayTasks = tasks.filter(task => {
        const taskDate = new Date(task.created_at);
        return taskDate >= today && taskDate < tomorrow && task.completed;
      });

      if (todayTasks.length > 0) {
        // Update user's last login to today and potentially increment streak
        const { error } = await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', userId!);

        if (error) throw error;
      }
    } catch (err) {
      console.error('Error updating streak:', err);
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    refetch: fetchTasks,
  };
}