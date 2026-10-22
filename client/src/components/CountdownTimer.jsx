import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate = '2026-10-30T05:30:00+05:30', deadline = '2026-10-25T23:00:00+05:30' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isDeadlineClosed, setIsDeadlineClosed] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const raceTime = new Date(targetDate).getTime();
      const deadlineTime = new Date(deadline).getTime();

      setIsDeadlineClosed(now > deadlineTime);

      const diff = raceTime - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, deadline]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <div className="w-full">
      {/* Editorial Deadline Badge */}
      <div className="flex items-center justify-center mb-6">
        <span
          className={`px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-luxury uppercase border ${
            isDeadlineClosed
              ? 'bg-red-500/10 text-red-600 border-red-500/20'
              : 'bg-[#C59A5A]/15 text-[#C59A5A] border-[#C59A5A]/30'
          }`}
        >
          {isDeadlineClosed ? '● Registration Officially Closed' : '● Registration Open until 25 Oct 2026'}
        </span>
      </div>

      {/* Countdown Digits in Editorial Typography */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 max-w-xl mx-auto">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center p-2 sm:p-3 md:p-5 rounded-sm bg-white/5 backdrop-blur-md border border-white/10 text-center"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.12)'
            }}
          >
            <span
              className="text-xl sm:text-3xl md:text-5xl font-serif font-light text-white tracking-wider"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[8px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.16em] md:tracking-[0.2em] text-[#C59A5A] mt-1 font-semibold">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
