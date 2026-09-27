// AI Assistant intelligence for wakeups, motivation, routine planning, and briefing
export const PERSONAS = [
  {
    id: 'jarvis',
    name: 'JARVIS Prime',
    role: 'Tactical & Executive AI',
    avatar: '⚡',
    tone: 'Crisp, articulate, highly efficient and visionary',
    pitch: 1.0,
    rate: 1.05,
    samplePrompt: "Good morning Commander. All systems optimal, schedule synced, and focus blocks secured."
  },
  {
    id: 'zen',
    name: 'Serena Mind',
    role: 'Mindfulness & Wellbeing Guide',
    avatar: '🌿',
    tone: 'Calm, grounding, restorative and gentle',
    pitch: 0.92,
    rate: 0.9,
    samplePrompt: "Breathe in deeply. A tranquil, balanced, and productive day awaits your mindful intention."
  },
  {
    id: 'drill',
    name: 'Apex Spartan',
    role: 'High-Performance Drill Coach',
    avatar: '🔥',
    tone: 'Urgent, high-energy, relentless, and inspiring',
    pitch: 1.15,
    rate: 1.15,
    samplePrompt: "Time to rise and conquer! Excuses burn zero calories and build zero empires. Let's move!"
  },
  {
    id: 'philosopher',
    name: 'Aurelius AI',
    role: 'Stoic Strategist',
    avatar: '🏛️',
    tone: 'Profound, stoic, reflective, and purpose-driven',
    pitch: 0.88,
    rate: 0.95,
    samplePrompt: "When you arise in the morning think of what a privilege it is to be alive, to think, to enjoy, to act."
  }
];

export const generateAIBriefing = ({
  personaId = 'jarvis',
  userName = 'Commander',
  weather = 'Sunny, 21°C',
  tasks = ['Launch project sprint', '30-min deep workout', 'Team strategy sync'],
  focusGoal = 'Ship v2.0 milestone',
  customNote = ''
}) => {
  const persona = PERSONAS.find(p => p.id === personaId) || PERSONAS[0];
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  let text = '';

  switch (personaId) {
    case 'zen':
      text = `Good morning, ${userName}. It is ${timeStr} on this serene ${dateStr}. The ambient weather is ${weather}. Before looking at screens or urgency, take one conscious, deep breath. Today's gentle anchor is "${focusGoal}". Your key intention unfolds with ${tasks.length} mindful actions. Remember: you do not have to rush to be worthy. Flow with patience and clarity.`;
      break;
    case 'drill':
      text = `Rise and shine, ${userName}! The clock shows ${timeStr} sharp! Today is ${dateStr}. Outside condition is ${weather}. Zero snoozing permitted in this arena! Your primary battle objective is: ${focusGoal}. You've got ${tasks.length} critical missions waiting to be crushed! Step up, hydrate, and dominate this day! Let's get it!`;
      break;
    case 'philosopher':
      text = `Greetings, ${userName}. Dawn has broken at ${timeStr}. It is ${dateStr}, and the skies present ${weather}. Consider: you have been gifted another day of existence to express reason, courage, and discipline. Your primary focus is ${focusGoal}. Undertake each task as if it were your last and finest work.`;
      break;
    case 'jarvis':
    default:
      text = `Good morning, ${userName}. System status online at ${timeStr}, ${dateStr}. Current atmospheric metrics: ${weather}. Today's calibrated core directive: ${focusGoal}. Priority milestones include: ${tasks.join(', ')}. Audio telemetry is running smoothly. Your daily potential is maximized. Have a productive day.`;
      break;
  }

  if (customNote) {
    text += ` Personal alert briefing: ${customNote}`;
  }

  return {
    persona,
    text,
    timestamp: new Date().toISOString()
  };
};

export const speakText = (text, personaId = 'jarvis', onEnd) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel(); // Stop any pending speech
  const utterance = new SpeechSynthesisUtterance(text);
  const persona = PERSONAS.find(p => p.id === personaId) || PERSONAS[0];

  utterance.pitch = persona.pitch || 1.0;
  utterance.rate = persona.rate || 1.0;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    // Try to pick suitable English voice
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    if (personaId === 'zen' && englishVoices.length > 1) {
      utterance.voice = englishVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('victoria')) || englishVoices[0];
    } else if (personaId === 'jarvis' && englishVoices.length > 0) {
      utterance.voice = englishVoices.find(v => v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('uk') || v.name.toLowerCase().includes('george')) || englishVoices[0];
    } else {
      utterance.voice = englishVoices[0] || voices[0];
    }
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn("Speech error:", e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
