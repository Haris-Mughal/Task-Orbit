import { useState } from 'react';
import { useVoiceAssistant } from './useVoiceAssistant';

export interface MoodTheme {
  primary: string;
  secondary: string;
  background: string;
  accent: string;
  text: string;
}

export function useMoodPersonalization() {
  const [loading, setLoading] = useState(false);
  const { speak } = useVoiceAssistant();

  const getMoodTheme = (mood: string): MoodTheme => {
    switch (mood) {
      case 'happy':
        return {
          primary: 'from-yellow-400 to-orange-500',
          secondary: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
          background: 'bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-pink-900/10',
          accent: 'text-yellow-600 dark:text-yellow-400',
          text: 'text-gray-800 dark:text-gray-200'
        };
      case 'amazing':
        return {
          primary: 'from-pink-400 to-rose-500',
          secondary: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
          background: 'bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-pink-900/10 dark:via-rose-900/10 dark:to-purple-900/10',
          accent: 'text-pink-600 dark:text-pink-400',
          text: 'text-gray-800 dark:text-gray-200'
        };
      case 'neutral':
        return {
          primary: 'from-blue-500 to-indigo-600',
          secondary: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
          background: 'bg-gray-50 dark:bg-gray-900',
          accent: 'text-blue-600 dark:text-blue-400',
          text: 'text-gray-900 dark:text-gray-100'
        };
      case 'sad':
        return {
          primary: 'from-purple-400 to-indigo-500',
          secondary: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20',
          background: 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10',
          accent: 'text-purple-600 dark:text-purple-400',
          text: 'text-gray-700 dark:text-gray-300'
        };
      default:
        return {
          primary: 'from-purple-600 to-indigo-600',
          secondary: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20',
          background: 'bg-gray-50 dark:bg-gray-900',
          accent: 'text-purple-600 dark:text-purple-400',
          text: 'text-gray-900 dark:text-gray-100'
        };
    }
  };

  const generateMoodQuote = async (mood: string): Promise<string> => {
    setLoading(true);
    
    try {
      // Enhanced AI-generated quotes based on mood with voice output
      const quotes = {
        happy: [
          "Your positive energy is lighting up everything around you! Keep shining and spreading those good vibes.",
          "Happiness is your superpower today! Use this amazing energy to tackle your biggest dreams.",
          "You're radiating joy and it's contagious! This is the perfect time to take on new challenges.",
          "Your smile is changing the world! Channel this beautiful energy into your most important goals.",
          "You're absolutely glowing with positivity! Let this happiness fuel your productivity and creativity."
        ],
        amazing: [
          "You're absolutely unstoppable today! This incredible energy you have is pure magic - use it wisely!",
          "What an amazing day to be you! Your enthusiasm is infectious and your potential is limitless.",
          "You're on fire with positivity! This is your moment to shine and achieve something extraordinary.",
          "Your energy is absolutely electric! Harness this incredible feeling to make today legendary.",
          "You're radiating pure awesomeness! This is the perfect time to chase your wildest dreams."
        ],
        neutral: [
          "Steady and balanced - you're in the perfect headspace for consistent progress and thoughtful decisions.",
          "Your calm energy is a strength. Use this balanced state to build solid foundations for your goals.",
          "Being centered is a superpower. Your steady approach will lead to lasting, meaningful progress.",
          "Your balanced mindset is perfect for tackling tasks methodically and building great habits.",
          "Steady wins the race! Your calm, focused energy is exactly what you need for sustainable success."
        ],
        sad: [
          "It's okay to feel this way - you're human and your feelings are valid. Take things one small step at a time.",
          "Gentle days call for gentle progress. Be kind to yourself and celebrate every small victory.",
          "Your sensitivity is a gift, even when it feels heavy. Take care of yourself and trust that this will pass.",
          "Some days are for healing, not hustling. Honor where you are and be patient with yourself.",
          "You're stronger than you know, even in difficult moments. Small steps forward are still progress."
        ]
      };

      const moodQuotes = quotes[mood as keyof typeof quotes] || quotes.neutral;
      const randomQuote = moodQuotes[Math.floor(Math.random() * moodQuotes.length)];
      
      // Speak the quote with appropriate tone
      const rate = mood === 'amazing' ? 1.1 : mood === 'sad' ? 0.9 : 1.0;
      speak(randomQuote, { rate });
      
      return randomQuote;
    } catch (error) {
      console.error('Error generating mood quote:', error);
      const fallback = "Remember, every day is a new opportunity to grow and achieve your goals!";
      speak(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  const generateMoodSuggestion = async (mood: string): Promise<string> => {
    try {
      // AI-generated suggestions for UI themes and productivity approaches with voice
      const suggestions = {
        happy: [
          "Your bright energy calls for an equally vibrant experience! I've optimized your interface with warm, energizing colors and ambitious task suggestions. Perfect time to tackle those challenging projects you've been putting off!",
          "With your positive vibes flowing, I'm highlighting your most impactful tasks and using uplifting colors throughout your workspace. Your enthusiasm is the perfect fuel for big achievements!",
          "Your happiness is contagious! I've brightened your interface and prioritized collaborative tasks. This is an ideal time to help others and take on leadership roles.",
          "Riding high on positive energy! Your interface now features sunny themes and growth-focused suggestions. Channel this joy into your most ambitious goals!"
        ],
        amazing: [
          "You're absolutely incredible today! I've created a premium, inspiring interface with bold colors and stretch goals. This is your moment to aim for the stars!",
          "Your amazing energy deserves an equally spectacular experience! I've enhanced your workspace with dynamic themes and highlighted your most impactful opportunities.",
          "Feeling amazing calls for amazing possibilities! Your interface now showcases premium features and ambitious challenges that match your incredible energy.",
          "You're in peak form! I've optimized everything for maximum impact with inspiring visuals and high-priority goals that align with your extraordinary mood."
        ],
        neutral: [
          "Your balanced state is perfect for steady progress! I've created a clean, focused interface that supports methodical work and consistent habit-building.",
          "Steady and centered - ideal for productivity! Your workspace now features calming themes and organized layouts that support sustained focus and planning.",
          "Your balanced energy calls for a harmonious approach. I've optimized your interface for routine tasks and long-term planning with clean, distraction-free design.",
          "Perfect equilibrium for consistent progress! Your workspace features balanced colors and structured layouts that support steady, sustainable productivity."
        ],
        sad: [
          "I understand you're having a tough day. I've simplified your interface with gentle, calming colors and broken down tasks into smaller, manageable steps. You've got this! 💜",
          "Gentle support mode activated. Your workspace now features soothing themes and minimal distractions, focusing only on essential, bite-sized tasks that won't overwhelm you.",
          "Taking care of you today. I've created a peaceful, supportive environment with soft colors and gentle reminders. Small steps are still progress - be kind to yourself.",
          "Your wellbeing comes first. I've minimized visual clutter and highlighted self-care activities alongside gentle, achievable tasks. You're stronger than you know."
        ]
      };

      const moodSuggestions = suggestions[mood as keyof typeof suggestions] || suggestions.neutral;
      const randomSuggestion = moodSuggestions[Math.floor(Math.random() * moodSuggestions.length)];
      
      // Speak the suggestion with appropriate tone
      const rate = mood === 'amazing' ? 1.1 : mood === 'sad' ? 0.9 : 1.0;
      speak(randomSuggestion, { rate });
      
      return randomSuggestion;
    } catch (error) {
      console.error('Error generating mood suggestion:', error);
      const fallback = "I've personalized your experience to match your current state. Remember, every mood is valid and temporary!";
      speak(fallback);
      return fallback;
    }
  };

  const getTaskDisplayLimit = (mood: string): number => {
    switch (mood) {
      case 'happy':
      case 'amazing':
        return 10; // Show more tasks when feeling good
      case 'neutral':
        return 6; // Standard amount
      case 'sad':
        return 3; // Minimal display to avoid overwhelm
      default:
        return 6;
    }
  };

  const getMoodBasedTaskPriority = (mood: string): 'high' | 'medium' | 'low' => {
    switch (mood) {
      case 'happy':
      case 'amazing':
        return 'high'; // Encourage ambitious tasks
      case 'neutral':
        return 'medium'; // Balanced approach
      case 'sad':
        return 'low'; // Focus on easier, self-care tasks
      default:
        return 'medium';
    }
  };

  return {
    getMoodTheme,
    generateMoodQuote,
    generateMoodSuggestion,
    getTaskDisplayLimit,
    getMoodBasedTaskPriority,
    loading,
  };
}