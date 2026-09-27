// Synthesized rich audio alert tones using HTML5 Web Audio API
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.currentInterval = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }

    if (this.ctx.state === 'suspended') {
      // Browsers may suspend Web Audio until a user gesture resumes it.
      ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  unlock() {
    const ctx = this.init();
    if (!ctx) return false;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Create a silent buffer during the user gesture to establish an audio session.
    try {
      const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      source.buffer = buffer;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);
    } catch (e) {
      console.warn('Audio unlock error:', e);
    }

    return true;
  }

  playTone(frequency = 440, type = 'sine', duration = 0.4, gainLevel = 0.2) {
    const ctx = this.init();
    if (!ctx) return;

    const scheduleTone = () => {
      try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(gainLevel, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play error:", e);
    }
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(scheduleTone).catch(() => {});
    } else {
      scheduleTone();
    }
  }

  playMelody(pattern = 'cyber') {
    this.init();
    if (pattern === 'cyber') {
      // Futuristic ascending chime
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'sawtooth', 0.25, 0.12), idx * 120);
      });
    } else if (pattern === 'zen') {
      // Soft calming gong
      [220, 329.63, 440].forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'sine', 0.8, 0.2), idx * 180);
      });
    } else if (pattern === 'energetic') {
      // Urgent wake-up pulsers
      [880, 880, 1174.66, 1318.5].forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'triangle', 0.15, 0.25), idx * 90);
      });
    } else {
      // Classic electronic beep
      this.playTone(800, 'square', 0.2, 0.15);
      setTimeout(() => this.playTone(800, 'square', 0.2, 0.15), 180);
    }
  }

  startAlarmLoop(tone = 'cyber') {
    this.isPlaying = true;
    this.playMelody(tone);
    if (this.currentInterval) clearInterval(this.currentInterval);
    this.currentInterval = setInterval(() => {
      if (this.isPlaying) {
        this.playMelody(tone);
      }
    }, 1800);
  }

  stopAlarmLoop() {
    this.isPlaying = false;
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
  }
}

export const audioSynth = new AudioSynthesizer();
