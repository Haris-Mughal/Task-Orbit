import React from 'react';
import { Trophy, Star, Target, Zap, Crown, Flame, Award } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useGamification } from '../../hooks/useGamification';
import AuthForm from '../AuthForm';

const Achievements: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    achievements, 
    earnedBadges, 
    availableBadges, 
    getBadgeRarityColor 
  } = useGamification(user?.id);

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

  const getProgressPercentage = (progress: number, maxProgress: number) => {
    return Math.min((progress / maxProgress) * 100, 100);
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="w-4 h-4" />;
      case 'rare': return <Target className="w-4 h-4" />;
      case 'epic': return <Crown className="w-4 h-4" />;
      case 'legendary': return <Flame className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Achievements</h2>
        <p className="text-gray-600 dark:text-gray-400">Track your progress and unlock amazing badges</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-8 rounded-2xl border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">Your Journey</h3>
          <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">
            {earnedBadges.length} / {earnedBadges.length + availableBadges.length} badges earned
          </div>
        </div>
        
        <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-500 h-3 rounded-full transition-all duration-1000 ease-out" 
            style={{ 
              width: `${(earnedBadges.length / (earnedBadges.length + availableBadges.length)) * 100}%` 
            }}
          ></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{earnedBadges.length}</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Badges Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {earnedBadges.filter(b => b.rarity === 'legendary' || b.rarity === 'epic').length}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Rare+ Badges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {achievements.reduce((acc, a) => acc + a.progress, 0)}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Total Progress</div>
          </div>
        </div>
      </div>

      {/* Current Progress */}
      {achievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Current Progress</h3>
          {achievements.map((achievement) => (
            <div key={achievement.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{achievement.description}</p>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getProgressPercentage(achievement.progress, achievement.maxProgress)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {achievement.progress} / {achievement.maxProgress}
                    </div>
                  </div>
                </div>
                
                {achievement.badge && (
                  <div className="ml-4 text-center">
                    <div className="text-3xl mb-1">{achievement.badge.icon}</div>
                    <div className={`
                      inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                      ${getBadgeRarityColor(achievement.badge.rarity)}
                    `}>
                      {getRarityIcon(achievement.badge.rarity)}
                      <span>{achievement.badge.rarity}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Earned Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-green-200 dark:border-green-700 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{badge.icon}</div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{badge.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{badge.description}</p>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`
                      inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${getBadgeRarityColor(badge.rarity)}
                    `}>
                      {getRarityIcon(badge.rarity)}
                      <span>{badge.rarity}</span>
                    </div>
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                      ✓ Earned
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Badges */}
      {availableBadges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Available Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableBadges.slice(0, 12).map((badge) => (
              <div
                key={badge.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 opacity-75 hover:opacity-100"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3 grayscale">{badge.icon}</div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{badge.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{badge.description}</p>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`
                      inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${getBadgeRarityColor(badge.rarity)}
                    `}>
                      {getRarityIcon(badge.rarity)}
                      <span>{badge.rarity}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {badge.category === 'streak' ? `${badge.requirement} day streak` : `${badge.requirement} tasks`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {earnedBadges.length === 0 && availableBadges.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No badges yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Complete tasks and build streaks to earn your first badges!</p>
        </div>
      )}
    </div>
  );
};

export default Achievements;