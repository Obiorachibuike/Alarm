import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      const startTime = Date.now() - time;
      interval = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([time, ...laps]);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-center">
      <div className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-2">
        Precision Chronometer
      </div>
      <div className="font-mono-code text-5xl md:text-6xl font-extrabold tracking-tight text-white my-4 text-center">
        {formatTime(time)}
      </div>

      <div className="flex items-center gap-3 my-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition shadow-lg ${
            isRunning
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>

        <button
          onClick={handleLap}
          disabled={!isRunning}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition disabled:opacity-40"
        >
          <Flag className="w-4 h-4" />
          Lap
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className="w-full mt-4 max-h-48 overflow-y-auto space-y-1.5 border-t border-slate-800 pt-3">
          {laps.map((lapTime, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-xs px-3 py-1.5 rounded-lg bg-slate-950/40 text-slate-300"
            >
              <span className="text-slate-500">Lap #{laps.length - idx}</span>
              <span className="font-mono-code text-indigo-300">{formatTime(lapTime)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
