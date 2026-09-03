import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Globe2, Volume2, VolumeX, X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { Language } from '../types';
import { soundEngine } from '../services/audioSynthesizer';
import { speechService } from '../services/speechService';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { currentLang, setLanguage, isMuted, toggleMute, t } = useApp();
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    soundEngine.playHapticTone();
  };

  const handleVoicePreview = (e: React.MouseEvent, lang: Language) => {
    e.stopPropagation();
    soundEngine.playTone(528, 0.2);
    setIsPlayingPreview(true);
    speechService.speak(lang.previewQuote, lang.phonetic, () => {
      setIsPlayingPreview(false);
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-[#FAF7F2] dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-2xl p-5 relative overflow-hidden"
        >
          {/* Top Bar with Mute Toggle & Close */}
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DF] dark:border-[#362D30]">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-[#8A6223]/10 text-[#8A6223] flex items-center justify-center">
                <Globe2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-playfair font-bold text-[#1F1617] dark:text-[#FAF7F5]">
                  {t('selectLanguage')}
                </h3>
                <p className="text-[10px] text-[#7C706D] dark:text-[#A89F9E]">
                  Select mother tongue & voice dialect
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Mute Audio Toggle Button */}
              <button
                onClick={() => {
                  toggleMute();
                }}
                className={`p-2 rounded-xl border transition-all ${
                  isMuted
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-600 border-red-200 dark:border-red-900/50'
                    : 'bg-white dark:bg-[#282224] text-[#8A6223] border-[#EFE9DF] dark:border-[#3E3437]'
                }`}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  soundEngine.playHapticTone();
                  onClose();
                }}
                className="p-2 rounded-xl bg-white dark:bg-[#282224] border border-[#EFE9DF] dark:border-[#3E3437] text-[#7C706D] hover:text-[#1F1617] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid of Languages */}
          <div className="my-3 grid grid-cols-2 gap-2.5 overflow-y-auto max-h-[48vh] pr-1 py-1 no-scrollbar">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentLang.code === lang.code;
              return (
                <motion.div
                  key={lang.code}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(lang)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#A84457] bg-white dark:bg-[#282224] shadow-md ring-2 ring-[#A84457]/20'
                      : 'border-[#EFE9DF] dark:border-[#362D30] bg-[#FFFFFF]/70 dark:bg-[#221C1E]/60 hover:border-[#8A6223]/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xl">{lang.flag}</span>
                    {isSelected ? (
                      <div className="w-4 h-4 rounded-full bg-[#A84457] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleVoicePreview(e, lang)}
                        className="p-1 rounded-full text-[#7C706D] hover:text-[#A84457] transition-colors"
                        title="Preview phonetics"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="text-xs font-bold text-[#1F1617] dark:text-[#FAF7F5]">
                      {lang.nativeName}
                    </div>
                    <div className="text-[10px] text-[#7C706D] dark:text-[#A89F9E] flex items-center space-x-1">
                      <span>{lang.name}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Current Selection Live Preview Banner */}
          <div className="p-3 rounded-2xl bg-white dark:bg-[#282224] border border-[#EFE9DF] dark:border-[#3E3437] shadow-2xs mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A6223] dark:text-[#B88B46] flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                Selected: {currentLang.flag} {currentLang.nativeName} ({currentLang.name})
              </span>
              <button
                onClick={(e) => handleVoicePreview(e, currentLang)}
                disabled={isPlayingPreview}
                className="flex items-center space-x-1 text-[10px] text-[#A84457] dark:text-[#D47185] font-semibold hover:underline"
              >
                <Volume2 className={`w-3 h-3 ${isPlayingPreview ? 'animate-bounce' : ''}`} />
                <span>{isPlayingPreview ? t('speaking') : t('listen')}</span>
              </button>
            </div>
            <p className="text-xs font-garamond italic text-[#1F1617] dark:text-[#FAF7F5]">
              &ldquo;{currentLang.previewQuote}&rdquo;
            </p>
          </div>

          {/* Save / Apply Button */}
          <button
            onClick={() => {
              soundEngine.playSingingBowl(528);
              onClose();
            }}
            className="w-full py-2.5 rounded-2xl bg-[#A84457] hover:bg-[#8F394A] text-white text-xs font-semibold shadow-md shadow-[#A84457]/20 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Apply {currentLang.nativeName}</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
