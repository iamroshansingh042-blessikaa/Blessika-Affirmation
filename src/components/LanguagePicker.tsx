import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Globe2, Volume2, VolumeX, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { Language } from '../types';
import { soundEngine } from '../services/audioSynthesizer';
import { speechService } from '../services/speechService';

export const LanguagePicker: React.FC = () => {
  const { currentLang, setLanguage, setStage, isMuted, toggleMute, t } = useApp();
  const [selectedLang, setSelectedLang] = useState<Language>(currentLang);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const handleSelect = (lang: Language) => {
    setSelectedLang(lang);
    setLanguage(lang);
  };

  const handleVoicePreview = (e: React.MouseEvent, lang: Language) => {
    e.stopPropagation();
    soundEngine.playTone(528, 0.2);
    setIsPlayingPreview(true);
    speechService.speak(lang.previewQuote, lang.phonetic, () => {
      setIsPlayingPreview(false);
    });
  };

  const handleContinue = () => {
    soundEngine.playSingingBowl(528);
    try {
      localStorage.setItem('BLESSIKAA_ONBOARDED', 'true');
    } catch {
      // ignore
    }
    setStage('home');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-6 bg-[#FAF7F2] dark:bg-[#141112] text-[#1F1617] dark:text-[#FAF7F5] max-w-md mx-auto">
      {/* Header with Mute button */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-[#8A6223] dark:text-[#B88B46]">
            <Globe2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Sacred Voice & Language
            </span>
          </div>

          <button
            onClick={() => toggleMute()}
            className={`p-2 rounded-full border shadow-xs transition-all ${
              isMuted
                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 border-red-200 dark:border-red-900/50'
                : 'bg-white dark:bg-[#1E191A] text-[#8A6223] border-[#EFE9DF] dark:border-[#362D30]'
            }`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-playfair font-semibold tracking-tight text-[#1F1617] dark:text-[#FAF7F5]">
          {t('selectLanguage')}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#7C706D] dark:text-[#A89F9E] font-sans">
          {t('languageSubtitle')}
        </p>
      </div>

      {/* Grid of Languages */}
      <div className="my-6 grid grid-cols-2 gap-3 max-h-[46vh] overflow-y-auto pr-1 no-scrollbar">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLang.code === lang.code;
          return (
            <motion.div
              key={lang.code}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(lang)}
              className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#A84457] bg-white dark:bg-[#1E191A] shadow-md ring-2 ring-[#A84457]/20'
                  : 'border-[#EFE9DF] dark:border-[#362D30] bg-[#FFFFFF]/70 dark:bg-[#1E191A]/60 hover:border-[#8A6223]/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{lang.flag}</span>
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-[#A84457] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <button
                    onClick={(e) => handleVoicePreview(e, lang)}
                    className="p-1 rounded-full text-[#7C706D] hover:text-[#A84457] transition-colors"
                    title="Listen to phonetics"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-3">
                <div className="text-sm font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
                  {lang.nativeName}
                </div>
                <div className="text-xs text-[#7C706D] dark:text-[#A89F9E] flex items-center space-x-1">
                  <span>{lang.name}</span>
                  {lang.dir === 'rtl' && (
                    <span className="text-[10px] bg-[#EFE9DF] dark:bg-[#362D30] px-1 rounded text-[#8A6223]">
                      RTL
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Live Preview Quote Box */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-sm mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A6223] dark:text-[#B88B46] flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Live Sanctuary Preview
          </span>
          <button
            onClick={(e) => handleVoicePreview(e, selectedLang)}
            disabled={isPlayingPreview}
            className="flex items-center space-x-1 text-xs text-[#A84457] dark:text-[#D47185] font-medium hover:underline"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingPreview ? 'animate-bounce' : ''}`} />
            <span>{isPlayingPreview ? t('speaking') : t('listen')}</span>
          </button>
        </div>
        <p className="text-sm font-garamond italic text-[#1F1617] dark:text-[#FAF7F5] leading-relaxed">
          &ldquo;{selectedLang.previewQuote}&rdquo;
        </p>
      </div>

      {/* CTA Button */}
      <div className="pb-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          className="w-full px-6 py-3.5 rounded-full bg-[#A84457] hover:bg-[#8F394A] text-white font-medium text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg shadow-[#A84457]/25 transition-colors"
        >
          <span>
            {t('continueInLang')} {selectedLang.nativeName}
          </span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
