import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';
import { audioSynth } from '../utils/audio';

const PRESETS = [
  { label: 'Pomodoro (25m)', seconds: 25 * 60 },
  { label: 'Power Nap (20m)', seconds: 20 * 60 },
  { label: 'Short Break (5m)', seconds: 5 * 60 },
  { label: 'Quick Sprint (10m)', seconds: 10 * 60 },
];

export default function Timer() {
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');

  useEffect(() => {
    let interval = null;
    if (isActive && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (remainingSeconds === 0 && isActive) {
      setIsActive(false);
      audioSynth.playMelody('energetic');
      setTimeout(() => audioSynth.playMelody('cyber'), 800);
    }
    return () => clearInterval(interval);
  }, [isActive, remainingSeconds]);

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setRemainingSeconds(totalSeconds);
  };

  const handleSetPreset = (sec) => {
    setIsActive(false);
    setTotalSeconds(sec);
    setRemainingSeconds(sec);
  };

  const handleSetCustom = (e) => {
    e.preventDefault();
    const mins = parseInt(customMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      const sec = mins * 60;
      setIsActive(false);
      setTotalSeconds(sec);
      setRemainingSeconds(sec);
      setCustomMinutes('');
    }
  };

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const progressPercent = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-center">
      <div className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-2">
        Focus & Interval Countdown
      </div>

      {/* Progress ring or bar */}
      <div className="w-full bg-slate-800/80 rounded-full h-1.5 mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="font-mono-code text-5xl md:text-6xl font-extrabold tracking-tight text-white my-2 text-center">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>

      {remainingSeconds === 0 && (
        <div className="flex items-center gap-2 text-amber-400 font-medium text-sm animate-bounce my-2">
          <Bell className="w-4 h-4" /> Time's up! Mission interval complete.
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3 my-4">
        {isActive ? (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition shadow-lg"
          >
            <Pause className="w-4 h-4" /> Pause
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition"
          >
            <Play className="w-4 h-4 fill-current" /> Start Focus
          </button>
        )}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full mt-4">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handleSetPreset(preset.seconds)}
            className={`text-xs py-2 px-2.5 rounded-lg border transition text-center ${
              totalSeconds === preset.seconds
                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 font-semibold'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <form onSubmit={handleSetCustom} className="mt-4 flex gap-2 w-full max-w-xs">
        <input
          type="number"
          min="1"
          max="360"
          placeholder="Custom mins (e.g. 45)"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(e.target.value)}
          className="flex-1 bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition"
        >
          Set
        </button>
      </form>
    </div>
  );
}
