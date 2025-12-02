import { useState } from 'react';
import { Mic, MicOff, X, Check } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useCurrency } from '../hooks/useCurrency';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface CommandConfirmation {
  command: string;
  action: () => void | Promise<void>;
  description: string;
}

export function VoiceAssistant() {
  const { profile, updateProfile, updateSalary } = useProfile();
  const { currency } = useCurrency();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [confirmation, setConfirmation] = useState<CommandConfirmation | null>(null);
  const [transcript, setTranscript] = useState('');

  const languageMap: Record<string, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    kn: 'kn-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    ml: 'ml-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
  };

  const parseCommand = (text: string): CommandConfirmation | null => {
    const lowerText = text.toLowerCase().trim();
    console.log('[VoiceAssistant] parseCommand input:', text);

    // Show insights
    if (/\b(show|display|open|go to|take me to)\b.*\b(insight|insights)\b/.test(lowerText) || lowerText.includes('show insights')) {
      return {
        command: text,
        description: 'Navigate to insights panel',
        action: () => navigate('/'),
      };
    }

    // Navigate to expenses (flexible)
    if (/\b(go to|open|show|take me to|navigate to)\b.*\bexpenses?\b/.test(lowerText) ||
      /\bexpenses?\b/.test(lowerText) && !/\b(add|create|new)\b/.test(lowerText) // avoid conflict with add expense
    ) {
      return {
        command: text,
        description: 'Navigate to expenses page',
        action: () => navigate('/expenses'),
      };
    }

    // Add expense — accepts multi-word categories like "grocery shopping"
    // Examples matched: "add expense 200 for groceries", "add expense of 150 grocery shopping"
    const expenseMatch = lowerText.match(/\badd\s+expense(?:\s+of)?\s+(\d+(?:\.\d+)?)(?:\s*(?:for|in|on)\s+([\w\s]+))?/);
    if (expenseMatch) {
      const amount = parseFloat(expenseMatch[1]);
      const rawCategory = expenseMatch[2] ? expenseMatch[2].trim() : 'uncategorized';
      const category = rawCategory.replace(/\s+/g, ' ');
      return {
        command: text,
        description: `Add expense: ${amount} ${currency} for ${category}`,
        action: () => navigate('/expenses'),
      };
    }

    // Add debt: more robust parsing with optional words and multi-word names
    // Examples:
    // "add debt car loan 200000 5000"
    // "add debt called car loan 200000 per month 5000"
    const debtMatch = lowerText.match(/\badd\s+debt(?:\s+called)?\s+(?:['"])?([a-z\s-]+?)(?:['"])?\s+(\d+(?:\.\d+)?)(?:\s*(?:monthly|per month|\/month)?)?\s+(\d+(?:\.\d+)?)/);
    if (debtMatch) {
      const name = debtMatch[1].trim();
      const principal = parseFloat(debtMatch[2]);
      const monthly = parseFloat(debtMatch[3]);
      return {
        command: text,
        description: `Add debt: ${name}, Principal: ${principal}, Monthly: ${monthly}`,
        action: async () => {
          try {
            await axios.post(`${API_BASE}/debts`, {
              name,
              principal,
              monthlyPayment: monthly,
              apr: 10,
              currency,
            }, {
              headers: { 'x-user-id': profile.email || 'test@example.com' },
            });
            navigate('/debts');
          } catch (error) {
            console.error('Error adding debt:', error);
          }
        },
      };
    }

    // Show goals
    if (/\b(show|display|open|go to|take me to)\b.*\bgoals?\b/.test(lowerText) || lowerText.includes('show goals')) {
      return {
        command: text,
        description: 'Navigate to goals page',
        action: () => navigate('/goals'),
      };
    }

    // Set salary - allow commas and various phrasing
    const salaryMatch = lowerText.match(/\bset\s+salary(?:\s+to)?\s+([\d,]+(?:\.\d+)?)/);
    if (salaryMatch) {
      const amount = parseFloat(salaryMatch[1].replace(/,/g, ''));
      return {
        command: text,
        description: `Update salary to ${amount} ${currency}`,
        action: async () => {
          try {
            await axios.post(`${API_BASE}/profile/salary`, {
              monthlySalary: amount,
            }, {
              headers: { 'x-user-id': profile.email || 'test@example.com' },
            });
            updateSalary(amount);
          } catch (error) {
            console.error('Error updating salary:', error);
          }
        },
      };
    }

    // Change currency
    const currencyMatch = lowerText.match(/\bchange\s+currency(?:\s+to)?\s+([A-Za-z]{2,4})\b/);
    if (currencyMatch) {
      const newCurrency = currencyMatch[1].toUpperCase();
      const supported = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
      if (supported.includes(newCurrency)) {
        return {
          command: text,
          description: `Change currency to ${newCurrency}`,
          action: async () => {
            try {
              await axios.post(`${API_BASE}/profile/preferences`, {
                currencyPreference: newCurrency,
              }, {
                headers: { 'x-user-id': profile.email || 'test@example.com' },
              });
              updateProfile({ currencyPreference: newCurrency });
            } catch (error) {
              console.error('Error updating currency:', error);
            }
          },
        };
      }
    }

    // Change language
    const langMatch = lowerText.match(/\bchange\s+language(?:\s+to)?\s+([a-z]{2})\b/);
    if (langMatch) {
      const langCode = langMatch[1].toLowerCase();
      const supported = ['en', 'hi', 'kn', 'ta', 'te', 'ml', 'mr', 'bn', 'gu'];
      if (supported.includes(langCode)) {
        return {
          command: text,
          description: `Change language to ${langCode}`,
          action: async () => {
            try {
              await axios.post(`${API_BASE}/profile/preferences`, {
                languagePreference: langCode,
              }, {
                headers: { 'x-user-id': profile.email || 'test@example.com' },
              });
              updateProfile({ languagePreference: langCode });
              window.location.reload();
            } catch (error) {
              console.error('Error updating language:', error);
            }
          },
        };
      }
    }

    // Generic "navigate to X" support for common pages
    if (/\b(go to|open|show|take me to|navigate to)\b.*\b(debts?|goals?|expenses?|insights?|profile|settings?)\b/.test(lowerText)) {
      if (/\bdebts?\b/.test(lowerText)) return { command: text, description: 'Navigate to debts', action: () => navigate('/debts') };
      if (/\bgoals?\b/.test(lowerText)) return { command: text, description: 'Navigate to goals', action: () => navigate('/goals') };
      if (/\bprofile\b/.test(lowerText)) return { command: text, description: 'Navigate to profile', action: () => navigate('/profile') };
      if (/\bsettings?\b/.test(lowerText)) return { command: text, description: 'Navigate to settings', action: () => navigate('/settings') };
    }

    return null;
  };

  const handleVoiceCommand = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setTranscript('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser');
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = languageMap[profile.languagePreference] || 'en-US';

    // Debug handlers so you can inspect lifecycle in console
    recognition.onstart = () => {
      console.log('[VoiceAssistant] recognition started');
    };
    recognition.onerror = (err: any) => {
      console.error('[VoiceAssistant] recognition error', err);
      setIsListening(false);
    };
    recognition.onend = () => {
      console.log('[VoiceAssistant] recognition ended');
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      console.log('[VoiceAssistant] raw result event:', event.results);
      const text = event.results?.[0]?.[0]?.transcript ?? '';
      setTranscript(text);
      setIsListening(false);

      const command = parseCommand(text);
      if (command) {
        setConfirmation(command);
      } else {
        alert(`Command not recognized: "${text}". Try: "show insights", "set salary to 50000", "change currency to USD", "go to expenses", "add expense 200 for groceries"`);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('[VoiceAssistant] recognition.start() failed', e);
      setIsListening(false);
    }
  };

  const handleConfirm = () => {
    if (confirmation) {
      // run action (may be async)
      try {
        const result = confirmation.action();
        // swallow promise rejections if any (we handle inside actions)
        if (result && typeof (result as Promise<any>).then === 'function') {
          (result as Promise<any>).catch(err => console.error('Action error:', err));
        }
      } catch (err) {
        console.error('Error executing action:', err);
      }
      setConfirmation(null);
      setTranscript('');
    }
  };

  const handleCancel = () => {
    setConfirmation(null);
    setTranscript('');
  };

  return (
    <>
      {/* Floating Mic Button */}
      <motion.button
        onClick={handleVoiceCommand}
        className="fixed bottom-8 right-8 z-50 p-5 rounded-full shadow-2xl transition-all"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          background: isListening
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
          boxShadow: isListening
            ? '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.4)'
            : '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
        }}
        aria-label="Voice Assistant"
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <MicOff className="h-6 w-6 text-white" />
            </motion.div>
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </AnimatePresence>

        {/* Pulse Ring Animation */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/50"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Transcript Bubble */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-8 z-50 p-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl max-w-sm"
        >
          <p className="text-white text-sm">{transcript}</p>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Confirm Voice Command</h3>
              <p className="text-sm text-white/70 mb-2">
                <strong>I heard:</strong> "{confirmation.command}"
              </p>
              <p className="text-sm text-white/80 mb-6">
                <strong>Action:</strong> {confirmation.description}
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Check className="h-4 w-4" />
                  Confirm
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-white/10 text-white rounded-xl font-semibold flex items-center justify-center gap-2 border border-white/20"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
