import { useState } from 'react';

export interface MotivationalMessage {
  id: string;
  message: string;
  type: 'focus-complete' | 'break-complete';
  timestamp: number;
}

export function useMotivation() {
  const [messages, setMessages] = useState<MotivationalMessage[]>([]);

  const generatePepTalk = async (sessionType: 'focus' | 'break'): Promise<string> => {
    try {
      // In a real implementation, this would call OpenAI's API
      // For now, we'll use a curated set of motivational messages
      const focusCompleteMessages = [
        "🎉 Amazing focus! You just conquered 25 minutes of pure productivity. Your future self is already thanking you!",
        "💪 That's what I call laser focus! Take a well-deserved break and come back even stronger.",
        "🚀 You're on fire! Another Pomodoro session crushed. Keep this momentum going!",
        "⭐ Incredible dedication! You've just proven that you can achieve anything with focused effort.",
        "🎯 Bulls-eye! Another 25 minutes of excellence in the books. You're building unstoppable habits!",
        "🏆 Champion mindset right there! Your consistency is the key to extraordinary results.",
        "✨ Pure magic happens when you focus like that! Ready to tackle the next challenge?",
        "🔥 You're absolutely crushing it! That focused energy is your superpower.",
        "💎 Diamond-level focus! You're transforming your goals into reality, one session at a time.",
        "🌟 Stellar performance! You've just added another victory to your success story."
      ];

      const breakCompleteMessages = [
        "⚡ Recharged and ready! Your mind is sharp and your energy is renewed. Let's make magic happen!",
        "🌱 That break was exactly what you needed! Now you're primed for another round of excellence.",
        "🔋 Battery at 100%! Your refreshed mind is ready to tackle any challenge that comes your way.",
        "🌈 Perfect timing! You're balanced, focused, and ready to turn your next session into pure gold.",
        "🎪 Break time well spent! Your creativity and focus are now perfectly aligned for success.",
        "🚀 Lift-off ready! That break has prepared you for another incredible journey of productivity.",
        "💫 Refreshed and revitalized! Your next focus session is going to be absolutely phenomenal.",
        "🎨 Your mind is now a blank canvas, ready to create something amazing in the next session!",
        "⚡ Lightning-charged and ready to strike! Your next 25 minutes are going to be legendary.",
        "🌊 Riding the wave of perfect balance! Dive into your next session with renewed vigor."
      ];

      const messages = sessionType === 'focus' ? focusCompleteMessages : breakCompleteMessages;
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      return randomMessage;
    } catch (error) {
      console.error('Error generating pep talk:', error);
      return sessionType === 'focus' 
        ? "🎉 Great job completing your focus session! Take a well-deserved break."
        : "⚡ Break complete! You're refreshed and ready for another productive session.";
    }
  };

  const showPepTalk = async (sessionType: 'focus' | 'break') => {
    const message = await generatePepTalk(sessionType);
    const pepTalk: MotivationalMessage = {
      id: Date.now().toString(),
      message,
      type: sessionType === 'focus' ? 'focus-complete' : 'break-complete',
      timestamp: Date.now(),
    };

    setMessages(prev => [pepTalk, ...prev.slice(0, 4)]); // Keep only last 5 messages
    return pepTalk;
  };

  const dismissMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const clearAllMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    showPepTalk,
    dismissMessage,
    clearAllMessages,
  };
}