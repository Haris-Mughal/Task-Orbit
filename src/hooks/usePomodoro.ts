import { useState, useEffect, useRef } from 'react';

export type TimerMode = 'focus' | 'break' | 'idle';
export type TimerState = 'running' | 'paused' | 'stopped';

export interface PomodoroSession {
  mode: TimerMode;
  duration: number; // in seconds
  timeRemaining: number;
  state: TimerState;
  sessionsCompleted: number;
  totalFocusTime: number; // in seconds
}

export function usePomodoro() {
  const [session, setSession] = useState<PomodoroSession>({
    mode: 'idle',
    duration: 25 * 60, // 25 minutes in seconds
    timeRemaining: 25 * 60,
    state: 'stopped',
    sessionsCompleted: 0,
    totalFocusTime: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Timer tick effect
  useEffect(() => {
    if (session.state === 'running' && session.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setSession(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          
          if (newTimeRemaining <= 0) {
            // Session completed
            if (prev.mode === 'focus') {
              // Focus session completed, start break
              return {
                ...prev,
                mode: 'break',
                duration: 5 * 60, // 5 minutes break
                timeRemaining: 5 * 60,
                state: 'running',
                sessionsCompleted: prev.sessionsCompleted + 1,
                totalFocusTime: prev.totalFocusTime + (25 * 60),
              };
            } else {
              // Break completed, return to idle
              return {
                ...prev,
                mode: 'idle',
                duration: 25 * 60,
                timeRemaining: 25 * 60,
                state: 'stopped',
              };
            }
          }
          
          return {
            ...prev,
            timeRemaining: newTimeRemaining,
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [session.state, session.timeRemaining]);

  const startTimer = () => {
    if (session.mode === 'idle') {
      // Start new focus session
      setSession(prev => ({
        ...prev,
        mode: 'focus',
        duration: 25 * 60,
        timeRemaining: 25 * 60,
        state: 'running',
      }));
    } else {
      // Resume current session
      setSession(prev => ({
        ...prev,
        state: 'running',
      }));
    }
    startTimeRef.current = Date.now();
  };

  const pauseTimer = () => {
    setSession(prev => ({
      ...prev,
      state: 'paused',
    }));
  };

  const resetTimer = () => {
    setSession({
      mode: 'idle',
      duration: 25 * 60,
      timeRemaining: 25 * 60,
      state: 'stopped',
      sessionsCompleted: session.sessionsCompleted,
      totalFocusTime: session.totalFocusTime,
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    return ((session.duration - session.timeRemaining) / session.duration) * 100;
  };

  return {
    session,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
    getProgress,
  };
}