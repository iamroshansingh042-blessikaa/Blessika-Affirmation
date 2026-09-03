import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ChevronDown,
  Flame,
  Globe2,
  Moon,
  Sparkles,
  Sun,
  Heart,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AffirmationCardDeck } from './AffirmationCardDeck';
import { CategoryExplorer } from './CategoryExplorer';
import { MagicMaxStudio } from './MagicMaxStudio';
import { MyArtStudio } from './MyArtStudio';
import { ProfileScreen } from './ProfileScreen';
import { StickyNavDock } from './StickyNavDock';
import { LanguageModal } from './LanguageModal';
import { ProfileType } from '../types';
import { soundEngine } from '../services/audioSynthesizer';

export const SanctuaryHomeScreen: React.FC = () => {
  const {
    user,
    switchProfile,
    isDarkMode,
    setIsDarkMode,
    isMuted,
    toggleMute,
    currentLang,
    navTab,
    setNavTab,
    t,
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Time-aware greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return t('goodMorning');
    if (hours < 18) return t('goodAfternoon');
    return t('goodEvening');
  };

  const PROFILES: { role: ProfileType; label: string }[] = [
    { role: 'personal', label: 'Personal (Elena)' },
    { role: 'partner', label: 'Partner (Julian)' },
    { role: 'child', label: 'Child (Liam)' },
    { role: 'caregiver', label: 'Caregiver (Sarah)' },
    { role: 'elderly', label: 'Elderly (Maya)' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] dark:bg-[#141112] text-[#1F1617] dark:text-[#FAF7F5] max-w-md mx-auto relative selection:bg-[#A84457]/20 flex flex-col">
      {/* Top Header & Status Bar (hidden when in full-bleed My Art studio) */}
      {navTab !== 'my_art' && (
        <header
          id="top-header"
          className="sticky top-0 z-30 px-4 py-3 bg-[#FAF7F2]/90 dark:bg-[#141112]/90 backdrop-blur-md border-b border-[#EFE9DF]/80 dark:border-[#362D30] flex items-center justify-between"
        >
        {/* Profile Switcher Trigger on Home, or Back Button on sub-screens */}
        {navTab !== 'home' ? (
          <button
            onClick={() => {
              soundEngine.playHapticTone();
              setNavTab('home');
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-2xs hover:border-[#A84457]/50 transition-all text-xs font-semibold text-[#1F1617] dark:text-[#FAF7F5]"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4 text-[#A84457]" />
            <span>Home</span>
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => {
                soundEngine.playHapticTone();
                setShowProfileMenu(!showProfileMenu);
              }}
              className="flex items-center space-x-2 p-1 pl-1.5 pr-2.5 rounded-full bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-2xs hover:border-[#8A6223]/50 transition-all"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-[#8A6223]"
              />
              <span className="text-xs font-semibold text-[#1F1617] dark:text-[#FAF7F5] max-w-[80px] truncate">
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7C706D]" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute left-0 top-11 z-40 w-48 py-1.5 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-xl text-xs space-y-0.5">
                <div className="px-3 py-1 font-bold text-[10px] uppercase text-[#8A6223] tracking-wider border-b border-[#EFE9DF] dark:border-[#362D30]">
                  Switch Sanctuary Role
                </div>
                {PROFILES.map((p) => (
                  <button
                    key={p.role}
                    onClick={() => {
                      switchProfile(p.role);
                      setShowProfileMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                      user.role === p.role
                        ? 'bg-[#A84457] text-white font-semibold'
                        : 'hover:bg-[#FAF7F2] dark:hover:bg-[#262022]'
                    }`}
                  >
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Streak & Karma Badges & Actions */}
        <div className="flex items-center space-x-1.5">
          {/* Day Streak */}
          <div
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] text-xs font-bold text-[#A84457] shadow-2xs"
            title="Daily Active Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-[#A84457]" />
            <span>{user.streakCount}d</span>
          </div>

          {/* Karma XP Points */}
          <div
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] text-xs font-bold text-[#8A6223] shadow-2xs"
            title="Blessing Karma Points"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8A6223]" />
            <span>{user.karmaPoints}</span>
          </div>

          {/* Mute Audio Toggle */}
          <button
            onClick={() => {
              toggleMute();
            }}
            className={`p-2 rounded-full border transition-all ${
              isMuted
                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 border-red-200 dark:border-red-900/50'
                : 'bg-white dark:bg-[#1E191A] border-[#EFE9DF] dark:border-[#362D30] text-[#7C706D] hover:text-[#8A6223]'
            }`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Theme Mode Toggle */}
          <button
            onClick={() => {
              soundEngine.playHapticTone();
              setIsDarkMode(!isDarkMode);
            }}
            className="p-2 rounded-full bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] text-[#7C706D] hover:text-[#1F1617] transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#8A6223]" /> : <Moon className="w-4 h-4 text-[#6D5999]" />}
          </button>

          {/* Language Switch Button */}
          <button
            onClick={() => {
              soundEngine.playHapticTone();
              setIsLanguageModalOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] text-xs font-medium text-[#7C706D] hover:text-[#A84457] transition-colors"
            title="Switch Language"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">{currentLang.flag}</span>
          </button>
        </div>
      </header>
      )}

      {/* Main Dynamic View Area based on NavTab */}
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          {navTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-4 space-y-4 pb-24"
            >
              {/* Welcoming Headline */}
              <div className="pt-1 px-1">
                <h1 className="text-xl sm:text-2xl font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5] tracking-tight">
                  {getGreeting()}
                </h1>
                <p className="text-xs text-[#7C706D] dark:text-[#A89F9E] mt-0.5">
                  Your sacred space for daily "Believe / I Am" affirmations, holy frequencies & peaceful mindfulness.
                </p>
              </div>

              {/* ONLY Believe / I Am Affirmation Deck on Home Screen */}
              <section id="affirmation-section">
                <AffirmationCardDeck />
              </section>
            </motion.div>
          )}

          {navTab === 'category' && (
            <motion.div
              key="tab-category"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryExplorer />
            </motion.div>
          )}

          {navTab === 'magic_max' && (
            <motion.div
              key="tab-magic_max"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <MagicMaxStudio />
            </motion.div>
          )}

          {navTab === 'my_art' && (
            <motion.div
              key="tab-my_art"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <MyArtStudio />
            </motion.div>
          )}

          {navTab === 'profile' && (
            <motion.div
              key="tab-profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sticky 5-Tab Navigation Dock - Visible ONLY on Home screen */}
      {navTab === 'home' && <StickyNavDock />}

      {/* In-App Language Selection Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />
    </div>
  );
};
