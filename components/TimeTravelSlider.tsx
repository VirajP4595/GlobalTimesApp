import React from 'react';

interface TimeTravelSliderProps {
    offsetInMinutes: number;
    setOffsetInMinutes: (offset: number) => void;
}

const TimeTravelSlider: React.FC<TimeTravelSliderProps> = ({ offsetInMinutes, setOffsetInMinutes }) => {

    const formatOffset = (minutes: number): string => {
        if (minutes === 0) return "Live";
        const sign = minutes > 0 ? '+' : '-';
        const absMinutes = Math.abs(minutes);
        const hours = Math.floor(absMinutes / 60);
        const mins = absMinutes % 60;
        
        let output = sign;
        if (hours > 0) output += `${hours}h`;
        if (mins > 0) output += ` ${mins}m`;

        return output.trim();
    };

    const isLive = offsetInMinutes === 0;
    
    return (
        <footer 
            className="fixed bottom-0 left-0 right-0 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 p-4 transition-all duration-300"
        >
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
                <div className="flex-grow flex items-center gap-4">
                    <label htmlFor="time-slider" className="text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Time Travel</label>
                    <input
                        id="time-slider"
                        type="range"
                        min={-1440} // -24 hours
                        max={1440}  // +24 hours
                        step={15}   // 15-minute increments
                        value={offsetInMinutes}
                        onChange={(e) => setOffsetInMinutes(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        aria-label="Time travel slider"
                    />
                </div>
                <div className="w-24 text-center">
                    <span className="text-lg font-mono font-bold text-sky-600 dark:text-sky-300">
                        {formatOffset(offsetInMinutes)}
                    </span>
                </div>
                 <button 
                    onClick={() => setOffsetInMinutes(0)}
                    disabled={isLive}
                    className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors bg-sky-500 text-white hover:bg-sky-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                    aria-label="Reset to live time"
                 >
                    Reset to Live
                 </button>
            </div>
        </footer>
    );
};

export default TimeTravelSlider;
