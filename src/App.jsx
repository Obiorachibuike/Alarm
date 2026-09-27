import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Clock, 
  Sparkles, 
  Plus, 
  Trash2, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Timer as TimerIcon, 
  Zap, 
  Settings, 
  Radio, 
  Sun, 
  Moon,
  ChevronRight,
  BrainCircuit,
  Globe,
  Sliders,
  CheckCircle2
} from 'lucide-react';

import WorldClock from './components/WorldClock';
import Stopwatch from './components/Stopwatch';
import Timer from './components/Timer';
import CreateAlarmModal from './components/CreateAlarmModal';
import AlarmTriggerModal from './components/AlarmTriggerModal';
import AIPersonaStudio from './components/AIPersonaStudio';

import { audioSynth } from './utils/audio';
import { PERSONAS, generateAIBriefing, speakText, stopSpeech } from './utils/aiSpeech';
import { generateChallenge } from './utils/challenges';

const INITIAL_ALARMS = [
  {
    id: '1',
    time: '06:30',
    label: 'Morning Awakening & Tactical Briefing',
    enabled: true,
    isAI: true,
    personaId: 'jarvis',
    requireChallenge: true,
    challengeDifficulty: 'medium',
    tone: 'cyber',
    repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    focusGoal: 'Code architecture sprint & health regimen',
    customNote: 'Prepare for key product launch review.'
  },
  {
    id: '2',
    time: '14:00',
    label: 'Midday Power Reset & Mindful Pause',
    enabled: true,
    isAI: true,
    personaId: 'zen',
    requireChallenge: false,
    challengeDifficulty: 'easy',
    tone: 'zen',
    repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    focusGoal: 'Mindful hydration & eye strain release',
    customNote: 'Step outside for sunlight and recharge.'
  },
  {
    id: '3',
    time: '18:00',
    label: 'Evening Workout & Spartan Drill',
    enabled: false,
    isAI: true,
    personaId: 'drill',
    requireChallenge: true,
    challengeDifficulty: 'hard',
    tone: 'energetic',
    repeatDays: ['Mon', 'Wed', 'Fri'],
    focusGoal: 'Heavy lifting & endurance sprint',
    customNote: 'Push beyond limits.'
  }
];

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState(() => {
    const saved = localStorage.getItem('aura_alarms');
    return saved ? JSON.parse(saved) : INITIAL_ALARMS;
  });

  const [activeTab, setActiveTab] = useState('alarms'); // 'alarms', 'studio', 'world', 'timer', 'stopwatch'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTrigger, setActiveTrigger] = useState(null); // The alarm currently ringing
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [activeBriefingText, setActiveBriefingText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const firedOccurrencesRef = useRef(new Set());

  // Sync alarms to localStorage
  useEffect(() => {
    localStorage.setItem('aura_alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Reliable date-based scheduler.
  // Never depends on hitting exactly second 00 because browsers throttle background timers.
  useEffect(() => {
    const MISSED_ALARM_GRACE_MS = 2 * 60 * 1000;

    const evaluateAlarms = () => {
      const now = new Date();
      setCurrentTime(now);

      // Don't replace an alarm that is already ringing. A second due alarm will be
      // picked up on the next evaluation after the current one is dismissed.
      if (activeTrigger) return;

      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
      const dateKey = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0')
      ].join('-');

      for (const alarm of alarms) {
        if (!alarm.enabled) continue;

        const isOneTime = !Array.isArray(alarm.repeatDays) || alarm.repeatDays.length === 0;
        if (!isOneTime && !alarm.repeatDays.includes(dayName)) continue;

        const [hours, minutes] = String(alarm.time).split(':').map(Number);
        if (!Number.isFinite(hours) || !Number.isFinite(minutes)) continue;

        const scheduled = new Date(now);
        scheduled.setHours(hours, minutes, 0, 0);

        const lateness = now.getTime() - scheduled.getTime();

        // Fire on time OR recover from a short background-tab suspension.
        if (lateness < 0 || lateness > MISSED_ALARM_GRACE_MS) continue;

        const occurrenceKey = \`\${alarm.id}:\${dateKey}:\${alarm.time}\`;
        if (firedOccurrencesRef.current.has(occurrenceKey)) continue;

        firedOccurrencesRef.current.add(occurrenceKey);

        // A zero-repeat-day alarm means "one time", not "every day".
        if (isOneTime) {
          setAlarms(prev =>
            prev.map(item => item.id === alarm.id ? { ...item, enabled: false } : item)
          );
        }

        triggerAlarm(alarm);
        break;
      }
    };

    evaluateAlarms();
    const timer = window.setInterval(evaluateAlarms, 1000);

    const handleVisibilityChange = () => {
      if (!document.hidden) evaluateAlarms();
    };
    const handleFocus = () => evaluateAlarms();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [alarms, activeTrigger]);

  const triggerAlarm = (alarm) => {
    setActiveTrigger(alarm);
    
    // Start audio alarm tone loop
    audioSynth.startAlarmLoop(alarm.tone || 'cyber');

    let challenge = null;
    if (alarm.requireChallenge) {
      challenge = generateChallenge(alarm.challengeDifficulty || 'medium');
      setActiveChallenge(challenge);
    } else {
      setActiveChallenge(null);
    }

    if (alarm.isAI) {
      const briefing = generateAIBriefing({
        personaId: alarm.personaId || 'jarvis',
        userName: 'Commander',
        weather: 'Sunny & Clear, 22°C',
        tasks: ['Launch Sprint Roadmap', 'Sync Architecture Review', 'Workout & Hydration'],
        focusGoal: alarm.focusGoal || 'High-Impact Execution',
        customNote: alarm.customNote || ''
      });
      setActiveBriefingText(briefing.text);

      // Play synthesized vocal briefing
      setIsSpeaking(true);
      speakText(briefing.text, alarm.personaId, () => {
        setIsSpeaking(false);
      });
    } else {
      setActiveBriefingText('');
    }
  };

  const handleDismissAlarm = () => {
    audioSynth.stopAlarmLoop();
    stopSpeech();
    setActiveTrigger(null);
    setActiveChallenge(null);
    setIsSpeaking(false);
  };

  const handleSnoozeAlarm = () => {
    audioSynth.stopAlarmLoop();
    stopSpeech();
    setActiveTrigger(null);
    setActiveChallenge(null);
    setIsSpeaking(false);

    // Schedule temporary snooze for 5 minutes later
    const snoozeTime = new Date(Date.now() + 5 * 60 * 1000);
    const snoozeHours = String(snoozeTime.getHours()).padStart(2, '0');
    const snoozeMins = String(snoozeTime.getMinutes()).padStart(2, '0');
    
    const snoozedAlarm = {
      ...activeTrigger,
      id: 'snooze-' + Date.now(),
      label: `[Snoozed] ${activeTrigger.label}`,
      time: `${snoozeHours}:${snoozeMins}`,
      enabled: true,
      repeatDays: []
    };
    setAlarms(prev => [snoozedAlarm, ...prev]);
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else if (activeBriefingText && activeTrigger) {
      setIsSpeaking(true);
      speakText(activeBriefingText, activeTrigger.personaId, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleToggleAlarm = (id) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const handleDeleteAlarm = (id) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const handleAddAlarm = (newAlarm) => {
    setAlarms([newAlarm, ...alarms]);
  };

  // Immediate manual test simulation
  const handleTestAlarm = (alarm) => {
    triggerAlarm(alarm);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background ambient gradient glow */}
      <div className="fixed top-[-150px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="fixed bottom-[-150px] right-[-100px] w-[500px] h-[400px] bg-cyan-600/10 blur-3xl pointer-events-none rounded-full" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base">AURA</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI INTELLIGENCE v2.0
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">NEXT-GEN CHRONO OS</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>New Alarm</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 relative z-10">
        
        {/* Hero Live Digital Clock & Futuristic Status */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800 p-8 md:p-10 backdrop-blur-xl text-center shadow-2xl glow-box">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-300 mb-4">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>AI Clock Engine Active & Synchronized</span>
          </div>

          <div className="font-mono-code text-6xl md:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 drop-shadow-sm select-none">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </div>

          <div className="text-sm md:text-base font-medium text-slate-400 mt-2 flex items-center justify-center gap-2">
            <span>{currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span className="text-indigo-400 font-semibold">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/60 text-left">
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Alarms</span>
              <p className="text-xl font-bold text-white mt-0.5">
                {alarms.filter(a => a.enabled).length} <span className="text-xs font-normal text-slate-500">/ {alarms.length}</span>
              </p>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400">AI Voice Model</span>
              <p className="text-xl font-bold text-indigo-400 mt-0.5">JARVIS Prime</p>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400">Wakeup Guard</span>
              <p className="text-xl font-bold text-emerald-400 mt-0.5">Cognitive Math</p>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400">Audio Synthesis</span>
              <p className="text-xl font-bold text-cyan-400 mt-0.5">WebAudio 96kHz</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation Controls */}
        <div className="flex border-b border-slate-800 space-x-1 sm:space-x-3 overflow-x-auto pb-1">
          {[
            { id: 'alarms', label: 'Smart Alarms', icon: Bell },
            { id: 'studio', label: 'AI Voice Studio', icon: BrainCircuit },
            { id: 'world', label: 'World Zones', icon: Globe },
            { id: 'timer', label: 'Focus Countdown', icon: TimerIcon },
            { id: 'stopwatch', label: 'Precision Chrono', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                  active
                    ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'alarms' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Configured Wake-Up Sequences</h3>
                <p className="text-xs text-slate-400">Intelligent routines with cognitive verification safeguards</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Schedule
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alarms.map((alarm) => {
                const persona = PERSONAS.find(p => p.id === alarm.personaId) || PERSONAS[0];
                return (
                  <div
                    key={alarm.id}
                    className={`relative rounded-2xl p-5 border transition-all duration-200 ${
                      alarm.enabled
                        ? 'bg-slate-900/70 border-slate-700/80 hover:border-indigo-500/50 shadow-xl'
                        : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-code text-3xl font-extrabold text-white">
                            {alarm.time}
                          </span>
                          {alarm.isAI && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              <Sparkles className="w-3 h-3 text-cyan-400" />
                              AI Voice
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm text-slate-200">{alarm.label}</h4>
                      </div>

                      {/* Toggle switch */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={alarm.enabled}
                          onChange={() => handleToggleAlarm(alarm.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    {/* AI Info & Settings preview */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                      {alarm.isAI && (
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <span>{persona.avatar}</span>
                            <span className="font-medium text-slate-300">{persona.name}</span>
                          </span>
                          <span className="text-[11px] text-indigo-400 truncate max-w-[180px]">
                            {alarm.focusGoal || 'General Productivity'}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex gap-1">
                          {alarm.repeatDays.length > 0 ? (
                            alarm.repeatDays.map(d => (
                              <span key={d} className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">
                                {d}
                              </span>
                            ))
                          ) : (
                            <span className="italic">One-time alert</span>
                          )}
                        </div>

                        {alarm.requireChallenge && (
                          <span className="text-amber-400 font-medium">
                            Puzzle: {alarm.challengeDifficulty}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Test & Delete bar */}
                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800/40">
                      <button
                        onClick={() => handleTestAlarm(alarm)}
                        className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Simulate / Test Alarm
                      </button>

                      <button
                        onClick={() => handleDeleteAlarm(alarm.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition"
                        title="Delete alarm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'studio' && <AIPersonaStudio />}
        {activeTab === 'world' && <WorldClock />}
        {activeTab === 'timer' && <Timer />}
        {activeTab === 'stopwatch' && <Stopwatch />}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 py-8 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">AURA AI Chrono Suite</span>
            <span>•</span>
            <span>Synthesized Web Audio & Cognitive Neural Wake Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Zero Server Latency</span>
            <span>Offline Ready</span>
            <span>Custom Neural Personas</span>
          </div>
        </div>
      </footer>

      {/* New Alarm Modal */}
      <CreateAlarmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddAlarm}
      />

      {/* Active Ringing Alarm Screen */}
      {activeTrigger && (
        <AlarmTriggerModal
          alarm={activeTrigger}
          challenge={activeChallenge}
          briefingText={activeBriefingText}
          isSpeaking={isSpeaking}
          onToggleSpeech={handleToggleSpeech}
          onDismiss={handleDismissAlarm}
          onSnooze={handleSnoozeAlarm}
        />
      )}
    </div>
  );
}
