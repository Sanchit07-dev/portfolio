// ─────────────────────────────────────────────
// SOUND MANAGER (SYNTHESIZED & WEB AUDIO API)
// Provides instant, zero-latency, reliable audio without external network drops
// ─────────────────────────────────────────────

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isBgmPlaying = false;
    this.bgmOsc1 = null;
    this.bgmOsc2 = null;
    this.bgmGain = null;
    this.masterGain = null;
    this.initialized = false;
    this.engineNodes = null;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  // Play subtle UI click
  playClick() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Play jump sound
  playJump() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  // Footstep sound
  playFootstep() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140 + Math.random() * 30, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Collect item sound
  playCollect() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.18, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.2);
    });
  }

  // Interaction open panel sound
  playInteract() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Quest Completed fanfare
  playQuestComplete() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    const chords = [
      { t: 0, f: [440, 554.37, 659.25] },     // A major
      { t: 0.18, f: [493.88, 622.25, 739.99] }, // B major
      { t: 0.38, f: [587.33, 739.99, 880] },   // D major
      { t: 0.65, f: [659.25, 830.61, 987.77, 1318.51] } // E major victorious
    ];
    chords.forEach(chord => {
      chord.f.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + chord.t);
        gain.gain.setValueAtTime(0.12, now + chord.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + chord.t + 0.45);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + chord.t);
        osc.stop(now + chord.t + 0.45);
      });
    });
  }

  // Ambient gentle wind & melody
  startAmbientMusic() {
    if (!this.ctx || this.isBgmPlaying) return;
    this.resume();
    try {
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      // Warm soothing drone chord (F# - A# - C# - F)
      const frequencies = [185.00, 233.08, 277.18, 349.23];
      this.oscillators = frequencies.map(freq => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.connect(this.bgmGain);
        osc.start();
        return osc;
      });
      this.isBgmPlaying = true;
    } catch {
      // Ignore background music errors
    }
  }

  stopAmbientMusic() {
    if (!this.isBgmPlaying || !this.oscillators) return;
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    this.oscillators = [];
    this.isBgmPlaying = false;
  }

  // ── Drive-mode engine loop ──
  startEngine() {
    if (!this.ctx || this.engineNodes) return;
    this.resume();
    try {
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 64;
      sub.type = 'triangle';
      sub.frequency.value = 44;
      filter.type = 'lowpass';
      filter.frequency.value = 420;
      gain.gain.value = 0;
      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      sub.start();
      this.engineNodes = { osc, sub, filter, gain };
    } catch {
      this.engineNodes = null;
    }
  }

  // Called every frame while driving — shapes pitch & volume from car speed
  setEngine(speed, boosting = false) {
    const engine = this.engineNodes;
    if (!this.ctx || !engine) return;
    this.resume();
    try {
      const n = Math.min(1, Math.abs(speed || 0) / 14);
      const target = n < 0.02 || this.isMuted ? 0 : 0.035 + n * 0.075 + (boosting ? 0.03 : 0);
      engine.gain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
      engine.osc.frequency.setTargetAtTime(60 + n * 150 + (boosting ? 34 : 0), this.ctx.currentTime, 0.08);
      engine.sub.frequency.setTargetAtTime(40 + n * 70, this.ctx.currentTime, 0.08);
    } catch {
      // Ignore
    }
  }

  stopEngine() {
    const engine = this.engineNodes;
    if (!engine || !this.ctx) return;
    this.engineNodes = null;
    try {
      engine.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      setTimeout(() => {
        try {
          engine.osc.stop();
          engine.sub.stop();
        } catch {}
        try {
          engine.osc.disconnect();
          engine.sub.disconnect();
          engine.filter.disconnect();
          engine.gain.disconnect();
        } catch {}
      }, 180);
    } catch {
      // Ignore
    }
  }

  // Toy car horns: 'beep' | 'toot' | 'chime'
  playHorn(hornId = 'beep') {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    try {
      if (hornId === 'toot') {
        [311.13, 415.3].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.14);
          gain.gain.setValueAtTime(0.14, now + idx * 0.14);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.28);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(now + idx * 0.14);
          osc.stop(now + idx * 0.14 + 0.28);
        });
      } else if (hornId === 'chime') {
        [1046.5, 1318.51].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.14, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.5);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.5);
        });
      } else {
        [0, 0.16].forEach((offset) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(784, now + offset);
          gain.gain.setValueAtTime(0.12, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.13);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(now + offset);
          osc.stop(now + offset + 0.13);
        });
      }
    } catch {
      // Ignore
    }
  }

  // Soft knock when props get nudged
  playBump() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Ignore
    }
  }

  // Thud when the car touches down
  playLand() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.16);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundManager();
