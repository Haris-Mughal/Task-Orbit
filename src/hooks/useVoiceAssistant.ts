import { useState, useCallback } from 'react';

export interface VoiceAssistantOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export function useVoiceAssistant(options: VoiceAssistantOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(
    'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  );
  const [transcript, setTranscript] = useState('');

  const speak = useCallback((text: string, options: { rate?: number; pitch?: number; volume?: number } = {}) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      
      // Use a more natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && (voice.name.includes('Google') || voice.name.includes('Microsoft'))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
      return utterance;
    }
    return null;
  }, []);

  const startListening = useCallback((
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: any) => void
  ) => {
    if (!isSupported) {
      onError?.('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = options.continuous || false;
    recognition.interimResults = options.interimResults || true;
    recognition.lang = options.language || 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      speak("I'm listening...", { rate: 1.2 });
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const fullTranscript = finalTranscript || interimTranscript;
      setTranscript(fullTranscript);
      onResult(fullTranscript, !!finalTranscript);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      onError?.(event.error);
      speak("Sorry, I couldn't understand that. Please try again.", { rate: 1.1 });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    return recognition;
  }, [isSupported, options, speak]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    // The recognition will stop automatically
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    speak,
    startListening,
    stopListening,
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}