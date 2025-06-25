import React, { useEffect, useState } from 'react';
import { X, Sparkles, Trophy } from 'lucide-react';
import type { Badge } from '../hooks/useGamification';

interface BadgeNotificationProps {
  badge: Badge;
  onDismiss: (badgeId: string) => void;
  autoHide?: boolean;
  duration?: number;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({ 
  badge, 
  onDismiss, 
  autoHide = true, 
  duration = 10000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, duration]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(badge.id);
    }, 300);
  };

  const getRarityColors = () => {
    switch (badge.rarity) {
      case 'common':
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          border: 'border-gray-300',
          glow: 'shadow-gray-200',
        };
      case 'rare':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          border: 'border-blue-300',
          glow: 'shadow-blue-200',
        };
      case 'epic':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-pink-600',
          border: 'border-purple-300',
          glow: 'shadow-purple-200',
        };
      case 'legendary':
        return {
          bg: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          border: 'border-yellow-300',
          glow: 'shadow-yellow-200',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          border: 'border-gray-300',
          glow: 'shadow-gray-200',
        };
    }
  };

  const colors = getRarityColors();

  return (
    <div
      className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
        transition-all duration-500 ease-out
        ${isVisible && !isLeaving 
          ? 'scale-100 opacity-100' 
          : 'scale-75 opacity-0'
        }
      `}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleDismiss} />
      
      {/* Badge Card */}
      <div className={`
        relative bg-white rounded-2xl shadow-2xl border-4 ${colors.border}
        p-8 max-w-md mx-4 text-center
        ${colors.glow} shadow-2xl
        animate-pulse
      `}>
        {/* Sparkle Effects */}
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" />
        </div>
        <div className="absolute -top-1 -left-2">
          <Sparkles className="w-6 h-6 text-yellow-300 animate-bounce" />
        </div>
        <div className="absolute -bottom-1 -right-1">
          <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className={`${colors.bg} text-white px-4 py-2 rounded-lg mb-6 mx-auto inline-block`}>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wide">
              {badge.rarity} Badge Earned!
            </span>
          </div>
        </div>

        {/* Badge Icon */}
        <div className="text-6xl mb-4 animate-bounce">
          {badge.icon}
        </div>

        {/* Badge Info */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {badge.name}
        </h3>
        <p className="text-gray-600 mb-6">
          {badge.description}
        </p>

        {/* Rarity Badge */}
        <div className={`
          inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
          ${badge.rarity === 'common' ? 'bg-gray-100 text-gray-700' : ''}
          ${badge.rarity === 'rare' ? 'bg-blue-100 text-blue-700' : ''}
          ${badge.rarity === 'epic' ? 'bg-purple-100 text-purple-700' : ''}
          ${badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' : ''}
        `}>
          {badge.rarity}
        </div>

        {/* Celebration Text */}
        <div className="mt-6 text-sm text-gray-500">
          🎉 Keep up the amazing work! 🎉
        </div>
      </div>
    </div>
  );
};

export default BadgeNotification;