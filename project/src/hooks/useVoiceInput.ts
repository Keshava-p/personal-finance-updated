import { useState, useCallback } from 'react';

export interface VoiceInputResult {
  amount: number | null;
  category: string;
  description: string;
}

type SpeechRecognitionConstructor = typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;

interface UseVoiceInputOptions {
  onParsed?: (data: VoiceInputResult) => void;
  language?: string;
}

export function useVoiceInput({ onParsed, language = 'en-US' }: UseVoiceInputOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const processVoiceInput = useCallback((text: string): VoiceInputResult => {
    const amountMatch = text.match(/\d+(\.\d{1,2})?/);
    const amount = amountMatch ? parseFloat(amountMatch[0]) : null;

    const categories = ['food', 'transport', 'entertainment', 'utilities', 'shopping'];
    const category = categories.find((cat) => text.toLowerCase().includes(cat)) || '';

    const description = text.replace(/\d+(\.\d{1,2})?/, '').trim();

    return { amount, category, description };
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window.SpeechRecognition ||
      window.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;

    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      const parsed = processVoiceInput(spokenText);
      onParsed?.(parsed);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [language, onParsed, processVoiceInput]);

  return { isListening, transcript, startListening };
}
