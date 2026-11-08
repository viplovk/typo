/**
 * Minimal Web Audio synthesizer for kinetic typography tactile feedback.
 * Provides micro-clicks, frequency sweeps, and acoustic resonance on interaction.
 * Muted by default; enabled on user opt-in.
 */

class KineticSoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on user interaction
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    } catch {
      // AudioContext unavailable
    }
  }

  public toggleSound(): boolean {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isEnabled = !this.isEnabled;
    if (this.isEnabled) {
      this.playChirp(880, 0.05);
    }
    return this.isEnabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Tactile micro-click for letter hover / button tap
   */
  public playClick(pitch: number = 1200) {
    if (!this.isEnabled || !this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio error ignored
    }
  }

  /**
   * Frequency slide for slider or cursor movement
   */
  public playChirp(freq: number = 440, duration: number = 0.08) {
    if (!this.isEnabled || !this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio error ignored
    }
  }

  /**
   * Sub-bass kinetic pulse on section trigger or mode change
   */
  public playThump() {
    if (!this.isEnabled || !this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // Audio error ignored
    }
  }
}

export const soundEngine = new KineticSoundEngine();
