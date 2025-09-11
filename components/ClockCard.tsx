import React, { useMemo, useState, useRef, useEffect } from 'react';
import type { TimeZone } from '../types';

interface ClockCardProps {
  time: Date;
  timezone: TimeZone;
  timeOffsetInMinutes: number;
  onRemove: (iana: string) => void;
  onUpdateLabel: (iana: string, label: string) => void;
  onSetSpecificTime: (date: string, time: string, iana: string) => void;
  isRemovable: boolean;
  isDraggable: boolean;
  onDragStart: (iana: string) => void;
  isDragging: boolean;
}

const SunIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
);

const MoonIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
);

interface TimeEditorProps {
    initialDate: string;
    initialTime: string;
    onCancel: () => void;
    onSet: (date: string, time: string) => void;
}

const TimeEditor: React.FC<TimeEditorProps> = ({ initialDate, initialTime, onCancel, onSet }) => {
    const [date, setDate] = useState(initialDate);
    const [time, setTime] = useState(initialTime);

    const handleSet = () => {
        if(date && time) {
            onSet(date, time);
        }
    }

    return (
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20 rounded-2xl flex flex-col items-center justify-center p-4">
            <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">Set Custom Time</h3>
            <div className="flex flex-col gap-3 w-full">
                <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 rounded-md bg-white/20 dark:bg-black/20 border border-slate-400/50 dark:border-slate-600/50 text-center text-sm"
                    aria-label="Date"
                />
                <input 
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 rounded-md bg-white/20 dark:bg-black/20 border border-slate-400/50 dark:border-slate-600/50 text-center text-sm"
                    aria-label="Time"
                />
            </div>
            <div className="flex gap-2 mt-4">
                <button onClick={handleSet} className="px-4 py-2 text-sm bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-semibold">Set Time</button>
                <button onClick={onCancel} className="px-4 py-2 text-sm bg-slate-500/50 text-white rounded-lg hover:bg-slate-500/80 transition-colors font-semibold">Cancel</button>
            </div>
        </div>
    );
}


