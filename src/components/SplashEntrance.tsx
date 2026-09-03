import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Sun, Volume2, VolumeX, Globe2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../services/audioSynthesizer';
import { LanguageModal } from './LanguageModal';

export const SplashEntrance: React.FC = () => {
  const { setStage, isMuted, toggleMute, currentLang, t } = useApp();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  useEffect(() => {
    // Play sacred singing bowl on entrance if not muted
    if (!isMuted) {
      soundEngine.playSingingBowl(528);
    }
  }, [isMuted]);

  const handleEnterSanctuary = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playSingingBowl(528);
    try {
      localStorage.setItem('BLESSIKAA_ONBOARDED', 'true');
    } catch {
      // ignore
    }
    setStage('home');
  };

  const handleSelectLanguage = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playHapticTone();
    setIsLangModalOpen(true);
  };

  return (
    <div
      id="splash-screen"
      onClick={handleEnterSanctuary}
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#FAF7F2] via-[#F6F0E6] to-[#EFE7D8] dark:from-[#141112] dark:via-[#1A1517] dark:to-[#120F10] cursor-pointer overflow-hidden select-none"
    >
      {/* Ambient floating particle stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#8A6223]/20 dark:bg-[#B88B46]/30"
            style={{
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Top Controls Bar with Mute Audio & Language */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full flex items-center justify-between pt-2 z-20"
      >
        <div className="flex items-center space-x-1.5 text-[#8A6223] dark:text-[#B88B46]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="text-[11px] font-bold tracking-widest uppercase font-sans">
            528Hz Sacred Sanctuary
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mute / Unmute Audio Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className={`p-2 rounded-full border shadow-xs transition-all ${
              isMuted
                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 border-red-200 dark:border-red-900/50'
                : 'bg-white/80 dark:bg-[#1E191A]/80 text-[#8A6223] border-[#EFE9DF] dark:border-[#362D30]'
            }`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Language Selection Button */}
          <button
            onClick={handleSelectLanguage}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-[#1E191A]/80 border border-[#EFE9DF] dark:border-[#362D30] text-xs font-semibold text-[#1F1617] dark:text-[#FAF7F5] shadow-xs hover:border-[#8A6223]/50 transition-colors"
            title="Switch Language"
          >
            <Globe2 className="w-3.5 h-3.5 text-[#8A6223]" />
            <span>{currentLang.flag} {currentLang.nativeName}</span>
          </button>
        </div>
      </motion.div>

      {/* Center Pulsating Sacred Lotus Emblem */}
      <motion.div
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="flex flex-col items-center text-center my-auto z-10"
      >
        <div className="relative mb-6 flex items-center justify-center">
          {/* Outer dual-ring glow */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#A84457]/30 to-[#8A6223]/30 blur-xl animate-sacred-pulse" />

          {/* Dual ring gold/rose border */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-[#A84457] via-[#8A6223] to-[#476655] shadow-2xl flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#FAF7F2] dark:bg-[#1E191A] p-2 flex items-center justify-center border-2 border-[#EFE9DF]/80 dark:border-[#362D30]">
              {/* Sacred Lotus Icon SVG */}
              <svg
                viewBox="0 0 100 100"
                className="w-16 h-16 sm:w-20 sm:h-20 text-[#A84457] dark:text-[#D47185] drop-shadow"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Lotus Petals */}
                <path
                  d="M50 20 C42 35 44 65 50 82 C56 65 58 35 50 20 Z"
                  fill="currentColor"
                  fillOpacity="0.18"
                />
                <path
                  d="M50 82 C32 68 20 48 30 32 C38 42 45 60 50 82 Z"
                  fill="currentColor"
                  fillOpacity="0.12"
                />
                <path
                  d="M50 82 C68 68 80 48 70 32 C62 42 55 60 50 82 Z"
                  fill="currentColor"
                  fillOpacity="0.12"
                />
                <path
                  d="M50 82 C22 75 12 58 18 48 C28 52 40 68 50 82 Z"
                  strokeWidth="1.8"
                />
                <path
                  d="M50 82 C78 75 88 58 82 48 C72 52 60 68 50 82 Z"
                  strokeWidth="1.8"
                />
                <circle cx="50" cy="50" r="4" fill="#8A6223" />
              </svg>
            </div>
          </div>
        </div>

        {/* Brand Name Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl font-playfair font-semibold tracking-tight text-[#1F1617] dark:text-[#FAF7F5]"
        >
          {t('appName') || 'Blessikaa'}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-2 text-base sm:text-lg font-garamond italic font-normal text-[#8A6223] dark:text-[#B88B46] tracking-wide"
        >
          &ldquo;{t('tagline') || 'Building a Blessed Life!'}&rdquo;
        </motion.p>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-2 text-xs sm:text-sm font-sans font-medium text-[#7C706D] dark:text-[#A89F9E] max-w-xs"
        >
          {t('subTagline') || 'Sanctuary for Body, Mind & Family'}
        </motion.p>
      </motion.div>

      {/* Bottom Entrance Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-full pb-4 flex flex-col items-center space-y-3 z-20"
      >
        <button
          onClick={handleEnterSanctuary}
          className="w-full py-3.5 px-6 rounded-full bg-[#A84457] hover:bg-[#8F394A] text-white font-semibold text-sm shadow-lg shadow-[#A84457]/25 flex items-center justify-center space-x-2 transition-transform active:scale-98"
        >
          <Sun className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '10s' }} />
          <span>{t('tapToEnter') || 'Enter Sanctuary'}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        <div className="flex items-center space-x-2 text-[11px] text-[#7C706D] dark:text-[#A89F9E]">
          <span>Tap anywhere to step into sanctuary</span>
        </div>
      </motion.div>

      {/* In-App Language Selection Modal */}
      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />
    </div>
  );
};

