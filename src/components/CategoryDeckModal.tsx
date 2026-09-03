import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Bookmark,
  Check,
  Radio,
  Sliders,
} from 'lucide-react';
import { CategoryDefinition } from '../data/categoryData';
import { CategoryArtwork } from './CategoryArtwork';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../services/audioSynthesizer';
import { speechService } from '../services/speechService';
import { getLocalizedAffirmation } from '../i18n/affirmationTranslations';

interface CategoryDeckModalProps {
  category: CategoryDefinition;
  onClose: () => void;
}

export const CategoryDeckModal: React.FC<CategoryDeckModalProps> = ({ category, onClose }) => {
  const { currentLang, toggleFavoriteAffirmation, activeAmbient, t } = useApp();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [currentHz, setCurrentHz] = useState<number>(category.frequencyHz);
  const [isToneActive, setIsToneActive] = useState<boolean>(false);

  const affirmations = category.sampleAffirmations.length > 0 ? category.sampleAffirmations : [category.quote];
  const activeAffirmation = affirmations[activeIndex] || affirmations[0];
  const localizedAffirmation = getLocalizedAffirmation(activeAffirmation, currentLang.code);

  // Play category singing bowl chime & retune frequency on open
  useEffect(() => {
    soundEngine.setFrequency(category.frequencyHz);
    soundEngine.playSingingBowl(category.frequencyHz);
    setCurrentHz(category.frequencyHz);
    return () => {
      speechService.stop();
    };
  }, [category]);

  const handleNext = () => {
    soundEngine.playHapticTone();
    setActiveIndex((prev) => (prev + 1) % affirmations.length);
  };

  const handlePrev = () => {
    soundEngine.playHapticTone();
    setActiveIndex((prev) => (prev - 1 + affirmations.length) % affirmations.length);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else {
      soundEngine.playTone(currentHz, 0.15);
      setIsSpeaking(true);
      speechService.speak(
        `${category.name}. ${localizedAffirmation}`,
        currentLang.phonetic || 'en-US',
        () => setIsSpeaking(false)
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(localizedAffirmation);
    setCopiedText(true);
    soundEngine.playHapticTone();
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleFrequencyChange = (hz: number) => {
    setCurrentHz(hz);
    soundEngine.setFrequency(hz);
    soundEngine.playTone(hz, 0.35);
  };

  const FREQUENCIES = [
    { hz: 396, label: '396 Hz • Liberation' },
    { hz: 417, label: '417 Hz • Renewal' },
    { hz: 432, label: '432 Hz • Miracle Peace' },
    { hz: 528, label: '528 Hz • DNA Transformation' },
    { hz: 639, label: '639 Hz • Heart Harmony' },
    { hz: 741, label: '741 Hz • Awakening Intuition' },
    { hz: 852, label: '852 Hz • Pure Spirit' },
    { hz: 963, label: '963 Hz • Divine Oneness' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        className="w-full max-w-sm max-h-[92vh] flex flex-col rounded-3xl overflow-hidden bg-gradient-to-b from-[#1E191A] via-[#241E20] to-[#171314] border border-[#3D3335] shadow-2xl text-[#FAF7F5]"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#A84457]/30 text-[#D47185] border border-[#A84457]/40">
              {category.sectionTitle}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Visual Header Artwork Card */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-md border border-white/10">
            <CategoryArtwork theme={category.iconTheme} name={category.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-black/60 text-[#FFE5A3] backdrop-blur-sm border border-white/10">
                  {currentHz} Hz Attuned
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white/80">
                  {category.affirmationCount} Mantras
                </span>
              </div>
              <div>
                <h2 className="text-xl font-playfair font-bold text-white leading-tight drop-shadow-md">
                  {category.name}
                </h2>
                <p className="text-xs text-white/80 line-clamp-1 mt-0.5">{category.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Active Affirmation Deck Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-white/50 mb-2">
              <span className="flex items-center space-x-1 text-[#E09F3E] font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sacred Declaration</span>
              </span>
              <span>
                {activeIndex + 1} / {affirmations.length}
              </span>
            </div>

            <p className="text-base sm:text-lg font-playfair font-medium text-white leading-relaxed my-2">
              &ldquo;{localizedAffirmation}&rdquo;
            </p>

            {/* Deck Controls */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handleSpeak}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 transition-colors ${
                    isSpeaking
                      ? 'bg-[#A84457] text-white animate-pulse'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? 'Listening...' : 'Listen'}</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                  title="Copy Affirmation"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Prev / Next Card Buttons */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Solfeggio Sound Frequency Tuning Matrix */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#FFE5A3] flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5" />
                <span>Retune Sound Frequency</span>
              </span>
              <span className="text-[11px] font-mono text-white/60">{currentHz} Hz</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {FREQUENCIES.map((freq) => {
                const isSelected = currentHz === freq.hz;
                return (
                  <button
                    key={freq.hz}
                    onClick={() => handleFrequencyChange(freq.hz)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#8A6223] text-white font-semibold shadow-sm border border-[#FFE5A3]/40'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 border border-transparent'
                    }`}
                  >
                    <span className="truncate">{freq.label}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase bg-gradient-to-r from-[#8A6223] to-[#A84457] text-white shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Carry In Your Heart
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
