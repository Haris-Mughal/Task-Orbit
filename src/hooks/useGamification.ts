import { useState, useEffect } from 'react';
import { useUser } from './useUser';
import { useTasks } from './useTasks';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  category: 'streak' | 'tasks' | 'focus' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  badge?: Badge;
}

export function useGamification(userId?: string) {
  const { profile, updateProfile, updateStreak, addBadge } = useUser(userId);
  const { tasks } = useTasks(userId);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  // Define all available badges
  const allBadges: Badge[] = [
    // Streak Badges
    {
      id: 'streak-3',
      name: 'Momentum Builder',
      description: 'Complete tasks for 3 consecutive days',
      icon: '🔥',
      requirement: 3,
      category: 'streak',
      rarity: 'common'
    },
    {
      id: 'streak-5',
      name: 'Consistency Champion',
      description: 'Complete tasks for 5 consecutive days',
      icon: '⚡',
      requirement: 5,
      category: 'streak',
      rarity: 'common'
    },
    {
      id: 'streak-7',
      name: 'Weekly Warrior',
      description: 'Complete tasks for 7 consecutive days',
      icon: '🏆',
      requirement: 7,
      category: 'streak',
      rarity: 'rare'
    },
    {
      id: 'streak-14',
      name: 'Fortnight Force',
      description: 'Complete tasks for 14 consecutive days',
      icon: '💎',
      requirement: 14,
      category: 'streak',
      rarity: 'rare'
    },
    {
      id: 'streak-21',
      name: 'Habit Architect',
      description: 'Complete tasks for 21 consecutive days',
      icon: '🌟',
      requirement: 21,
      category: 'streak',
      rarity: 'epic'
    },
    {
      id: 'streak-30',
      name: 'Monthly Master',
      description: 'Complete tasks for 30 consecutive days',
      icon: '👑',
      requirement: 30,
      category: 'streak',
      rarity: 'epic'
    },
    {
      id: 'streak-50',
      name: 'Unstoppable Force',
      description: 'Complete tasks for 50 consecutive days',
      icon: '🚀',
      requirement: 50,
      category: 'streak',
      rarity: 'legendary'
    },
    {
      id: 'streak-100',
      name: 'Centurion Legend',
      description: 'Complete tasks for 100 consecutive days',
      icon: '🌈',
      requirement: 100,
      category: 'streak',
      rarity: 'legendary'
    },
    // Task Count Badges
    {
      id: 'tasks-10',
      name: 'Getting Started',
      description: 'Complete 10 tasks',
      icon: '✅',
      requirement: 10,
      category: 'tasks',
      rarity: 'common'
    },
    {
      id: 'tasks-25',
      name: 'Task Tackler',
      description: 'Complete 25 tasks',
      icon: '📋',
      requirement: 25,
      category: 'tasks',
      rarity: 'common'
    },
    {
      id: 'tasks-50',
      name: 'Productivity Pro',
      description: 'Complete 50 tasks',
      icon: '⚡',
      requirement: 50,
      category: 'tasks',
      rarity: 'rare'
    },
    {
      id: 'tasks-100',
      name: 'Task Terminator',
      description: 'Complete 100 tasks',
      icon: '🎯',
      requirement: 100,
      category: 'tasks',
      rarity: 'epic'
    },
    {
      id: 'tasks-250',
      name: 'Completion Conqueror',
      description: 'Complete 250 tasks',
      icon: '🏅',
      requirement: 250,
      category: 'tasks',
      rarity: 'legendary'
    }
  ];

  // Check for new badges when profile or tasks change
  useEffect(() => {
    if (profile && tasks.length > 0) {
      checkForNewBadges();
      updateAchievements();
    }
  }, [profile?.streak_count, tasks.length, profile?.badges]);

  const checkForNewBadges = async () => {
    if (!profile) return;

    const currentBadges = profile.badges || [];
    const completedTasks = tasks.filter(t => t.completed).length;
    const currentStreak = profile.streak_count || 0;

    const newlyEarnedBadges: Badge[] = [];

    // Check streak badges
    const streakBadges = allBadges.filter(badge => 
      badge.category === 'streak' && 
      currentStreak >= badge.requirement &&
      !currentBadges.includes(badge.id)
    );

    // Check task count badges
    const taskBadges = allBadges.filter(badge => 
      badge.category === 'tasks' && 
      completedTasks >= badge.requirement &&
      !currentBadges.includes(badge.id)
    );

    newlyEarnedBadges.push(...streakBadges, ...taskBadges);

    // Add new badges to profile
    for (const badge of newlyEarnedBadges) {
      await addBadge(badge.id);
      badge.earnedAt = new Date().toISOString();
    }

    if (newlyEarnedBadges.length > 0) {
      setNewBadges(prev => [...newlyEarnedBadges, ...prev]);
    }
  };

  const updateAchievements = () => {
    if (!profile) return;

    const completedTasks = tasks.filter(t => t.completed).length;
    const currentStreak = profile.streak_count || 0;

    const updatedAchievements: Achievement[] = [
      // Streak achievements
      {
        id: 'streak-progress',
        title: 'Daily Consistency',
        description: 'Build your daily task completion streak',
        progress: currentStreak,
        maxProgress: getNextStreakMilestone(currentStreak),
        completed: false,
        badge: allBadges.find(b => b.category === 'streak' && b.requirement === getNextStreakMilestone(currentStreak))
      },
      // Task count achievements
      {
        id: 'task-progress',
        title: 'Task Completion',
        description: 'Complete more tasks to unlock badges',
        progress: completedTasks,
        maxProgress: getNextTaskMilestone(completedTasks),
        completed: false,
        badge: allBadges.find(b => b.category === 'tasks' && b.requirement === getNextTaskMilestone(completedTasks))
      }
    ];

    setAchievements(updatedAchievements);
  };

  const getNextStreakMilestone = (currentStreak: number): number => {
    const milestones = [3, 5, 7, 14, 21, 30, 50, 100];
    return milestones.find(m => m > currentStreak) || 100;
  };

  const getNextTaskMilestone = (completedTasks: number): number => {
    const milestones = [10, 25, 50, 100, 250];
    return milestones.find(m => m > completedTasks) || 250;
  };

  const incrementStreak = async () => {
    if (!profile) return;
    
    const today = new Date().toDateString();
    const lastLogin = profile.last_login ? new Date(profile.last_login).toDateString() : null;
    
    // Only increment if we haven't already incremented today
    if (lastLogin !== today) {
      await updateStreak(true);
      await updateProfile({ last_login: new Date().toISOString() });
    }
  };

  const resetStreak = async () => {
    await updateStreak(false);
  };

  const dismissNewBadge = (badgeId: string) => {
    setNewBadges(prev => prev.filter(b => b.id !== badgeId));
  };

  const getEarnedBadges = (): Badge[] => {
    if (!profile?.badges) return [];
    
    return allBadges
      .filter(badge => profile.badges.includes(badge.id))
      .map(badge => ({
        ...badge,
        earnedAt: new Date().toISOString() // In a real app, this would be stored
      }));
  };

  const getAvailableBadges = (): Badge[] => {
    if (!profile?.badges) return allBadges;
    
    return allBadges.filter(badge => !profile.badges.includes(badge.id));
  };

  const getBadgeRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return {
    achievements,
    newBadges,
    earnedBadges: getEarnedBadges(),
    availableBadges: getAvailableBadges(),
    incrementStreak,
    resetStreak,
    dismissNewBadge,
    getBadgeRarityColor,
    checkForNewBadges,
  };
}