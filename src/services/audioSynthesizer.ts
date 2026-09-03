import { SoundType } from '../types';

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSources: (AudioNode | number)[] = [];
  private activeFrequencyOscillators: { osc: OscillatorNode; multiplier: number; offset: number }[] = [];
  private currentAmbientType: SoundType | null = null;
  private currentVolume: number = 0.6;
  private currentFrequency: number = 528;
  private sleepTimerId: number | null = null;
  private isMuted: boolean = false;

  constructor() {
    try {
      const saved = localStorage.getItem('BLESSIKAA_MUTED');
      this.isMuted = saved === 'true';
    } catch {
      this.isMuted = false;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    try {
      localStorage.setItem('BLESSIKAA_MUTED', String(muted));
    } catch {
      // ignore
    }
    if (muted) {
      this.stopAmbient();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getCurrentFrequency(): number {
    return this.currentFrequency;
  }

  public setFrequency(frequency: number): void {
    this.currentFrequency = frequency;
    if (this.isMuted) return;

    // If currently running a frequency-based ambient sound, retune oscillators in real time
    if (this.ctx && this.activeFrequencyOscillators.length > 0) {
      const now = this.ctx.currentTime;
      this.activeFrequencyOscillators.forEach(({ osc, multiplier, offset }) => {
        try {
          const targetFreq = Math.max(20, frequency * multiplier + offset);
          osc.frequency.cancelScheduledValues(now);
          osc.frequency.setValueAtTime(osc.frequency.value, now);
          osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.35);
        } catch {
          // ignore ramp error
        }
      });
    }

    // Play a crystal feedback chime when frequency changes
    this.playSingingBowl(frequency);
  }

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a pure or harmonic tone with smooth attack & exponential decay
  public playTone(frequency: number = 528, duration: number = 2.0, type: OscillatorType = 'sine'): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, now);

      // Envelope: Gentle linear attack, exponential decay
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch {
      // Ignore audio autoplay restrictions gracefully
    }
  }

  // Sacred 528Hz Crystal Singing Bowl Resonance
  public playSingingBowl(baseFreq: number = 528): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const duration = 3.5;

      const harmonics = [
        { freq: baseFreq, gain: 0.35 },
        { freq: baseFreq * 2, gain: 0.15 },
        { freq: baseFreq * 0.5, gain: 0.2 },
        { freq: baseFreq * 1.5, gain: 0.08 },
      ];

      harmonics.forEach(({ freq, gain: peakGain }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        // Add subtle pitch drift
        osc.frequency.linearRampToValueAtTime(freq + 0.5, now + duration);

        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.linearRampToValueAtTime(peakGain, now + 0.12);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.1);
      });
    } catch {
      // Audio context fallback
    }
  }

  public playTibetanBowl(baseFreq: number = 528): void {
    this.playSingingBowl(baseFreq);
  }

  public playSacredBell(baseFreq: number = 852): void {
    this.playSingingBowl(baseFreq);
  }

  // Soft tactile click for UI buttons
  public playHapticTone(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Graceful fallback
    }
  }

  // Start continuous Web Audio real-time synthesized ambient soundscape
  public startAmbient(type: SoundType, volume: number = 0.6, frequency?: number): void {
    if (this.isMuted) return;
    this.stopAmbient();
    this.currentAmbientType = type;
    this.currentVolume = volume;
    if (frequency) {
      this.currentFrequency = frequency;
    }

    try {
      const ctx = this.getContext();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);
      this.ambientGain = masterGain;

      if (type === 'rain') {
        this.createRainSound(ctx, masterGain);
      } else if (type === 'waves') {
        this.createOceanWavesSound(ctx, masterGain);
      } else if (type === 'solfeggio') {
        this.createSolfeggioTone(ctx, masterGain, this.currentFrequency);
      } else if (type === 'crystal') {
        this.createCrystalDrone(ctx, masterGain, this.currentFrequency);
      } else if (type === 'birds') {
        this.createForestBirdsSound(ctx, masterGain);
      }
    } catch (e) {
      console.warn('Ambient sound engine error:', e);
    }
  }

  private createRainSound(ctx: AudioContext, destination: GainNode): void {
    // Generate pink noise buffer
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Dual cascade lowpass filters for warm rain sound
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.setValueAtTime(950, ctx.currentTime);

    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'highpass';
    filter2.frequency.setValueAtTime(200, ctx.currentTime);

    whiteNoise.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(destination);

    whiteNoise.start();
    this.ambientSources.push(whiteNoise);
  }

  private createOceanWavesSound(ctx: AudioContext, destination: GainNode): void {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.12;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Filter with LFO sweeping the cutoff to simulate wave ebb and flow
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec wave period

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(350, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(destination);

    lfo.start();
    noise.start();
    this.ambientSources.push(noise, lfo);
  }

  private createSolfeggioTone(ctx: AudioContext, destination: GainNode, freq: number = 528): void {
    // Binaural beating between freq and (freq + 3.5Hz) for deep meditative alpha-theta entrainment
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, ctx.currentTime);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq + 3.5, ctx.currentTime);

    const oscWarmth = ctx.createOscillator();
    oscWarmth.type = 'sine';
    oscWarmth.frequency.setValueAtTime(freq / 2, ctx.currentTime); // Sub-octave warm drone

    const oscHarmonic = ctx.createOscillator();
    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(freq * 1.5, ctx.currentTime); // Perfect fifth overtone

    const toneGain = ctx.createGain();
    toneGain.gain.setValueAtTime(0.18, ctx.currentTime);

    osc1.connect(toneGain);
    osc2.connect(toneGain);
    oscWarmth.connect(toneGain);
    oscHarmonic.connect(toneGain);
    toneGain.connect(destination);

    osc1.start();
    osc2.start();
    oscWarmth.start();
    oscHarmonic.start();

    this.ambientSources.push(osc1, osc2, oscWarmth, oscHarmonic);
    this.activeFrequencyOscillators = [
      { osc: osc1, multiplier: 1, offset: 0 },
      { osc: osc2, multiplier: 1, offset: 3.5 },
      { osc: oscWarmth, multiplier: 0.5, offset: 0 },
      { osc: oscHarmonic, multiplier: 1.5, offset: 0 },
    ];
  }

  private createCrystalDrone(ctx: AudioContext, destination: GainNode, freq: number = 432): void {
    const freqs = [
      { mult: 1, offset: 0, pan: -0.4 },
      { mult: 1.5, offset: 0, pan: 0.4 },
      { mult: 2, offset: 0, pan: 0 },
    ];
    this.activeFrequencyOscillators = [];

    freqs.forEach(({ mult, offset, pan }, idx) => {
      const osc = ctx.createOscillator();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const gain = ctx.createGain();

      const f = freq * mult + offset;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      gain.gain.setValueAtTime(0.14 / (idx + 1), ctx.currentTime);

      if (panner) {
        panner.pan.setValueAtTime(pan, ctx.currentTime);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(destination);
      } else {
        osc.connect(gain);
        gain.connect(destination);
      }

      osc.start();
      this.ambientSources.push(osc);
      this.activeFrequencyOscillators.push({ osc, multiplier: mult, offset });
    });
  }

  private createForestBirdsSound(ctx: AudioContext, destination: GainNode): void {
    // Base gentle breeze noise
    this.createRainSound(ctx, destination);

    // Periodic bird chirps schedule
    const scheduleChirp = () => {
      if (!this.currentAmbientType || this.currentAmbientType !== 'birds') return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const baseBirdFreq = 2400 + Math.random() * 1200;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseBirdFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseBirdFreq + 800, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(baseBirdFreq - 300, now + 0.16);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.09, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(destination);

        osc.start(now);
        osc.stop(now + 0.25);
      } catch {
        // Ignore
      }

      const nextTime = 1800 + Math.random() * 3200;
      const timer = window.setTimeout(scheduleChirp, nextTime);
      this.ambientSources.push(timer);
    };

    scheduleChirp();
  }

  public setAmbientVolume(vol: number): void {
    this.currentVolume = vol;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.1);
    }
  }

  public stopAmbient(): void {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      } catch {
        // Ignore
      }
    }

    this.activeFrequencyOscillators = [];

    setTimeout(() => {
      this.ambientSources.forEach((src) => {
        if (typeof src === 'number') {
          clearTimeout(src);
        } else if ('stop' in src && typeof (src as AudioScheduledSourceNode).stop === 'function') {
          try {
            (src as AudioScheduledSourceNode).stop();
            src.disconnect();
          } catch {
            // Ignore already stopped
          }
        }
      });
      this.ambientSources = [];
      this.currentAmbientType = null;
    }, 550);
  }

  public setSleepTimer(minutes: number, onTimerEnd?: () => void): void {
    if (this.sleepTimerId) {
      clearTimeout(this.sleepTimerId);
      this.sleepTimerId = null;
    }

    if (minutes > 0) {
      this.sleepTimerId = window.setTimeout(() => {
        this.stopAmbient();
        if (onTimerEnd) onTimerEnd();
      }, minutes * 60 * 1000);
    }
  }

  public getCurrentAmbient(): SoundType | null {
    return this.currentAmbientType;
  }

  // Voice Speech Synthesis for Affirmations & Mantras
  public speakText(text: string, lang: string = 'en-US', onEnd?: () => void): void {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.92; // Serene, measured cadence
        utterance.pitch = 1.0;
        if (onEnd) {
          utterance.onend = onEnd;
          utterance.onerror = onEnd;
        }
        window.speechSynthesis.speak(utterance);
      } else {
        this.playSingingBowl(528);
        if (onEnd) onEnd();
      }
    } catch {
      this.playSingingBowl(528);
      if (onEnd) onEnd();
    }
  }
}

export const soundEngine = new AudioSynthesizer();