const ClockCard: React.FC<ClockCardProps> = ({ time, timezone, timeOffsetInMinutes, onRemove, onUpdateLabel, onSetSpecificTime, isRemovable, isDraggable, onDragStart, isDragging }) => {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [labelText, setLabelText] = useState(timezone.customLabel || timezone.city);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLabelText(timezone.customLabel || timezone.city);
  }, [timezone.customLabel, timezone.city]);

  useEffect(() => {
    if (isEditingLabel && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
    }
  }, [isEditingLabel]);
  
  const { 
    formattedTime, 
    formattedDate, 
    dayPeriod, 
    timeDifference, 
    timezoneCode, 
    isDay,
    inputDateValue,
    inputTimeValue
} = useMemo(() => {
    const timeOptions: Intl.DateTimeFormatOptions = { timeZone: timezone.iana, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const timeFormatter = new Intl.DateTimeFormat('en-US', timeOptions);
    const timeParts = timeFormatter.formatToParts(time);

    const formattedTimeValue = `${timeParts.find(p => p.type === 'hour')?.value}:${timeParts.find(p => p.type === 'minute')?.value}:${timeParts.find(p => p.type === 'second')?.value}`;
    const dayPeriodValue = timeParts.find(p => p.type === 'dayPeriod')?.value || '';
    
    const dateFormatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone.iana, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const tzCodeFormatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone.iana, timeZoneName: 'short' });
    const tzCode = tzCodeFormatter.formatToParts(time).find(part => part.type === 'timeZoneName')?.value || '';

    const dateInTimezone = new Date(time.toLocaleString('en-US', { timeZone: timezone.iana }));
    const dateInUTC = new Date(time.toLocaleString('en-US', { timeZone: 'UTC' }));
    const offsetInMinutes = (dateInTimezone.getTime() - dateInUTC.getTime()) / 60000;
    const istOffset = 330;
    const offsetDiffMinutes = offsetInMinutes - istOffset;

    let diffText = 'IST';
    if (offsetDiffMinutes !== 0) {
      const sign = offsetDiffMinutes > 0 ? '+' : '';
      const hours = Math.floor(Math.abs(offsetDiffMinutes) / 60);
      const minutes = Math.abs(offsetDiffMinutes) % 60;
      let diffString = `${sign}${hours}`;
      if (minutes > 0) diffString += `:${minutes.toString().padStart(2, '0')}`;
      diffText = `${diffString}h from IST`;
    }
    
    const hourFormatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone.iana, hour: 'numeric', hourCycle: 'h23' });
    const currentHour = parseInt(hourFormatter.format(time), 10);
    const isDayTime = currentHour >= 6 && currentHour < 18;

    const dateForInput = new Date(time.toLocaleString('en-US', { timeZone: timezone.iana }));
    const year = dateForInput.getFullYear();
    const month = (dateForInput.getMonth() + 1).toString().padStart(2, '0');
    const day = dateForInput.getDate().toString().padStart(2, '0');
    const inputDate = `${year}-${month}-${day}`;

    const hours = dateForInput.getHours().toString().padStart(2, '0');
    const inputMinutes = dateForInput.getMinutes().toString().padStart(2, '0');
    const inputTime = `${hours}:${inputMinutes}`;

    return { 
        formattedTime: formattedTimeValue, 
        formattedDate: dateFormatter.format(time), 
        dayPeriod: dayPeriodValue, 
        timeDifference: diffText, 
        timezoneCode: tzCode, 
        isDay: isDayTime,
        inputDateValue: inputDate,
        inputTimeValue: inputTime
    };
  }, [time, timezone.iana]);

  const handleLabelSave = () => {
    setIsEditingLabel(false);
    if (labelText.trim() === '') {
        setLabelText(timezone.city); // Reset if empty
        onUpdateLabel(timezone.iana, timezone.city);
    } else {
        onUpdateLabel(timezone.iana, labelText.trim());
    }
  };

  const backgroundClass = isDay
    ? 'bg-gradient-to-br from-sky-100 to-white dark:from-sky-900/50 dark:to-slate-800/50'
    : 'bg-gradient-to-br from-indigo-200 to-slate-100 dark:from-indigo-900/50 dark:to-slate-900/50';

  const combinedClasses = `
    relative backdrop-blur-sm rounded-2xl p-6 shadow-lg dark:shadow-2xl dark:shadow-black/20 
    transform hover:scale-105 transition-all duration-300 ease-in-out 
    flex flex-col h-full border border-black/5 dark:border-white/10
    ${backgroundClass} 
    ${isDragging ? 'opacity-40 ring-2 ring-sky-500' : ''}
    ${isDraggable ? 'cursor-grab' : 'cursor-default'}
  `;

  return (
    <div 
        className={combinedClasses}
        draggable={isDraggable}
        onDragStart={() => isDraggable && onDragStart(timezone.iana)}
        data-iana={timezone.iana}
    >
        {isEditingTime && (
            <TimeEditor
                initialDate={inputDateValue}
                initialTime={inputTimeValue}
                onCancel={() => setIsEditingTime(false)}
                onSet={(date, time) => {
                    onSetSpecificTime(date, time, timezone.iana);
                    setIsEditingTime(false);
                }}
            />
        )}
        <div className="flex-grow">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 group flex-1 min-w-0">
                    {isEditingLabel ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={labelText}
                            onChange={(e) => setLabelText(e.target.value)}
                            onBlur={handleLabelSave}
                            onKeyDown={(e) => e.key === 'Enter' && handleLabelSave()}
                            className="text-xl font-bold bg-transparent border-b-2 border-sky-500 text-slate-900 dark:text-sky-300 outline-none w-full"
                        />
                    ) : (
                        <h2 className="text-xl font-bold text-slate-900 dark:text-sky-300 truncate" title={timezone.customLabel || timezone.city}>{timezone.customLabel || timezone.city}</h2>
                    )}
                    {isRemovable && !isEditingLabel && (
                         <button onClick={() => setIsEditingLabel(true)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-sky-500 flex-shrink-0" aria-label="Edit label">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {isDay ? <SunIcon /> : <MoonIcon />}
                    <button onClick={() => setIsEditingTime(true)} className="text-slate-500 hover:text-sky-500 transition-colors p-1" aria-label="Set custom time">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                    </button>
                    {isRemovable && (
                        <button
                            onClick={() => onRemove(timezone.iana)}
                            className="text-slate-500 hover:text-red-500 transition-colors p-1"
                            aria-label={`Remove ${timezone.city} clock`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                    )}
                </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{timezone.name}</p>
            
            <div className="my-4 text-center flex items-baseline justify-center">
                <div>
                    <p className="text-5xl lg:text-6xl xl:text-5xl font-mono font-bold text-slate-800 dark:text-slate-100 tracking-wider">
                        {formattedTime}
                    </p>
                    <span className="text-2xl font-mono font-semibold text-slate-600 dark:text-slate-300 ml-2">{dayPeriod}</span>
                </div>
            </div>
        </div>
        
        <div className="text-center border-t border-slate-300 dark:border-slate-700 pt-4 mt-auto">
             <div>
                <p className="text-md text-slate-700 dark:text-slate-300">{formattedDate}</p>
                <p className="text-xs text-slate-500 mt-1">
                    {timeDifference}
                    {timeOffsetInMinutes !== 0 && <span className="ml-2 font-bold text-sky-500">(Offset)</span>}
                </p>
             </div>
        </div>
    </div>
  );
};

export default ClockCard;