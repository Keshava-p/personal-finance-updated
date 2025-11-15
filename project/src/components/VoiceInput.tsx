import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useProfile } from '../hooks/useProfile';
import { Button } from './ui/button';

interface VoiceInputProps {
  onVoiceInput: (data: { amount: number | null; category: string; description: string }) => void;
}

export function VoiceInput({ onVoiceInput }: VoiceInputProps) {
  const { profile } = useProfile();
  const recognitionLanguage = profile.languagePreference === 'hi' ? 'hi-IN' : 'en-US';
  const { isListening, startListening } = useVoiceInput({
    onParsed: onVoiceInput,
    language: recognitionLanguage,
  });

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={startListening}
      className={`relative ${isListening ? 'bg-red-50' : ''}`}
    >
      {isListening ? (
        <MicOff className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      {isListening && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </Button>
  );
}
