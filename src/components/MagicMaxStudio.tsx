import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wand2,
  Sparkles,
  Zap,
  Volume2,
  Bot,
  RefreshCw,
  Copy,
  Check,
  Flame,
  Star,
  Compass,
  Heart,
  Shield,
  Send,
  Radio,
} from 'lucide-react';
import { soundEngine } from '../services/audioSynthesizer';
import { useApp } from '../context/AppContext';

interface OracleCard {
  id: string;
  title: string;
  mantra: string;
  energyLevel: string;
  luckyHz: number;
  cosmicAdvice: string;
  color: string;
}

const ORACLE_CARDS: OracleCard[] = [
  {
    id: 'ora-1',
    title: 'The Golden Sun of Abundance',
    mantra: 'I am a magnet for boundless prosperity and sacred opportunities.',
    energyLevel: '98% High Vibration',
    luckyHz: 888,
    cosmicAdvice: 'Today is your day of sudden breakthroughs. Walk with supreme certainty.',
    color: 'from-[#8A6223] to-[#E5B558]',
  },
  {
    id: 'ora-2',
    title: 'The Lotus of Eternal Peace',
    mantra: 'My mind is a tranquil sanctuary undisturbed by worldly winds.',
    energyLevel: '100% Sacred Stillness',
    luckyHz: 528,
    cosmicAdvice: 'Take 3 deep conscious breaths before making any decision today.',
    color: 'from-[#6D5999] to-[#9E86D3]',
  },
  {
    id: 'ora-3',
    title: 'The Lion of Fearless Purpose',
    mantra: 'I step forward into my destiny with unshakable courage and grace.',
    energyLevel: '96% Divine Willpower',
    luckyHz: 963,
    cosmicAdvice: 'Release hesitation. The action you fear most holds your greatest reward.',
    color: 'from-[#A84457] to-[#DF7387]',
  },
  {
    id: 'ora-4',
    title: 'The Fountain of Cellular Healing',
    mantra: 'Divine life-force flows freely through every cell, restoring perfect health.',
    energyLevel: '99% Radiant Vitality',
    luckyHz: 639,
    cosmicAdvice: 'Nourish your body with pure water and gentle stillness today.',
    color: 'from-[#2E7D5A] to-[#60B88E]',
  },
];

const PRESET_INTENTIONS = [
  { label: 'Inner Peace', icon: '🕊️', defaultMantra: 'I am rooted in unshakable peace and divine serenity.', hz: 528 },
  { label: 'Abundance', icon: '✨', defaultMantra: 'Wealth and blessings flow into my reality effortlessly.', hz: 888 },
  { label: 'Self Love', icon: '💖', defaultMantra: 'I honor my sacred worth and celebrate my authentic light.', hz: 639 },
  { label: 'Confidence', icon: '🦁', defaultMantra: 'I am powerful, capable, and divinely guided to victory.', hz: 963 },
  { label: 'Healing', icon: '🌿', defaultMantra: 'My mind and body heal in harmony with infinite light.', hz: 432 },
  { label: 'Family Safety', icon: '🛡️', defaultMantra: 'My loved ones are shielded in unconditional safety and grace.', hz: 741 },
];

