import React, { useEffect, useState } from 'react';
import { X, Sparkles, Coffee, Target } from 'lucide-react';
import type { MotivationalMessage } from '../hooks/useMotivation';

interface MotivationalToastProps {
  message: MotivationalMessage;
  onDismiss: (id: string) => void;
  autoHide?: boolean;
  duration?: number;
}

const MotivationalToast: React.FC<MotivationalToastProps> = ({ 
  message, 
  onDismiss, 
  autoHide = true, 
  duration = 8000 
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
      onDismiss(message.id);
    }, 300);
  };

  const getIcon = () => {
    switch (message.type) {
      case 'focus-complete':
        return <Target className="w-6 h-6 text-purple-600" />;
      case 'break-complete':
        return <Coffee className="w-6 h-6 text-green-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-indigo-600" />;
    }
  };

  const getColors = () => {
    switch (message.type) {
      case 'focus-complete':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-indigo-600',
          border: 'border-purple-200',
          iconBg: 'bg-purple-100',
        };
      case 'break-complete':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-indigo-500 to-purple-600',
          border: 'border-indigo-200',
          iconBg: 'bg-indigo-100',
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-md w-full mx-4 sm:mx-0
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      <div className={`
        bg-white rounded-xl shadow-2xl border-2 ${colors.border}
        overflow-hidden backdrop-blur-sm
      `}>
        {/* Gradient Header */}
        <div className={`${colors.bg} px-4 py-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                {getIcon()}
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  {message.type === 'focus-complete' ? 'Focus Session Complete!' : 'Break Complete!'}
                </h3>
                <p className="text-white/80 text-xs">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition-colors duration-200 p-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Content */}
        <div className="p-4">
          <p className="text-gray-800 text-sm leading-relaxed font-medium">
            {message.message}
          </p>
        </div>

        {/* Progress Bar */}
        {autoHide && (
          <div className="h-1 bg-gray-100">
            <div 
              className={`h-full ${colors.bg} transition-all duration-linear`}
              style={{
                animation: `shrink ${duration}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default MotivationalToast;