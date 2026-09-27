import React, { useMemo } from 'react';
import { Flame, Target, TrendingUp, ShieldCheck } from 'lucide-react';
import { calculateWakeStreak, getWakeScore } from '../utils/wakeStats';

export default function WakeInsights({ history = [] }) {
  const streak = useMemo(() => calculateWakeStreak(history), [history]);
  const score = useMemo(() => getWakeScore(history), [history]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4">
        <div className="flex items-center gap-2 text-orange-300 text-[11px] font-bold uppercase tracking-wider">
          <Flame className="w-4 h-4" /> Wake Streak
        </div>
        <p className="text-2xl font-extrabold text-white mt-2">{streak}<span className="text-sm text-slate-500 ml-1">days</span></p>
      </div>
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
        <div className="flex items-center gap-2 text-indigo-300 text-[11px] font-bold uppercase tracking-wider">
          <Target className="w-4 h-4" /> Wake Score
        </div>
        <p className="text-2xl font-extrabold text-white mt-2">{score}<span className="text-sm text-slate-500 ml-1">/100</span></p>
      </div>
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex items-center gap-2 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Reliability
        </div>
        <p className="text-sm font-bold text-white mt-2">Local-first</p>
        <p className="text-[10px] text-slate-500 mt-1">Works without an account</p>
      </div>
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <div className="flex items-center gap-2 text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" /> Wake Events
        </div>
        <p className="text-2xl font-extrabold text-white mt-2">{history.length}</p>
      </div>
    </div>
  );
}
