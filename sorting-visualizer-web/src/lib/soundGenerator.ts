// Web Audio API based sound generator
class SoundGenerator {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  play(frequency: number, duration: number = 50) {
    if (!this.audioContext) return;

    // Stop any currently playing sound
    this.stop();

    // Create oscillator
    this.oscillator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();

    // Configure oscillator
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    // Configure gain (volume)
    this.gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration / 1000
    );

    // Connect nodes
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    // Start and stop
    this.oscillator.start(this.audioContext.currentTime);
    this.oscillator.stop(this.audioContext.currentTime + duration / 1000);

    this.isPlaying = true;

    // Clean up
    this.oscillator.onended = () => {
      this.isPlaying = false;
      this.oscillator = null;
      this.gainNode = null;
    };
  }

  stop() {
    if (this.oscillator && this.isPlaying) {
      try {
        this.oscillator.stop();
      } catch (e) {
        // Ignore error if already stopped
      }
      this.oscillator = null;
      this.gainNode = null;
      this.isPlaying = false;
    }
  }

  // Convert array value to frequency
  valueToFrequency(value: number, min: number, max: number): number {
    // Map value to frequency range (200Hz - 800Hz)
    const minFreq = 200;
    const maxFreq = 800;
    const normalized = (value - min) / (max - min);
    return minFreq + normalized * (maxFreq - minFreq);
  }
}

export const soundGenerator = new SoundGenerator();
