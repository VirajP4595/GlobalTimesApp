import React, { useState, useMemo } from 'react';
import { ALL_TIMEZONES } from '../constants';
import type { TimeZone } from '../types';

interface AddTimezoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (timezone: TimeZone) => void;
    displayedTimezones: TimeZone[];
}

const AddTimezoneModal: React.FC<AddTimezoneModalProps> = ({ isOpen, onClose, onAdd, displayedTimezones }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const availableTimezones = useMemo(() => {
        const displayedIanas = new Set(displayedTimezones.map(tz => tz.iana));
        return ALL_TIMEZONES.filter(tz => !displayedIanas.has(tz.iana));
    }, [displayedTimezones]);

    const filteredTimezones = useMemo(() => {
        if (!searchTerm) {
            return availableTimezones;
        }
        const lowercasedFilter = searchTerm.toLowerCase();

        // A simple fuzzy match function that returns a score.
        // Higher score is better. 0 means no match.
        const getFuzzyScore = (text: string, pattern: string): number => {
            let score = 0;
            if (!text) return 0;

            const lowerText = text.toLowerCase();
            let patternIndex = 0;
            let textIndex = 0;
            let consecutiveBonus = 0;

            // Heavily prioritize matches at the start of the string
            if (lowerText.startsWith(pattern)) {
                score += 100;
            } else if (lowerText.includes(pattern)) {
                score += 20; // Lower score for just including the pattern
            }

            // Sequential character matching
            while (patternIndex < pattern.length && textIndex < lowerText.length) {
                if (pattern[patternIndex] === lowerText[textIndex]) {
                    score += 1 + consecutiveBonus;
                    consecutiveBonus++;
                    patternIndex++;
                } else {
                    consecutiveBonus = 0;
                }
                textIndex++;
            }
            
            // If not all characters in pattern are found, it's not a match.
            if (patternIndex !== pattern.length) {
                return 0;
            }
            
            return score;
        };

        return availableTimezones
            .map(tz => {
                const cityScore = getFuzzyScore(tz.city, lowercasedFilter);
                const countryScore = getFuzzyScore(tz.country || '', lowercasedFilter);
                const nameScore = getFuzzyScore(tz.name, lowercasedFilter);
                const ianaScore = getFuzzyScore(tz.iana, lowercasedFilter);
                
                // Prioritize city and country matches
                const totalScore = (cityScore * 2) + (countryScore * 1.5) + nameScore + ianaScore;
                
                return { ...tz, score: totalScore };
            })
            .filter(tz => tz.score > 0)
            .sort((a, b) => b.score - a.score);
    }, [searchTerm, availableTimezones]);


    if (!isOpen) return null;

    const handleAddTimezone = (tz: TimeZone) => {
        onAdd(tz);
        onClose();
        setSearchTerm('');
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-timezone-title"
        >
            <div 
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 id="add-timezone-title" className="text-xl font-bold text-sky-600 dark:text-sky-300">Add a Timezone</h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Search by city, country, or region..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        aria-label="Search for a timezone"
                    />
                </div>

                <ul className="overflow-y-auto flex-grow p-4 pt-0">
                    {filteredTimezones.length > 0 ? filteredTimezones.map(tz => (
                        <li key={tz.iana}>
                            <button 
                                onClick={() => handleAddTimezone(tz)}
                                className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{tz.city}{tz.country ? `, ${tz.country}` : ''}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{tz.name} ({tz.iana.split('/')[1].replace('_', ' ')})</p>
                            </button>
                        </li>
                    )) : (
                        <li className="text-center p-4 text-slate-500">No timezones found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AddTimezoneModal;
