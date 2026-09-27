import React, { useState } from 'react';
import { Volume2, VolumeX, CheckCircle, BrainCircuit, Sparkles, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AlarmTriggerModal({
  alarm,
  onDismiss,
  onSnooze,
  challenge,
  briefingText,
  isSpeaking,
  onToggleSpeech
}) {
  const [answerInput, setAnswerInput] = useState('');
  const [errorNotice, setErrorNotice] = useState(false);

  const handleChallengeSolve = (e) => {
    e.preventDefault();
    if (challenge) {
      if (answerInput.trim().toLowerCase() === challenge.answer.trim().toLowerCase()) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        onDismiss();
      } else {
        setErrorNotice(true);
        setTimeout(() => setErrorNotice(false), 2000);
      }
    } else {
      onDismiss();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-indigo-500/20 glow-box">
        
        {/* Pulsing visual header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-3 border border-indigo-500/40 animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
            {alarm.isAI ? '⚡ AI Smart Awakening Active' : 'Standard Scheduled Alarm'}
          </div>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            {alarm.label || 'Wake Up Time!'}
          </h2>
          <div className="text-indigo-300 font-mono-code text-2xl font-bold mt-1">
            {alarm.time}
          </div>
        </div>

        {/* AI Voice Briefing Segment */}
        {alarm.isAI && briefingText && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                AI Morning Telemetry Briefing
              </span>
              <button
                onClick={onToggleSpeech}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 transition"
              >
                {isSpeaking ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Speaking...
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" /> Replay Speech
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-indigo-500 pl-3 py-1">
              "{briefingText}"
            </p>
          </div>
        )}

        {/* Brain Wakeup Challenge if enabled */}
        {challenge ? (
          <div className="mb-6 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4" />
              Cognitive Wake-Up Challenge: {challenge.type}
            </div>
            <p className="text-base font-medium text-slate-100 mb-3">{challenge.question}</p>
            {challenge.hint && (
              <p className="text-xs text-slate-400 mb-3 italic">Hint: {challenge.hint}</p>
            )}

            <form onSubmit={handleChallengeSolve} className="flex gap-2">
              <input
                type="text"
                autoFocus
                placeholder="Enter exact answer to dismiss alarm..."
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                className={`flex-1 bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition ${
                  errorNotice
                    ? 'border-rose-500 ring-2 ring-rose-500/30'
                    : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
              >
                <CheckCircle className="w-4 h-4" /> Submit
              </button>
            </form>
            {errorNotice && (
              <p className="text-xs text-rose-400 font-medium mt-2">
                Incorrect answer! Wake up your brain and try again.
              </p>
            )}
          </div>
        ) : null}

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={onSnooze}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            Snooze (+5 Mins)
          </button>
          
          {!challenge && (
            <button
              onClick={onDismiss}
              className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/20 transition"
            >
              Dismiss Alarm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
