import { useState, useEffect, useRef } from 'react';
import { VoiceState } from '../types';

export const useVoiceInput = () => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isSupported: false,
    transcript: ''
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setVoiceState(prev => ({ ...prev, isSupported: true }));
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setVoiceState(prev => ({ ...prev, isListening: true }));
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceState(prev => ({ ...prev, transcript }));
      };

      recognition.onend = () => {
        setVoiceState(prev => ({ ...prev, isListening: false }));
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setVoiceState(prev => ({ ...prev, isListening: false }));
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !voiceState.isListening) {
      setVoiceState(prev => ({ ...prev, transcript: '' }));
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && voiceState.isListening) {
      recognitionRef.current.stop();
    }
  };

  const resetTranscript = () => {
    setVoiceState(prev => ({ ...prev, transcript: '' }));
  };

  return {
    ...voiceState,
    startListening,
    stopListening,
    resetTranscript
  };
};