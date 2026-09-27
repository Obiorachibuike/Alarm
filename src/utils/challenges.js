// Generates randomized wake-up challenges: Math, Logic, Word scrambles, Reflex
export const generateChallenge = (difficulty = 'medium') => {
  const types = ['math', 'code', 'word'];
  const type = types[Math.floor(Math.random() * types.length)];

  if (type === 'math') {
    if (difficulty === 'easy') {
      const a = Math.floor(Math.random() * 20) + 10;
      const b = Math.floor(Math.random() * 15) + 5;
      return {
        type: 'Math Puzzle',
        question: `Calculate: ${a} + ${b} = ?`,
        answer: (a + b).toString(),
        hint: 'Basic addition'
      };
    } else if (difficulty === 'hard') {
      const a = Math.floor(Math.random() * 12) + 12;
      const b = Math.floor(Math.random() * 8) + 6;
      const c = Math.floor(Math.random() * 40) + 15;
      return {
        type: 'Cognitive Calculation',
        question: `Calculate: (${a} × ${b}) - ${c} = ?`,
        answer: (a * b - c).toString(),
        hint: 'Multiply first, then subtract'
      };
    } else {
      const a = Math.floor(Math.random() * 25) + 15;
      const b = Math.floor(Math.random() * 15) + 7;
      return {
        type: 'Mental Math',
        question: `Calculate: ${a} × 3 + ${b} = ?`,
        answer: (a * 3 + b).toString(),
        hint: 'Quick mental agility'
      };
    }
  }

  if (type === 'word') {
    const wordList = [
      { scrambled: 'K W E A U P', answer: 'WAKEUP', hint: 'Action for the morning' },
      { scrambled: 'C S O U F', answer: 'FOCUS', hint: 'Concentration power' },
      { scrambled: 'N E E G Y R', answer: 'ENERGY', hint: 'What you need today' },
      { scrambled: 'A U R O R A', answer: 'AURORA', hint: 'Dawn light' },
      { scrambled: 'O P T I M A L', answer: 'OPTIMAL', hint: 'Peak performance state' }
    ];
    const picked = wordList[Math.floor(Math.random() * wordList.length)];
    return {
      type: 'Unscramble Anagram',
      question: `Unscramble this word: ${picked.scrambled}`,
      answer: picked.answer,
      hint: picked.hint
    };
  }

  // Code / Logic
  const logicQuestions = [
    {
      question: 'What is the binary value of decimal 13? (hint: 8 + 4 + 1)',
      answer: '1101',
      hint: '4 bits: 8-4-2-1'
    },
    {
      question: 'Complete the sequence: 2, 4, 8, 16, ?',
      answer: '32',
      hint: 'Powers of 2'
    },
    {
      question: 'Evaluate JavaScript: [1, 2, 3].length + 4 * 2',
      answer: '11',
      hint: 'Array length (3) + 8'
    }
  ];
  const q = logicQuestions[Math.floor(Math.random() * logicQuestions.length)];
  return {
    type: 'Logic Diagnostic',
    question: q.question,
    answer: q.answer,
    hint: q.hint
  };
};
