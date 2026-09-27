import React, { useState } from 'react';
import { BrainCircuit, Flame, ShieldAlert, CheckCircle2 } from 'lucide-react';

const levels = [
  { id: 'easy', label: 'Gentle', description: 'One quick mental challenge', icon: '🌱' },
  { id: 'medium', label: 'Focused', description: 'A real wake-up challenge', icon: '⚡' },
  { id: 'hard', label: 'Heavy Sleeper', description: 'Harder challenge + no easy exit', icon: '🔥' }
];

export default function WakeMissionBuilder({ value, onChange }) {
  const mission = value || { enabled: false, difficulty: 'medium', noSnooze: false, maxSnoozes: 1 };

  const update = (patch) => onChange({ ...mission, ...patch });

  return (
    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <BrainCircuit className="w-4 h-4 text-amber-400" />
            AURA Wake Mission
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Make dismissal intentional instead of accidental.</p>
        </div>
        <button
          type="button"
          onClick={() => update({ enabled: !mission.enabled })}
          aria-pressed={mission.enabled}
          className={`relative w-11 h-6 rounded-full transition ${mission.enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
        >
          <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${mission.enabled ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      {mission.enabled && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {levels.map(level => (
              <button
                key={level.id}
                type="button"
                onClick={() => update({ difficulty: level.id })}
                className={`text-left p-3 rounded-xl border transition ${mission.difficulty === level.id ? 'border-amber-500/60 bg-amber-500/10' : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'}`}
              >
                <div className="text-lg">{level.icon}</div>
                <div className="text-[11px] font-bold text-white mt-1">{level.label}</div>
                <div className="text-[9px] text-slate-500 mt-1">{level.description}</div>
              </button>
            ))}
          </div>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <span>
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-200"><ShieldAlert className="w-4 h-4 text-rose-400" /> Disable snooze</span>
              <span className="text-[10px] text-slate-500">The alarm must be completed before dismissal.</span>
            </span>
            <input type="checkbox" checked={mission.noSnooze} onChange={e => update({ noSnooze: e.target.checked })} className="w-4 h-4 accent-indigo-600" />
          </label>

          {!mission.noSnooze && (
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Maximum snoozes</span>
              <select value={mission.maxSnoozes} onChange={e => update({ maxSnoozes: Number(e.target.value) })} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200">
                {[1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2 text-[10px] text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Mission settings are saved with the alarm.
          </div>
        </>
      )}
    </div>
  );
}
