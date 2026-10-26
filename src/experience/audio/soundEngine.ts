/**
 * WENSURE Cinematic Audio Engine
 * Procedural Web Audio API synthesizer for ambient environment, construction, and evening soundscapes.
 * 100% self-contained — zero external audio assets required, guaranteed zero 404 or network failures.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientGain: GainNode | null = null;
  private constructionGain: GainNode | null = null;
  private eveningGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private hammerInterval: number | null = null;
  private cricketInterval: number | null = null;
  private currentProgress: number = 0;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    } catch (e) {
      console.warn('Web Audio API not supported in this environment', e);
    }
  }

  public toggleMute(): boolean {
    this.init();
    if (!this.ctx) return true;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      this.startAmbience();
      this.playChime(520, 'sine', 0.15);
    } else {
      this.stopAmbience();
    }

    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public updateScrollProgress(progress: number) {
    this.currentProgress = progress;
    if (this.isMuted || !this.ctx) return;

    // Adjust gains based on progress
    // Scenes 1-4 (0.0 - 0.5): Construction active
    // Scenes 5-7 (0.6 - 1.0): Evening & calm ambience
    if (this.constructionGain && this.ctx) {
      const constructionVolume = progress > 0.1 && progress < 0.65 ? 0.35 : 0.0;
      this.constructionGain.gain.setTargetAtTime(constructionVolume, this.ctx.currentTime, 0.5);
    }

    if (this.eveningGain && this.ctx) {
      const eveningVolume = progress > 0.6 ? 0.4 : 0.0;
      this.eveningGain.gain.setTargetAtTime(eveningVolume, this.ctx.currentTime, 0.5);
    }
  }

  private startAmbience() {
    if (!this.ctx) return;

    // Master Ambient Gain
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    this.ambientGain.connect(this.ctx.destination);

    // Wind / Natural Air noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02; // Brown/pink filter
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.ambientGain);
    whiteNoise.start();
    this.noiseNode = whiteNoise;

    // Construction sound sub-bus
    this.constructionGain = this.ctx.createGain();
    this.constructionGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.constructionGain.connect(this.ctx.destination);

    // Periodic gentle hammer / trowel tap
    this.hammerInterval = window.setInterval(() => {
      if (!this.isMuted && this.currentProgress > 0.12 && this.currentProgress < 0.65) {
        this.playHammerTap();
      }
    }, 2800);

    // Evening sound sub-bus (crickets)
    this.eveningGain = this.ctx.createGain();
    this.eveningGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    this.eveningGain.connect(this.ctx.destination);

    this.cricketInterval = window.setInterval(() => {
      if (!this.isMuted && this.currentProgress > 0.65) {
        this.playCricketChirp();
      }
    }, 1800);
  }

  private stopAmbience() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioScheduledSourceNode).stop();
      } catch {
        // Ignored
      }
      this.noiseNode = null;
    }
    if (this.hammerInterval) {
      clearInterval(this.hammerInterval);
      this.hammerInterval = null;
    }
    if (this.cricketInterval) {
      clearInterval(this.cricketInterval);
      this.cricketInterval = null;
    }
  }

  private playHammerTap() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.08);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, this.ctx.currentTime);
      filter.Q.setValueAtTime(4, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      if (this.constructionGain) {
        gain.connect(this.constructionGain);
      } else {
        gain.connect(this.ctx.destination);
      }

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // Audio fallback safe
    }
  }

  private playCricketChirp() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(4500, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      if (this.eveningGain) {
        gain.connect(this.eveningGain);
      } else {
        gain.connect(this.ctx.destination);
      }

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // Audio fallback safe
    }
  }

  public playChime(freq: number = 600, type: OscillatorType = 'sine', duration: number = 0.2) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback safe
    }
  }
}

export const soundEngine = new SoundEngine();
