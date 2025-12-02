import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, FileText, DollarSign, Target, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Search result types
type SearchCategory = 'stocks' | 'pages' | 'expenses' | 'goals';

interface SearchResult {
    id: string;
    title: string;
    subtitle?: string;
    category: SearchCategory;
    icon: React.ReactNode;
    action: () => void;
}

// Page navigation data
const PAGES = [
    { name: 'Dashboard', path: '/', keywords: ['home', 'overview', 'main'] },
    { name: 'Stock Prediction', path: '/stocks', keywords: ['stocks', 'predict', 'ai', 'market'] },
    { name: 'Expenses', path: '/expenses', keywords: ['spending', 'transactions', 'costs'] },
    { name: 'Budget', path: '/budget', keywords: ['budget', 'planning', 'allocation'] },
    { name: 'Goals', path: '/goals', keywords: ['targets', 'objectives', 'savings'] },
    { name: 'Debts', path: '/debts', keywords: ['loans', 'credit', 'owed'] },
    { name: 'Reports', path: '/reports', keywords: ['analytics', 'charts', 'insights'] },
    { name: 'Profile & Account', path: '/profile', keywords: ['settings', 'account', 'user'] },
];

// Popular stocks
const STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'AMD', name: 'Advanced Micro Devices' },
];

interface SearchBarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Debounced search function
    const performSearch = useCallback((searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const searchResults: SearchResult[] = [];

        // Search stocks
        STOCKS.forEach(stock => {
            if (
                stock.symbol.toLowerCase().includes(query) ||
                stock.name.toLowerCase().includes(query)
            ) {
                searchResults.push({
                    id: `stock-${stock.symbol}`,
                    title: stock.symbol,
                    subtitle: stock.name,
                    category: 'stocks',
                    icon: <TrendingUp className="h-5 w-5 text-cyan-400" />,
                    action: () => {
                        navigate('/stocks');
                        // Could also auto-fill the ticker
                        onClose();
                        saveRecentSearch(searchQuery);
                    },
                });
            }
        });

        // Search pages
        PAGES.forEach(page => {
            if (
                page.name.toLowerCase().includes(query) ||
                page.keywords.some(k => k.includes(query))
            ) {
                searchResults.push({
                    id: `page-${page.path}`,
                    title: page.name,
                    subtitle: 'Navigate to page',
                    category: 'pages',
                    icon: <FileText className="h-5 w-5 text-violet-400" />,
                    action: () => {
                        navigate(page.path);
                        onClose();
                        saveRecentSearch(searchQuery);
                    },
                });
            }
        });

        setResults(searchResults.slice(0, 8)); // Limit to 8 results
        setSelectedIndex(0);
    }, [navigate, onClose]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, performSearch]);

    // Save recent search
    const saveRecentSearch = (search: string) => {
        const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev + 1) % results.length);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (results[selectedIndex]) {
                        results[selectedIndex].action();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, onClose]);

    const getCategoryIcon = (category: SearchCategory) => {
        switch (category) {
            case 'stocks':
                return <TrendingUp className="h-4 w-4" />;
            case 'pages':
                return <FileText className="h-4 w-4" />;
            case 'expenses':
                return <DollarSign className="h-4 w-4" />;
            case 'goals':
                return <Target className="h-4 w-4" />;
        }
    };

    const getCategoryColor = (category: SearchCategory) => {
        switch (category) {
            case 'stocks':
                return 'text-cyan-400 bg-cyan-500/10';
            case 'pages':
                return 'text-violet-400 bg-violet-500/10';
            case 'expenses':
                return 'text-emerald-400 bg-emerald-500/10';
            case 'goals':
                return 'text-amber-400 bg-amber-500/10';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Search Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
                    >
                        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 p-4 border-b border-white/10">
                                <Search className="h-5 w-5 text-white/40 flex-shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search stocks, pages, expenses, goals..."
                                    className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-lg"
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery('')}
                                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <X className="h-5 w-5 text-white/40" />
                                    </button>
                                )}
                                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-white/40 bg-white/5 rounded border border-white/10">
                                    ESC
                                </kbd>
                            </div>

                            {/* Results */}
                            <div className="max-h-96 overflow-y-auto">
                                {results.length > 0 ? (
                                    <div className="p-2">
                                        {results.map((result, index) => (
                                            <motion.button
                                                key={result.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                onClick={result.action}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${index === selectedIndex
                                                        ? 'bg-white/15 border border-white/20'
                                                        : 'hover:bg-white/10 border border-transparent'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg ${getCategoryColor(result.category)}`}>
                                                    {result.icon}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-white font-medium">{result.title}</p>
                                                    {result.subtitle && (
                                                        <p className="text-sm text-white/60">{result.subtitle}</p>
                                                    )}
                                                </div>
                                                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(result.category)}`}>
                                                    <div className="flex items-center gap-1">
                                                        {getCategoryIcon(result.category)}
                                                        <span className="capitalize">{result.category}</span>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                ) : query ? (
                                    <div className="p-8 text-center text-white/60">
                                        <Search className="h-12 w-12 mx-auto mb-3 opacity-40" />
                                        <p>No results found for "{query}"</p>
                                    </div>
                                ) : (
                                    <div className="p-4">
                                        {recentSearches.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 px-2 mb-2">
                                                    <Clock className="h-4 w-4 text-white/40" />
                                                    <span className="text-sm text-white/60">Recent Searches</span>
                                                </div>
                                                <div className="space-y-1">
                                                    {recentSearches.map((search, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setQuery(search)}
                                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white/80"
                                                        >
                                                            {search}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="px-2 text-sm text-white/40">
                                            <p>Try searching for:</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {['AAPL', 'Dashboard', 'Expenses', 'Goals'].map(suggestion => (
                                                    <button
                                                        key={suggestion}
                                                        onClick={() => setQuery(suggestion)}
                                                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/5">
                                <div className="flex items-center gap-4 text-xs text-white/40">
                                    <div className="flex items-center gap-1">
                                        <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10">↑↓</kbd>
                                        <span>Navigate</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10">↵</kbd>
                                        <span>Select</span>
                                    </div>
                                </div>
                                <div className="text-xs text-white/40">
                                    Press <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10">⌘K</kbd> to search
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
