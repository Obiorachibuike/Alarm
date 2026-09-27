import React, { useState } from 'react';
import { Sparkles, Play, StopCircle, RefreshCw, Volume2 } from 'lucide-react';
import { PERSONAS, generateAIBriefing, speakText, stopSpeech } from '../utils/aiSpeech';

export default function AIPersonaStudio() {
  const [selectedPersona, setSelectedPersona] = useState('jarvis');
  const [userName, setUserName] = useState('Obiora');
  const [focusGoal, setFocusGoal] = useState('Ship groundbreaking AI alarm platform');
  const [weatherCondition, setWeatherCondition] = useState('Clear Sky, 22°C (Ideal)');
  const [customBrief, setCustomBrief] = useState('Review morning pull requests and hit the gym.');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');

  const activePersonaObj = PERSONAS.find(p => p.id === selectedPersona) || PERSONAS[0];

  const handleGenerateScript = () => {
    const briefing = generateAIBriefing({
      personaId: selectedPersona,
      userName,
      weather: weatherCondition,
      tasks: ['Review PR on GitHub', '45m High-Intensity Workout', 'Quarterly roadmap sync'],
      focusGoal,
      customNote: customBrief
    });
    setGeneratedScript(briefing.text);
    return briefing.text;
  };

  const handlePlayVoice = () => {
    let script = generatedScript;
    if (!script) {
      script = handleGenerateScript();
    }
    setIsSpeaking(true);
    speakText(script, selectedPersona, () => {
      setIsSpeaking(false);
    });
  };

  const handleStopVoice = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </span>
            <h3 className="font-bold text-lg text-white">AI Voice & Persona Intelligence Studio</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Audition and customize intelligent vocal agents designed to jumpstart your daily dopamine and discipline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSpeaking ? (
            <button
              onClick={handleStopVoice}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition shadow-lg"
            >
              <StopCircle className="w-4 h-4" /> Stop Speech
            </button>
          ) : (
            <button
              onClick={handlePlayVoice}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition"
            >
              <Play className="w-4 h-4 fill-current" /> Audition Persona
            </button>
          )}
        </div>
      </div>

      {/* Persona Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {PERSONAS.map((p) => {
          const isSelected = selectedPersona === p.id;
          return (
            <div
              key={p.id}
              onClick={() => {
                setSelectedPersona(p.id);
                setGeneratedScript('');
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{p.avatar}</span>
                {isSelected && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Active
                  </span>
                )}
              </div>
              <h4 className="font-bold text-sm text-slate-100">{p.name}</h4>
              <div className="text-[11px] text-cyan-400 font-medium mb-1.5">{p.role}</div>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{p.tone}</p>
            </div>
          );
        })}
      </div>

      {/* Briefing Config Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
          <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
            Recipient Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              setGeneratedScript('');
            }}
            className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
          <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
            Ambient Weather Sync
          </label>
          <input
            type="text"
            value={weatherCondition}
            onChange={(e) => {
              setWeatherCondition(e.target.value);
              setGeneratedScript('');
            }}
            className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
          <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
            Primary Goal / Intention
          </label>
          <input
            type="text"
            value={focusGoal}
            onChange={(e) => {
              setFocusGoal(e.target.value);
              setGeneratedScript('');
            }}
            className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Generated Script Display */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            Live Synthesized Briefing Script:
          </span>
          <button
            onClick={handleGenerateScript}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3 h-3" /> Regenerate Preview
          </button>
        </div>
        <p className="text-xs text-slate-300 italic leading-relaxed border-l-2 border-indigo-500 pl-3 py-1">
          {generatedScript || activePersonaObj.samplePrompt}
        </p>
      </div>
    </div>
  );
}
