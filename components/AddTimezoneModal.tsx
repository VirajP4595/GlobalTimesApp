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
        return availableTimezones.filter(tz =>
            tz.city.toLowerCase().includes(lowercasedFilter) ||
            tz.name.toLowerCase().includes(lowercasedFilter) ||
            tz.iana.toLowerCase().includes(lowercasedFilter)
        );
    }, [searchTerm, availableTimezones]);


    if (!isOpen) return null;

    const handleAddTimezone = (tz: TimeZone) => {
        onAdd(tz);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-timezone-title"
        >
            <div 
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h2 id="add-timezone-title" className="text-xl font-bold text-sky-300">Add a Timezone</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Search by city, name, or region..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        aria-label="Search for a timezone"
                    />
                </div>

                <ul className="overflow-y-auto flex-grow p-4 pt-0">
                    {filteredTimezones.length > 0 ? filteredTimezones.map(tz => (
                        <li key={tz.iana}>
                            <button 
                                onClick={() => handleAddTimezone(tz)}
                                className="w-full text-left p-3 rounded-lg hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <p className="font-semibold text-slate-100">{tz.city}</p>
                                <p className="text-sm text-slate-400">{tz.name} ({tz.iana.split('/')[1].replace('_', ' ')})</p>
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