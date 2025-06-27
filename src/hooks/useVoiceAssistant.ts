import { useState, useCallback, useEffect } from 'react';

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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Load and select the best female voice
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Priority order for female voices (best quality first)
      const femaleVoicePreferences = [
        // Google voices (highest quality)
        'Google UK English Female',
        'Google US English Female',
        'Google Australian English Female',
        
        // Microsoft voices (good quality)
        'Microsoft Zira Desktop',
        'Microsoft Hazel Desktop',
        'Microsoft Eva Desktop',
        'Microsoft Aria Online',
        'Microsoft Jenny Online',
        
        // Apple voices (Mac/iOS)
        'Samantha',
        'Victoria',
        'Allison',
        'Ava',
        'Susan',
        'Fiona',
        'Moira',
        'Tessa',
        
        // System voices with female indicators
        'Female',
        'Woman',
      ];

      // Find the best available female voice
      let bestVoice = null;
      
      for (const preference of femaleVoicePreferences) {
        bestVoice = availableVoices.find(voice => 
          voice.name.includes(preference) && voice.lang.includes('en')
        );
        if (bestVoice) break;
      }

      // Fallback: find any female voice by checking common female indicators
      if (!bestVoice) {
        bestVoice = availableVoices.find(voice => 
          voice.lang.includes('en') && (
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('woman') ||
            voice.name.toLowerCase().includes('zira') ||
            voice.name.toLowerCase().includes('hazel') ||
            voice.name.toLowerCase().includes('eva') ||
            voice.name.toLowerCase().includes('aria') ||
            voice.name.toLowerCase().includes('jenny') ||
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('victoria') ||
            voice.name.toLowerCase().includes('allison') ||
            voice.name.toLowerCase().includes('ava') ||
            voice.name.toLowerCase().includes('susan') ||
            voice.name.toLowerCase().includes('fiona') ||
            voice.name.toLowerCase().includes('moira') ||
            voice.name.toLowerCase().includes('tessa')
          )
        );
      }

      // Final fallback: any English voice (browser will usually default to female)
      if (!bestVoice) {
        bestVoice = availableVoices.find(voice => voice.lang.includes('en'));
      }

      setSelectedVoice(bestVoice);
      
      if (bestVoice) {
        console.log('Selected voice:', bestVoice.name, bestVoice.lang);
      }
    };

    // Load voices immediately if available
    loadVoices();
    
    // Also load when voices change (some browsers load them asynchronously)
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string, options: { rate?: number; pitch?: number; volume?: number } = {}) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Enhanced voice settings for more natural female speech
      utterance.rate = options.rate || 0.95; // Slightly slower for clarity
      utterance.pitch = options.pitch || 1.1; // Slightly higher pitch for feminine tone
      utterance.volume = options.volume || 0.9;
      
      // Use the selected female voice
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Add some personality to the speech
      utterance.onstart = () => {
        console.log('🎤 Speaking:', text.substring(0, 50) + '...');
      };
      
      utterance.onend = () => {
        console.log('✅ Speech completed');
      };
      
      utterance.onerror = (event) => {
        console.error('❌ Speech error:', event.error);
      };
      
      window.speechSynthesis.speak(utterance);
      return utterance;
    }
    return null;
  }, [selectedVoice]);

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
      speak("I'm listening! Please tell me about your task.", { rate: 1.0, pitch: 1.2 });
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
      
      const errorMessages = {
        'no-speech': "I didn't hear anything. Could you please try speaking again?",
        'audio-capture': "I'm having trouble accessing your microphone. Please check your settings.",
        'not-allowed': "I need microphone permission to help you. Please allow access and try again.",
        'network': "I'm having connection issues. Please check your internet and try again.",
        'aborted': "Speech recognition was interrupted. Let's try again!",
        'default': "I had trouble understanding that. Could you please try again?"
      };
      
      const message = errorMessages[event.error as keyof typeof errorMessages] || errorMessages.default;
      speak(message, { rate: 0.9, pitch: 1.1 });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    return recognition;
  }, [isSupported, options, speak]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    speak("Got it! Let me process that for you.", { rate: 1.0, pitch: 1.1 });
  }, [speak]);

  // Function to get available voice options for user selection
  const getVoiceOptions = useCallback(() => {
    return voices
      .filter(voice => voice.lang.includes('en'))
      .map(voice => ({
        name: voice.name,
        lang: voice.lang,
        isDefault: voice.default,
        isFemale: voice.name.toLowerCase().includes('female') || 
                  voice.name.toLowerCase().includes('woman') ||
                  ['zira', 'hazel', 'eva', 'aria', 'jenny', 'samantha', 'victoria', 'allison', 'ava', 'susan', 'fiona', 'moira', 'tessa'].some(name => 
                    voice.name.toLowerCase().includes(name)
                  )
      }))
      .sort((a, b) => {
        // Sort female voices first, then by quality indicators
        if (a.isFemale && !b.isFemale) return -1;
        if (!a.isFemale && b.isFemale) return 1;
        if (a.name.includes('Google') && !b.name.includes('Google')) return -1;
        if (!a.name.includes('Google') && b.name.includes('Google')) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [voices]);

  // Function to manually select a voice
  const selectVoice = useCallback((voiceName: string) => {
    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      setSelectedVoice(voice);
      speak("Voice updated! How do I sound now?", { rate: 0.95, pitch: 1.1 });
    }
  }, [voices, speak]);

  return {
    isListening,
    isSupported,
    transcript,
    speak,
    startListening,
    stopListening,
    selectedVoice,
    getVoiceOptions,
    selectVoice,
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}