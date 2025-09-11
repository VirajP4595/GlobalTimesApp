import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { TimeZone } from './types';
import ClockCard from './components/ClockCard';
import AddTimezoneModal from './components/AddTimezoneModal';
import ThemeToggle from './components/ThemeToggle';
import { INITIAL_TIMEZONES } from './constants';

const LOCAL_STORAGE_KEY = 'global-time-sync-timezones';

const WorldMapBackground: React.FC = () => (
    <div className="absolute inset-0 z-0 opacity-10 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 2000 1000" preserveAspectRatio="xMidYMid slice">
            <path d="M1000,500 m -500,0 a 500,500 0 1,0 1000,0 a 500,500 0 1,0 -1000,0" fill="none" stroke="#2dd4bf" strokeWidth="1" />
            <path d="M1000,500 m -400,0 a 400,400 0 1,0 800,0 a 400,400 0 1,0 -800,0" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="5,5" />
            <path d="M1000,500 m -300,0 a 300,300 0 1,0 600,0 a 300,300 0 1,0 -600,0" fill="none" stroke="#60a5fa" strokeWidth="0.5" />
        </svg>
    </div>
);

const App: React.FC = () => {
  const [baseTime, setBaseTime] = useState(new Date());
  const [timeOffsetInMinutes, setTimeOffsetInMinutes] = useState(0);

  const isLive = timeOffsetInMinutes === 0;

  const displayedTime = useMemo(() => {
    if (isLive) {
      return baseTime;
    }
    const newTime = new Date(baseTime.getTime());
    newTime.setMinutes(newTime.getMinutes() + timeOffsetInMinutes);
    return newTime;
  }, [baseTime, timeOffsetInMinutes, isLive]);

  const [displayedTimezones, setDisplayedTimezones] = useState<TimeZone[]>(() => {
    try {
      const savedTimezones = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTimezones) {
        return JSON.parse(savedTimezones);
      }
    } catch (error) {
      console.error("Could not parse timezones from localStorage", error);
    }
    return INITIAL_TIMEZONES;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedIana, setDraggedIana] = useState<string | null>(null);

  useEffect(() => {
    const timerId = setInterval(() => {
      setBaseTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(displayedTimezones));
    } catch (error) {
      console.error("Could not save timezones to localStorage", error);
    }
  }, [displayedTimezones]);

  const handleRemoveTimezone = useCallback((iana: string) => {
    setDisplayedTimezones(prev => prev.filter(tz => tz.iana !== iana));
  }, []);

  const handleAddTimezone = useCallback((timezone: TimeZone) => {
    if (!displayedTimezones.some(tz => tz.iana === timezone.iana)) {
      setDisplayedTimezones(prev => [...prev, timezone]);
    }
  }, [displayedTimezones]);

  const handleUpdateLabel = useCallback((iana: string, newLabel: string) => {
    setDisplayedTimezones(prev => prev.map(tz => tz.iana === iana ? { ...tz, customLabel: newLabel } : tz));
  }, []);

  const handleSetSpecificTime = useCallback((dateStr: string, timeStr: string, iana: string) => {
    // To get the correct offset (accounting for DST), we format a date in the target timezone and extract the GMT offset part.
    const tempDateForOffset = new Date(`${dateStr}T${timeStr}:00`);
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: iana,
        timeZoneName: 'longOffset',
    });
    const parts = formatter.formatToParts(tempDateForOffset);
    const gmtString = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT+0'; // e.g., "GMT-7"

    // Convert GMT string to a valid ISO offset format (e.g., "-07:00")
    const offsetMatch = gmtString.match(/GMT([+-])(\d+)(?::(\d+))?/);
    let isoStringWithOffset = `${dateStr}T${timeStr}:00`;

    if (offsetMatch) {
        const sign = offsetMatch[1];
        const hours = offsetMatch[2].padStart(2, '0');
        const minutes = (offsetMatch[3] || '00').padStart(2, '0');
        isoStringWithOffset += `${sign}${hours}:${minutes}`;
    } else {
        isoStringWithOffset += 'Z'; // Fallback to UTC
    }
    
    try {
        const targetUtcDate = new Date(isoStringWithOffset);
        if (isNaN(targetUtcDate.getTime())) {
            console.error("Failed to parse date from constructed string:", isoStringWithOffset);
            return;
        }
        
        const now = Date.now(); // Current live UTC milliseconds
        const newOffsetInMinutes = Math.round((targetUtcDate.getTime() - now) / 60000);
        setTimeOffsetInMinutes(newOffsetInMinutes);

    } catch (e) {
        console.error("Error creating date:", e);
    }
  }, []);
  
  const handleDragStart = (iana: string) => {
    setDraggedIana(iana);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedIana) return;

    const targetElement = (e.target as HTMLElement).closest('[data-iana]');
    const targetIana = targetElement?.getAttribute('data-iana');

    if (!targetIana || targetIana === draggedIana) {
      setDraggedIana(null);
      return;
    }
    
    setDisplayedTimezones(prev => {
        const draggedIndex = prev.findIndex(tz => tz.iana === draggedIana);
        const targetIndex = prev.findIndex(tz => tz.iana === targetIana);
        
        if (draggedIndex === -1 || targetIndex === -1 || targetIndex === 0) return prev;

        const newTimezones = [...prev];
        const [draggedItem] = newTimezones.splice(draggedIndex, 1);
        newTimezones.splice(targetIndex, 0, draggedItem);
        return newTimezones;
    });

    setDraggedIana(null);
  };

  const handleDragEnd = () => {
    setDraggedIana(null);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:to-gray-900 text-slate-800 dark:text-white overflow-hidden">
      <WorldMapBackground />
      <main className="relative z-10 flex flex-col items-center min-h-screen p-4 sm:p-6 lg:p-8 pb-12">
        <header className="text-center my-12 w-full flex justify-between items-center">
          <div className="flex-1"></div>
          <div className="flex-1 flex flex-col items-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-sky-500 dark:text-sky-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0 0 12 13.5c-2.998 0-5.74-1.1-7.843-2.918" />
              </svg>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-500 dark:from-sky-400 dark:to-teal-300">
                Global Time Sync
              </h1>
            </div>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">Your worldwide time companion, synchronized from IST.</p>
          </div>
          <div className="flex-1 flex justify-end items-center gap-4">
             {!isLive && (
                <button 
                    onClick={() => setTimeOffsetInMinutes(0)}
                    className="px-4 py-2 rounded-lg font-semibold text-sm transition-all bg-sky-500 text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-slate-900 focus:ring-sky-500"
                    aria-label="Reset to live time"
                 >
                    Reset to Live
                 </button>
            )}
            <ThemeToggle />
          </div>
        </header>
        
        <div 
          className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        >
          {displayedTimezones.map((tz: TimeZone, index) => (
            <ClockCard 
                key={tz.iana} 
                time={displayedTime} 
                timezone={tz} 
                timeOffsetInMinutes={timeOffsetInMinutes}
                onRemove={handleRemoveTimezone}
                onUpdateLabel={handleUpdateLabel}
                onSetSpecificTime={handleSetSpecificTime}
                isRemovable={index !== 0}
                isDraggable={index !== 0}
                onDragStart={handleDragStart}
                isDragging={draggedIana === tz.iana}
            />
          ))}
          <button 
                onClick={() => setIsModalOpen(true)}
                className="flex flex-col items-center justify-center bg-gray-200/30 dark:bg-slate-800/30 backdrop-blur-sm border-2 border-dashed border-slate-400 dark:border-slate-600 rounded-2xl p-6 text-slate-500 dark:text-slate-400 hover:bg-gray-300/50 dark:hover:bg-slate-700/50 hover:border-sky-500 hover:text-sky-500 dark:hover:text-sky-300 transition-all duration-300 ease-in-out min-h-[280px]"
                aria-label="Add new timezone clock"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold text-lg">Add Timezone</span>
            </button>
        </div>

      </main>
      <AddTimezoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTimezone}
        displayedTimezones={displayedTimezones}
      />
    </div>
  );
};

export default App;