export const MagicMaxStudio: React.FC = () => {
  const { user, setUser } = useApp();
  const [selectedIntention, setSelectedIntention] = useState(PRESET_INTENTIONS[0]);
  const [customWish, setCustomWish] = useState('');
  const [generatedMantra, setGeneratedMantra] = useState<string>(PRESET_INTENTIONS[0].defaultMantra);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Oracle Draw State
  const [oracleIndex, setOracleIndex] = useState(0);
  const [isOracleFlipping, setIsOracleFlipping] = useState(false);

  // Magic Chat state
  const [messages, setMessages] = useState<Array<{ sender: 'max' | 'user'; text: string; time: string }>>([
    {
      sender: 'max',
      text: 'Greetings, radiant soul! I am Magic Max, your Sanctuary Alchemist. Ask me for a sacred mantra, spiritual clarity, or tap below to generate instant divine affirmations.',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const currentOracle = ORACLE_CARDS[oracleIndex];

  const handleGenerateMantra = () => {
    setIsGenerating(true);
    soundEngine.playTone(700, 0.1);

    setTimeout(() => {
      let result = '';
      if (customWish.trim()) {
        const templates = [
          `I am divinely aligned with ${customWish}. The universe conspires to bring it into my reality now.`,
          `With supreme confidence and gratitude, I welcome the manifestation of ${customWish}.`,
          `I am worthy and ready to receive the highest blessing of ${customWish} in peace.`,
        ];
        result = templates[Math.floor(Math.random() * templates.length)];
      } else {
        const pool: Record<string, string[]> = {
          'Inner Peace': [
            'I breathe in cosmic stillness and exhale all doubt, worry, and tension.',
            'My sanctuary is within me, unshakable and eternally luminous.',
            'I am the silent watcher of my thoughts, choosing harmony above all.',
          ],
          Abundance: [
            'Every dollar I spend returns to me multiplied through divine avenues.',
            'Abundance is my birthright; I receive prosperity with an open heart.',
            'I attract lucrative opportunities aligned with my highest integrity.',
          ],
          'Self Love': [
            'I release judgment and embrace every part of my sacred journey.',
            'I am enough, exactly as I am in this blessed moment.',
            'My heart radiates love, drawing pure and loving souls to my sphere.',
          ],
          Confidence: [
            'I stand tall in my divine power, commanding my world with grace.',
            'My voice carries wisdom, truth, and transformative influence.',
            'No obstacle is greater than the infinite power within me.',
          ],
          Healing: [
            'Vitality surges through my bloodstream, renewing every organ and tissue.',
            'I release all past pain and step into vibrant radiant health.',
            'My energy field is clean, vibrant, and impenetrable to negativity.',
          ],
          'Family Safety': [
            'A golden sphere of protection surrounds my home and every loved one.',
            'Love and understanding guide every conversation in my family circle.',
            'We are safe, united, and perpetually blessed with joy.',
          ],
        };
        const choices = pool[selectedIntention.label] || pool['Inner Peace'];
        result = choices[Math.floor(Math.random() * choices.length)];
      }

      setGeneratedMantra(result);
      setIsGenerating(false);
      soundEngine.playSingingBowl(selectedIntention.hz);
      setUser((u) => ({ ...u, karmaPoints: u.karmaPoints + 10 }));
    }, 600);
  };

  const handleDrawOracle = () => {
    setIsOracleFlipping(true);
    soundEngine.playTone(880, 0.2);
    setTimeout(() => {
      setOracleIndex((prev) => (prev + 1) % ORACLE_CARDS.length);
      setIsOracleFlipping(false);
      soundEngine.playSingingBowl(ORACLE_CARDS[(oracleIndex + 1) % ORACLE_CARDS.length].luckyHz);
      setUser((u) => ({ ...u, karmaPoints: u.karmaPoints + 15 }));
    }, 400);
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg = { sender: 'user' as const, text: userText, time: 'Just now' };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
    soundEngine.playHapticTone();

    // Magic Max automated intuitive reply
    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('peace') || lower.includes('stress') || lower.includes('anxious')) {
        reply = 'Breathe in for 4 seconds, hold for 4, and exhale for 6. Repeat this mantra: "I am safe in this moment. Peace is my natural state." 🕊️ (528Hz Solfeggio recommended)';
      } else if (lower.includes('money') || lower.includes('wealth') || lower.includes('abundance')) {
        reply = 'The frequency of wealth is gratitude! Speak aloud: "I celebrate the abundance already present in my life, and I joyfully welcome more." ✨ (888Hz active)';
      } else if (lower.includes('family') || lower.includes('child') || lower.includes('love')) {
        reply = 'Send a mental wave of golden light to your loved ones now. Declare: "Our home is a fortress of peace, protection, and unconditional love." 🛡️💖';
      } else {
        reply = `Magic Max sends you divine blessing for "${userText}". Focus on your heart center: "I trust the perfect divine orchestration of my path today." 🌟`;
      }

      setMessages((prev) => [...prev, { sender: 'max', text: reply, time: 'Just now' }]);
      soundEngine.playTone(600, 0.2);
    }, 700);
  };

  const handleCopyMantra = () => {
    navigator.clipboard?.writeText(generatedMantra);
    setCopied(true);
    soundEngine.playHapticTone();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full pb-24 animate-fadeIn">
      {/* Magic Max Header Banner */}
      <div className="px-4 pt-2 pb-4">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1E191A] to-[#2E2024] text-white border border-[#8A6223]/40 shadow-lg relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#A84457]/30 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#A84457] to-[#8A6223] flex items-center justify-center shadow-md">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h2 className="text-lg font-playfair font-bold">Magic Max</h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#8A6223]/30 text-[#E5B558] text-[9px] font-bold uppercase tracking-wider border border-[#8A6223]/50">
                    AI Alchemist
                  </span>
                </div>
                <p className="text-[11px] text-[#FAF7F5]/80">Sacred Affirmation & Divine Guidance Engine</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-[#FAF7F5]/60 uppercase font-bold">Karma XP</div>
              <div className="text-sm font-bold text-[#E5B558] flex items-center justify-end space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{user.karmaPoints}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-5">
        {/* SECTION 1: Magic Affirmation Alchemist */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#A84457]" />
              <h3 className="text-sm font-playfair font-bold text-[#1F1617] dark:text-[#FAF7F5]">
                Instant Mantra Generator
              </h3>
            </div>
            <span className="text-[10px] font-semibold text-[#8A6223]">528Hz - 963Hz</span>
          </div>

          {/* Intention Pills */}
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {PRESET_INTENTIONS.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  soundEngine.playHapticTone();
                  setSelectedIntention(item);
                }}
                className={`py-2 px-2 rounded-xl text-[11px] font-medium flex items-center justify-center space-x-1 transition-all ${
                  selectedIntention.label === item.label
                    ? 'bg-[#A84457] text-white shadow-2xs font-semibold'
                    : 'bg-[#FAF7F2] dark:bg-[#251F21] text-[#7C706D] dark:text-[#A89F9E] border border-[#EFE9DF] dark:border-[#3E3437] hover:border-[#8A6223]/40'
                }`}
              >
                <span>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Custom Wish Input */}
          <div className="mb-3">
            <input
              type="text"
              value={customWish}
              onChange={(e) => setCustomWish(e.target.value)}
              placeholder="Or type your specific desire/goal (e.g., passing exam, inner joy)..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F21] border border-[#EFE9DF] dark:border-[#3E3437] text-xs focus:outline-none focus:border-[#8A6223] placeholder:text-[#A89F9E]"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateMantra}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#A84457] to-[#8A6223] text-white text-xs font-semibold shadow-sm flex items-center justify-center space-x-2 hover:opacity-95 transition-opacity active:scale-[0.99]"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Channeling Magic Max...' : 'Alchemize Sacred Mantra (+10 XP)'}</span>
          </button>

          {/* Generated Result Display Card */}
          {generatedMantra && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3.5 p-4 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-white dark:from-[#251F21] dark:to-[#1E191A] border border-[#EFE9DF] dark:border-[#3E3437] shadow-2xs relative"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A84457]">
                  Magic Max Channeling
                </span>
                <span className="text-[10px] font-semibold text-[#8A6223]">{selectedIntention.hz} Hz Tuning</span>
              </div>

              <p className="text-xs font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5] leading-relaxed italic">
                "{generatedMantra}"
              </p>

              <div className="mt-3 pt-2 border-t border-[#EFE9DF]/80 dark:border-[#362D30] flex items-center justify-between">
                <button
                  onClick={() => soundEngine.speakText(generatedMantra)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#3E3437] text-[10px] font-semibold text-[#1F1617] dark:text-[#FAF7F5] flex items-center space-x-1 hover:border-[#8A6223]"
                >
                  <Volume2 className="w-3 h-3 text-[#A84457]" />
                  <span>Recite Mantra</span>
                </button>

                <button
                  onClick={handleCopyMantra}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#3E3437] text-[10px] font-semibold text-[#7C706D] flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* SECTION 2: Daily Cosmic Oracle Card Pull */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-[#8A6223]" />
              <h3 className="text-sm font-playfair font-bold text-[#1F1617] dark:text-[#FAF7F5]">
                Cosmic Oracle Draw
              </h3>
            </div>
            <button
              onClick={handleDrawOracle}
              className="text-[11px] text-[#A84457] dark:text-[#D47185] font-semibold flex items-center space-x-1 hover:underline"
            >
              <RefreshCw className={`w-3 h-3 ${isOracleFlipping ? 'animate-spin' : ''}`} />
              <span>Draw Card (+15 XP)</span>
            </button>
          </div>

          <motion.div
            key={currentOracle.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-2xl bg-gradient-to-br ${currentOracle.color} text-white shadow-md relative overflow-hidden`}
          >
            <div className="flex items-center justify-between text-xs opacity-90 mb-2">
              <span className="font-bold tracking-wider text-[10px] uppercase">Daily Celestial Guide</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-bold">
                {currentOracle.energyLevel}
              </span>
            </div>

            <h4 className="text-base font-playfair font-bold mb-1">{currentOracle.title}</h4>
            <p className="text-xs font-medium italic opacity-95 mb-3">"{currentOracle.mantra}"</p>

            <div className="p-2.5 rounded-xl bg-black/20 backdrop-blur-xs text-[11px] leading-relaxed border border-white/10">
              <span className="font-bold">Cosmic Advice: </span>
              {currentOracle.cosmicAdvice}
            </div>
          </motion.div>
        </div>

        {/* SECTION 3: Ask Magic Max Direct Guidance Chat */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <Bot className="w-4 h-4 text-[#6D5999]" />
            <h3 className="text-sm font-playfair font-bold text-[#1F1617] dark:text-[#FAF7F5]">
              Ask Magic Max For Clarity
            </h3>
          </div>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 mb-3 scrollbar-thin">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#A84457] text-white rounded-br-none'
                      : 'bg-[#FAF7F2] dark:bg-[#251F21] text-[#1F1617] dark:text-[#FAF7F5] border border-[#EFE9DF] dark:border-[#3E3437] rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-[#7C706D] mt-0.5 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex items-center space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Max about stress, wealth, family..."
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F21] border border-[#EFE9DF] dark:border-[#3E3437] text-xs focus:outline-none focus:border-[#8A6223] placeholder:text-[#A89F9E]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-2xl bg-[#A84457] text-white hover:bg-[#93394b] transition-colors shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
