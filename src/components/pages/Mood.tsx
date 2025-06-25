import React, { useState, useEffect } from 'react';
import { Smile, Meh, Frown, Heart, Sun, Cloud, Sparkles, Coffee } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import { useMoodPersonalization } from '../../hooks/useMoodPersonalization';
import AuthForm from '../AuthForm';

const Mood: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, updateMood, loading: profileLoading } = useUser(user?.id);
  const { generateMoodQuote, generateMoodSuggestion } = useMoodPersonalization();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [moodQuote, setMoodQuote] = useState<string>('');
  const [moodSuggestion, setMoodSuggestion] = useState<string>('');

  const moods = [
    { 
      id: 'happy', 
      label: 'Happy', 
      icon: Smile, 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      description: 'Feeling great and energized!'
    },
    { 
      id: 'neutral', 
      label: 'Neutral', 
      icon: Meh, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Balanced and steady'
    },
    { 
      id: 'sad', 
      label: 'Low', 
      icon: Frown, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Need some gentle support'
    },
    { 
      id: 'amazing', 
      label: 'Amazing', 
      icon: Heart, 
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      description: 'On top of the world!'
    },
  ];

  useEffect(() => {
    if (profile?.mood) {
      setSelectedMood(profile.mood);
    }
  }, [profile?.mood]);

  useEffect(() => {
    if (selectedMood) {
      loadMoodContent();
    }
  }, [selectedMood]);

  const loadMoodContent = async () => {
    if (!selectedMood) return;
    
    try {
      const [quote, suggestion] = await Promise.all([
        generateMoodQuote(selectedMood),
        generateMoodSuggestion(selectedMood)
      ]);
      
      setMoodQuote(quote);
      setMoodSuggestion(suggestion);
    } catch (error) {
      console.error('Error loading mood content:', error);
    }
  };

  const handleMoodSelect = async (moodId: string) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    setSelectedMood(moodId);
    
    try {
      await updateMood(moodId);
    } catch (error) {
      console.error('Error updating mood:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getCurrentMoodData = () => {
    return moods.find(mood => mood.id === selectedMood);
  };

  const getMoodInsights = () => {
    const insights = {
      happy: {
        title: "Riding High! 🌟",
        message: "Your positive energy is contagious! This is the perfect time to tackle challenging tasks and spread good vibes.",
        tips: ["Take on ambitious projects", "Help others with their goals", "Celebrate your wins", "Share your enthusiasm"]
      },
      amazing: {
        title: "Absolutely Incredible! ✨",
        message: "You're in your peak state! Channel this amazing energy into your most important goals.",
        tips: ["Focus on your biggest priorities", "Set new ambitious goals", "Inspire others around you", "Document this feeling"]
      },
      neutral: {
        title: "Steady and Balanced 🎯",
        message: "You're in a great headspace for consistent progress. Perfect for methodical work and planning.",
        tips: ["Focus on routine tasks", "Plan your week ahead", "Maintain steady progress", "Build good habits"]
      },
      sad: {
        title: "Gentle Support Mode 💜",
        message: "It's okay to feel this way. Let's focus on small, manageable steps and self-care.",
        tips: ["Start with tiny tasks", "Practice self-compassion", "Take breaks when needed", "Reach out to friends"]
      }
    };
    
    return insights[selectedMood as keyof typeof insights] || insights.neutral;
  };

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const currentMood = getCurrentMoodData();
  const insights = getMoodInsights();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">How are you feeling today?</h2>
        <p className="text-gray-600">Your mood helps us personalize your experience</p>
      </div>

      {/* Mood Selection */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moods.map((mood) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.id;
            
            return (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                disabled={isUpdating}
                className={`
                  flex flex-col items-center space-y-3 p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105
                  ${isSelected 
                    ? `${mood.borderColor} ${mood.bgColor} shadow-lg scale-105` 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                  ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                `}
              >
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                  ${isSelected ? mood.bgColor : 'bg-gray-100'}
                `}>
                  <Icon size={32} className={isSelected ? mood.color : 'text-gray-400'} />
                </div>
                <div className="text-center">
                  <span className={`font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {mood.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{mood.description}</p>
                </div>
                {isSelected && (
                  <div className="flex items-center space-x-1 text-xs font-medium text-green-600">
                    <Sparkles size={12} />
                    <span>Selected</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Mood Display */}
      {selectedMood && currentMood && (
        <div className={`${currentMood.bgColor} p-8 rounded-2xl border-2 ${currentMood.borderColor}`}>
          <div className="text-center mb-6">
            <div className={`w-20 h-20 ${currentMood.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <currentMood.icon size={40} className={currentMood.color} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{insights.title}</h3>
            <p className="text-gray-700 text-lg">{insights.message}</p>
          </div>

          {/* Mood Quote */}
          {moodQuote && (
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl mb-6 border border-white/50">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personalized Message</h4>
                  <p className="text-gray-700 italic leading-relaxed">"{moodQuote}"</p>
                </div>
              </div>
            </div>
          )}

          {/* Productivity Tips */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/50">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Coffee className="w-5 h-5" />
              <span>Productivity Tips for Your Mood</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insights.tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className={`w-2 h-2 ${currentMood.color.replace('text-', 'bg-')} rounded-full mt-2 flex-shrink-0`}></div>
                  <span className="text-gray-700 text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestion */}
          {moodSuggestion && (
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl mt-6 border border-white/50">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Recommendation</h4>
                  <p className="text-gray-700 leading-relaxed">{moodSuggestion}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mood History Insights */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Sun className="w-5 h-5 text-yellow-500" />
          <span>Mood Insights</span>
        </h3>
        
        {selectedMood ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Current Mood</span>
              <div className="flex items-center space-x-2">
                {currentMood && <currentMood.icon size={20} className={currentMood.color} />}
                <span className="font-medium text-gray-900">{currentMood?.label}</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Your mood affects how TaskOrbit presents information and suggestions to you.</p>
              <p className="mt-2">
                <strong>Happy/Amazing:</strong> Bright themes, ambitious suggestions<br/>
                <strong>Neutral:</strong> Balanced approach, steady progress focus<br/>
                <strong>Low:</strong> Gentle support, minimal overwhelm, self-care focus
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Select your mood to see personalized insights</p>
              <p className="text-sm text-gray-500 mt-2">Your mood helps us tailor your experience</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mood;