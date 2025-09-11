import React, { useState, useEffect } from 'react';
import type { TimeZone } from './types';
import ClockCard from './components/ClockCard';
import AddTimezoneModal from './components/AddTimezoneModal';
import { INITIAL_TIMEZONES } from './constants';

const WorldMapBackground: React.FC = () => (
    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 2000 1000" preserveAspectRatio="xMidYMid slice">
            <path d="M1000,500 m -500,0 a 500,500 0 1,0 1000,0 a 500,500 0 1,0 -1000,0" fill="none" stroke="#2dd4bf" strokeWidth="1" />
            <path d="M1000,500 m -400,0 a 400,400 0 1,0 800,0 a 400,400 0 1,0 -800,0" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="5,5" />
            <path d="M1000,500 m -300,0 a 300,300 0 1,0 600,0 a 300,300 0 1,0 -600,0" fill="none" stroke="#60a5fa" strokeWidth="0.5" />
        </svg>
    </div>
);


const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [displayedTimezones, setDisplayedTimezones] = useState<TimeZone[]>(INITIAL_TIMEZONES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const handleRemoveTimezone = (iana: string) => {
    setDisplayedTimezones(prev => prev.filter(tz => tz.iana !== iana));
  };

  const handleAddTimezone = (timezone: TimeZone) => {
    if (!displayedTimezones.some(tz => tz.iana === timezone.iana)) {
      setDisplayedTimezones(prev => [...prev, timezone]);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 text-white overflow-hidden">
      <WorldMapBackground />
      <main className="relative z-10 flex flex-col items-center min-h-screen p-4 sm:p-6 lg:p-8">
        <header className="text-center my-12 w-full">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-sky-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0 0 12 13.5c-2.998 0-5.74-1.1-7.843-2.918" />
            </svg>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">
              Global Time Sync
            </h1>
          </div>
          <p className="mt-4 text-lg text-slate-400">Your worldwide time companion, synchronized from IST.</p>
        </header>
        
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {displayedTimezones.map((tz: TimeZone, index) => (
            <ClockCard 
                key={tz.iana} 
                time={currentTime} 
                timezone={tz} 
                onRemove={handleRemoveTimezone}
                isRemovable={index !== 0}
            />
          ))}
          <button 
                onClick={() => setIsModalOpen(true)}
                className="flex flex-col items-center justify-center bg-slate-800/30 backdrop-blur-sm border-2 border-dashed border-slate-600 rounded-2xl p-6 text-slate-400 hover:bg-slate-700/50 hover:border-sky-500 hover:text-sky-300 transition-all duration-300 ease-in-out min-h-[280px]"
                aria-label="Add new timezone clock"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold text-lg">Add Timezone</span>
            </button>
        </div>

        <footer className="mt-12 text-center text-slate-500">
            <p>All times are live and updated every second.</p>
        </footer>
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