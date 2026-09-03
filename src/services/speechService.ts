import { soundEngine } from './audioSynthesizer';

class SpeechService {
  private isSpeaking: boolean = false;

  public speak(text: string, lang: string = 'en-US', onEnd?: () => void): void {
    if (soundEngine.getMuted()) {
      if (onEnd) onEnd();
      return;
    }
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.88; // Meditative, calm pacing
    utterance.pitch = 1.0;
    utterance.volume = 0.95;

    // Try to find a warm, natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => (v.lang.startsWith(lang.slice(0, 2)) || v.lang === lang) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Serena'))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    this.isSpeaking = true;

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const speechService = new SpeechService();
