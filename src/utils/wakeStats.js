const STORAGE_KEY = 'aura_wake_history';

export const getWakeHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const recordWakeEvent = ({ alarmId, alarmLabel, method, snoozes = 0 }) => {
  const history = getWakeHistory();
  const today = new Date().toISOString().slice(0, 10);
  const next = [
    {
      id: `${Date.now()}-${alarmId}`,
      date: today,
      timestamp: new Date().toISOString(),
      alarmId,
      alarmLabel,
      method,
      snoozes
    },
    ...history.filter(item => item.date !== today)
  ].slice(0, 90);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};

export const calculateWakeStreak = (history = getWakeHistory()) => {
  const dates = new Set(history.map(item => item.date));
  let streak = 0;
  const cursor = new Date();

  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

export const getWakeScore = (history = getWakeHistory()) => {
  if (!history.length) return 0;
  const recent = history.slice(0, 7);
  const completed = recent.filter(item => item.method === 'challenge' || item.method === 'dismiss').length;
  const snoozePenalty = recent.reduce((sum, item) => sum + Math.min(item.snoozes || 0, 3), 0) * 5;
  return Math.max(0, Math.min(100, Math.round((completed / recent.length) * 100 - snoozePenalty)));
};
