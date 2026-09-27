import React, { useState } from 'react';
import { Sparkles, Brain, Plus, Clock, Sliders, Volume2 } from 'lucide-react';
import { PERSONAS } from '../utils/aiSpeech';

export default function CreateAlarmModal({ isOpen, onClose, onSave }) {
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('Morning Awakening');
  const [isAI, setIsAI] = useState(true);
  const [personaId, setPersonaId] = useState('jarvis');
  const [requireChallenge, setRequireChallenge] = useState(true);
  const [challengeDifficulty, setChallengeDifficulty] = useState('medium');
  const [tone, setTone] = useState('cyber');
  const [repeatDays, setRepeatDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [focusGoal, setFocusGoal] = useState('Deep work sprint & fitness');
  const [customNote, setCustomNote] = useState('');

  if (!isOpen) return null;

  const daysList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (day) => {
    if (repeatDays.includes(day)) {
      setRepeatDays(repeatDays.filter(d => d !== day));
    } else {
      setRepeatDays([...repeatDays, day]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: Date.now().toString(),
      time,
      label,
      enabled: true,
      isAI,
      personaId,
      requireChallenge,
      challengeDifficulty,
      tone,
      repeatDays,
      focusGoal,
      customNote
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create New Alarm</h3>
              <p className="text-xs text-slate-400">Configure schedule & smart AI triggers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-semibold p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Time Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Alarm Time
            </label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-2xl font-mono-code font-bold text-indigo-300 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Label */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Alarm Name / Title
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Morning Sprint, Gym Time..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Repeat Days */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Repeat Cycle
            </label>
            <div className="flex justify-between gap-1">
              {daysList.map((day) => {
                const active = repeatDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                      active
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Activation Toggle */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">Enable AI Voice Telemetry</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAI}
                  onChange={(e) => setIsAI(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {isAI && (
              <div className="space-y-4 pt-2 border-t border-slate-800/80">
                {/* Persona selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-indigo-300 uppercase mb-2">
                    Select Voice AI Persona
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PERSONAS.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setPersonaId(p.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition ${
                          personaId === p.id
                            ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-medium text-xs">
                          <span>{p.avatar}</span>
                          <span>{p.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{p.role}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-indigo-300 uppercase mb-1">
                    Morning Focus Directive / Goal
                  </label>
                  <input
                    type="text"
                    value={focusGoal}
                    onChange={(e) => setFocusGoal(e.target.value)}
                    placeholder="e.g. Master React architecture, run 5km"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-indigo-300 uppercase mb-1">
                    Custom Prompt Note
                  </label>
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g. Don't forget your 9:00 AM investor demo call!"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Brain Challenge Option */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-slate-200">
                  Wake-Up Brain Challenge
                </span>
              </div>
              <input
                type="checkbox"
                checked={requireChallenge}
                onChange={(e) => setRequireChallenge(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </div>

            {requireChallenge && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Puzzle Complexity:</span>
                <div className="flex gap-1.5">
                  {['easy', 'medium', 'hard'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setChallengeDifficulty(lvl)}
                      className={`px-2.5 py-1 rounded text-[11px] uppercase font-semibold transition ${
                        challengeDifficulty === lvl
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Audio Chime Tone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Synthesized Tone Profile
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="cyber">Cyber Ascent (Futuristic Arpeggio)</option>
              <option value="zen">Zen Frequency (Harmonic Tibetan Gong)</option>
              <option value="energetic">Apex Pulser (High-Energy Alert)</option>
              <option value="classic">Retro Digital Beep (Vintage Clock)</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Save Alarm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
