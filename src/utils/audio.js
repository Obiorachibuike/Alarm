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
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(frequency = 440, type = 'sine', duration = 0.4, gainLevel = 0.2) {
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(gainLevel, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play error:", e);
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
