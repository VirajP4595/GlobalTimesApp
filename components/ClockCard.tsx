import React, { useMemo } from 'react';
import type { TimeZone } from '../types';

interface ClockCardProps {
  time: Date;
  timezone: TimeZone;
  onRemove: (iana: string) => void;
  isRemovable: boolean;
}

const ClockCard: React.FC<ClockCardProps> = ({ time, timezone, onRemove, isRemovable }) => {
  const { formattedTime, formattedDate, dayPeriod, timeDifference, timezoneCode } = useMemo(() => {
    const timeOptions: Intl.DateTimeFormatOptions = {
      timeZone: timezone.iana,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    const timeFormatter = new Intl.DateTimeFormat('en-US', timeOptions);
    const timeParts = timeFormatter.formatToParts(time);

    const formattedTimeValue = `${timeParts.find(p => p.type === 'hour')?.value}:${timeParts.find(p => p.type === 'minute')?.value}:${timeParts.find(p => p.type === 'second')?.value}`;
    const dayPeriodValue = timeParts.find(p => p.type === 'dayPeriod')?.value || '';
    
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone.iana,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const tzCodeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone.iana,
        timeZoneName: 'short',
    });
    const tzCode = tzCodeFormatter.formatToParts(time).find(part => part.type === 'timeZoneName')?.value || '';

    // Calculate offset from IST (UTC+5:30 / +330 minutes)
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
      if (minutes > 0) {
        diffString += `:${minutes.toString().padStart(2, '0')}`;
      }
      diffText = `${diffString}h from IST`;
    }

    return {
      formattedTime: formattedTimeValue,
      formattedDate: dateFormatter.format(time),
      dayPeriod: dayPeriodValue,
      timeDifference: diffText,
      timezoneCode: tzCode
    };
  }, [time, timezone.iana]);

  return (
    <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl shadow-black/20 transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col h-full">
        {isRemovable && (
            <button
                onClick={() => onRemove(timezone.iana)}
                className="absolute top-3 right-3 text-slate-500 hover:text-red-500 transition-colors z-20"
                aria-label={`Remove ${timezone.city} clock`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        )}
        <div className="flex-grow">
            <div className="flex justify-between items-baseline">
                <h2 className="text-xl font-bold text-sky-300">{timezone.city}</h2>
                <span className="text-sm font-semibold bg-sky-500/20 text-sky-300 px-2 py-1 rounded-full">{timezoneCode}</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">{timezone.name}</p>
            
            <div className="my-4 text-center flex items-baseline justify-center">
                <p className="text-5xl lg:text-6xl font-mono font-bold text-slate-100 tracking-wider">
                    {formattedTime}
                </p>
                <span className="text-2xl font-mono font-semibold text-slate-300 ml-2">{dayPeriod}</span>
            </div>
        </div>
        
        <div className="text-center border-t border-slate-700 pt-4 mt-auto">
            <p className="text-md text-slate-300">{formattedDate}</p>
            <p className="text-xs text-slate-500 mt-1">{timeDifference}</p>
        </div>
    </div>
  );
};

export default ClockCard;