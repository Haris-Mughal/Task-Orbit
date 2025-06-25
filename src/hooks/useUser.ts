import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as UserProfile, UpdateUser } from '../lib/database.types';

export function useUser(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId!)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: UpdateUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId!)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const updateStreak = async (increment: boolean = true) => {
    if (!profile) return;
    
    const newCount = increment ? profile.streak_count + 1 : 0;
    return updateProfile({ streak_count: newCount });
  };

  const addBadge = async (badge: string) => {
    if (!profile || profile.badges.includes(badge)) return;
    
    const newBadges = [...profile.badges, badge];
    return updateProfile({ badges: newBadges });
  };

  const updateMood = async (mood: string) => {
    return updateProfile({ mood });
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updateStreak,
    addBadge,
    updateMood,
    refetch: fetchProfile,
  };
}