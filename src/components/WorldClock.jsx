import React, { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, Clock } from 'lucide-react';

const CITIES = [
  { name: 'London', tz: 'Europe/London', country: 'United Kingdom' },
  { name: 'New York', tz: 'America/New_York', country: 'United States' },
  { name: 'Tokyo', tz: 'Asia/Tokyo', country: 'Japan' },
  { name: 'San Francisco', tz: 'America/Los_Angeles', country: 'United States' },
  { name: 'Paris', tz: 'Europe/Paris', country: 'France' },
  { name: 'Dubai', tz: 'Asia/Dubai', country: 'UAE' },
  { name: 'Singapore', tz: 'Asia/Singapore', country: 'Singapore' },
  { name: 'Sydney', tz: 'Australia/Sydney', country: 'Australia' },
  { name: 'Lagos', tz: 'Africa/Lagos', country: 'Nigeria' },
];

export default function WorldClock() {
  const [selectedCities, setSelectedCities] = useState([
    { name: 'New York', tz: 'America/New_York', country: 'United States' },
    { name: 'London', tz: 'Europe/London', country: 'United Kingdom' },
    { name: 'Tokyo', tz: 'Asia/Tokyo', country: 'Japan' },
    { name: 'Lagos', tz: 'Africa/Lagos', country: 'Nigeria' },
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeInTz = (tz) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(currentTime);
    } catch {
      return '--:--:--';
    }
  };

  const getDateInTz = (tz) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(currentTime);
    } catch {
      return '';
    }
  };

  const addCity = (city) => {
    if (!selectedCities.some(c => c.name === city.name)) {
      setSelectedCities([...selectedCities, city]);
    }
    setIsAdding(false);
  };

  const removeCity = (cityName) => {
    setSelectedCities(selectedCities.filter(c => c.name !== cityName));
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-100">Global Synchronized Time</h3>
            <p className="text-xs text-slate-400">Track international client zones & distributed teams</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Zone
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 grid grid-cols-2 md:grid-cols-3 gap-2">
          {CITIES.map((c) => (
            <button
              key={c.name}
              disabled={selectedCities.some(item => item.name === c.name)}
              onClick={() => addCity(c)}
              className="text-left p-2 rounded-lg bg-slate-900/80 hover:bg-indigo-600/20 border border-slate-700/50 hover:border-indigo-500/40 text-xs transition disabled:opacity-40 disabled:hover:bg-slate-900/80"
            >
              <div className="font-medium text-slate-200">{c.name}</div>
              <div className="text-[10px] text-slate-400">{c.country}</div>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedCities.map((city) => (
          <div
            key={city.name}
            className="group relative bg-slate-950/50 border border-slate-800 hover:border-indigo-500/30 rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-semibold text-slate-200 text-sm">{city.name}</span>
                <span className="block text-[11px] text-slate-400">{city.country}</span>
              </div>
              <button
                onClick={() => removeCity(city.name)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition"
                title="Remove zone"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="font-mono-code text-xl font-bold tracking-tight text-indigo-300">
              {getTimeInTz(city.tz)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {getDateInTz(city.tz)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
