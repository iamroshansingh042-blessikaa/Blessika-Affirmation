import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  Sparkles,
  Lock,
  Shuffle,
  Layers,
  Save,
  LogOut,
  Palette,
} from 'lucide-react';
import { ArtTheme, ThemeCategory } from '../types';
import { ART_THEMES } from '../data/artThemesData';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../services/audioSynthesizer';

interface ChooseYourArtScreenProps {
  onOpenCustomCreator: () => void;
}

export const ChooseYourArtScreen: React.FC<ChooseYourArtScreenProps> = ({ onOpenCustomCreator }) => {
  const { setNavTab, activeThemeId, setActiveThemeId, customThemes, activeArtTheme } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const initialThemeIdRef = useRef<string>(activeThemeId);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const handleSelectTheme = (theme: ArtTheme) => {
    soundEngine.playTibetanBowl();
    setActiveThemeId(theme.id);
    showToast(`"${theme.name}" applied to your sanctuary!`);
  };

  const handleRandomTheme = () => {
    soundEngine.playSacredBell();
    const allThemes = [...customThemes, ...ART_THEMES];
    const eligible = allThemes.filter((t) => t.id !== activeThemeId);
    const chosen = eligible[Math.floor(Math.random() * eligible.length)] || allThemes[0];
    setActiveThemeId(chosen.id);
    showToast(`Surprise: "${chosen.name}" selected!`);
  };

  const handleHeaderCloseClick = () => {
    soundEngine.playHapticTone();
    setShowExitModal(true);
  };

  const handleSaveAndExit = () => {
    soundEngine.playSacredBell();
    setShowExitModal(false);
    showToast(`Active art theme saved!`);
    setNavTab('home');
  };

  const handleDiscardAndExit = () => {
    soundEngine.playHapticTone();
    if (initialThemeIdRef.current) {
      setActiveThemeId(initialThemeIdRef.current);
    }
    setShowExitModal(false);
    setNavTab('home');
  };

  // Dedicated helper to render solid colors, gradients, and images with 100% fidelity
  const getThemeCardStyle = (theme: ArtTheme): React.CSSProperties => {
    if (theme.type === 'image' || (theme.category === 'images' && theme.backgroundImage)) {
      return {
        backgroundImage: `url("${theme.backgroundImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1E191A',
      };
    }
    if (theme.type === 'gradient' || (theme.category === 'gradients' && theme.backgroundGradient)) {
      return {
        backgroundImage: theme.backgroundGradient,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#2A2426',
      };
    }
    return {
      backgroundColor: theme.backgroundColor || '#FAF7F2',
    };
  };

  // Get curated cards for current category
  const getDisplayThemes = (): ArtTheme[] => {
    if (selectedCategory === 'all') {
      return [...customThemes, ...ART_THEMES];
    }

    if (selectedCategory === 'colors') {
      return ART_THEMES.filter((t) => t.category === 'colors');
    }

    if (selectedCategory === 'gradients') {
      return ART_THEMES.filter((t) => t.category === 'gradients');
    }

    if (selectedCategory === 'images') {
      return ART_THEMES.filter((t) => t.category === 'images');
    }

    return ART_THEMES;
  };

  const currentThemes = getDisplayThemes();

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#141112] text-[#1F1617] dark:text-[#FAF7F5] pb-24">
      {/* 1. Top Header Matching Screenshots */}
      <header className="px-4 py-3.5 flex items-center justify-between border-b border-[#EFE9DF] dark:border-[#362D30] bg-white/90 dark:bg-[#1E191A]/90 backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={handleHeaderCloseClick}
          className="p-1.5 -ml-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#1F1617] dark:text-[#FAF7F5]"
          title="Save or Exit"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <h1 className="text-xl font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5] tracking-tight">
          Choose your art
        </h1>

        <div className="w-8" />
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1F1617] text-white dark:bg-white dark:text-[#1F1617] px-4 py-2 rounded-full text-xs font-medium shadow-xl flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* 2. "+ Create custom theme" Button Matching Screenshots */}
        <button
          onClick={() => {
            soundEngine.playHapticTone();
            onOpenCustomCreator();
          }}
          className="w-full py-3.5 px-4 rounded-2xl border-2 border-[#2D4A3E] dark:border-[#52796F] text-[#2D4A3E] dark:text-[#A3C9B8] hover:bg-[#2D4A3E]/5 dark:hover:bg-[#52796F]/10 transition-all flex items-center justify-center space-x-2 font-medium text-base shadow-xs group"
        >
          <Plus className="w-5 h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
          <span>Create custom theme</span>
        </button>

        {/* 3. Category Filter Tabs Pill Row Matching Screenshots 1, 2, 3, 4 */}
        <div className="flex items-center justify-between space-x-1.5 p-1 rounded-full bg-[#EFE9DF]/60 dark:bg-[#262022] border border-[#E8E1D5] dark:border-[#362D30]">
          {/* Tab 1: All */}
          <button
            onClick={() => {
              soundEngine.playHapticTone();
              setSelectedCategory('all');
            }}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#2D4A3E] dark:bg-[#52796F] text-white shadow-xs'
                : 'text-[#7C706D] dark:text-[#A89F9E] hover:text-[#1F1617]'
            }`}
          >
            {/* 4 Colored dots icon */}
            <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
              <span className="w-1 h-1 rounded-full bg-amber-400" />
              <span className="w-1 h-1 rounded-full bg-rose-400" />
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span className="w-1 h-1 rounded-full bg-blue-400" />
            </div>
            <span>All</span>
          </button>

          {/* Tab 2: Colors */}
          <button
            onClick={() => {
              soundEngine.playHapticTone();
              setSelectedCategory('colors');
            }}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              selectedCategory === 'colors'
                ? 'bg-[#2D4A3E] dark:bg-[#52796F] text-white shadow-xs'
                : 'text-[#7C706D] dark:text-[#A89F9E] hover:text-[#1F1617]'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
            <span>Colors</span>
          </button>

          {/* Tab 3: Gradients */}
          <button
            onClick={() => {
              soundEngine.playHapticTone();
              setSelectedCategory('gradients');
            }}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              selectedCategory === 'gradients'
                ? 'bg-[#2D4A3E] dark:bg-[#52796F] text-white shadow-xs'
                : 'text-[#7C706D] dark:text-[#A89F9E] hover:text-[#1F1617]'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500" />
            <span>Gradients</span>
          </button>

          {/* Tab 4: Images */}
          <button
            onClick={() => {
              soundEngine.playHapticTone();
              setSelectedCategory('images');
            }}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              selectedCategory === 'images'
                ? 'bg-[#2D4A3E] dark:bg-[#52796F] text-white shadow-xs'
                : 'text-[#7C706D] dark:text-[#A89F9E] hover:text-[#1F1617]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Images</span>
          </button>
        </div>

        {/* 4. Three-Column Card Grid Matching Screenshots */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          {/* In "All" tab: First item is the "Random" card as seen in Screenshot 4 */}
          {selectedCategory === 'all' && (
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={handleRandomTheme}
              className="relative aspect-[9/15] rounded-2xl overflow-hidden cursor-pointer border border-[#EFE9DF] dark:border-[#362D30] shadow-sm hover:shadow-md transition-all flex flex-col justify-between p-3 bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE0] to-[#EBE2D0] dark:from-[#262022] dark:to-[#1A1617]"
            >
              {/* Subtle top decoration */}
              <div className="flex justify-end">
                <span className="p-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-3 h-3" />
                </span>
              </div>

              {/* Center Illustration matching Screenshot 4: Stacked card icons + Shuffle crossover */}
              <div className="flex flex-col items-center justify-center my-auto">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  {/* Decorative backdrop glow */}
                  <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-sm" />

                  {/* Stacked Cards illustration */}
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <div className="absolute w-8 h-10 rounded-md bg-white/80 dark:bg-white/10 border border-amber-300/40 rotate-[-12deg] shadow-xs" />
                    <div className="absolute w-8 h-10 rounded-md bg-white dark:bg-white/20 border border-amber-500/40 rotate-[6deg] shadow-xs flex items-center justify-center">
                      <Shuffle className="w-4 h-4 text-[#8A6223] dark:text-[#F3DEB8]" />
                    </div>
                  </div>

                  {/* Lock badge icon */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#1F1617] dark:bg-white text-white dark:text-[#1F1617] flex items-center justify-center shadow-xs">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>

              {/* Bottom Label */}
              <div className="text-center">
                <span className="text-xs font-serif font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
                  Random
                </span>
              </div>
            </motion.div>
          )}

          {/* Theme Cards */}
          {currentThemes.map((theme) => {
            const isSelected = activeThemeId === theme.id;
            const cardBgStyle = getThemeCardStyle(theme);

            return (
              <motion.div
                key={theme.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelectTheme(theme)}
                className={`relative aspect-[9/15] rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-2.5 select-none border ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-[1.02] shadow-md z-10'
                    : 'border-black/10 dark:border-white/10 hover:border-black/25'
                }`}
                style={cardBgStyle}
              >
                {/* Background image tint overlay for contrast on image themes */}
                {theme.type === 'image' && (
                  <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                )}

                {/* Delicate butterfly watermark if in colors category */}
                {theme.category === 'colors' && theme.patternType === 'butterfly' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <svg viewBox="0 0 100 100" className="w-16 h-16 fill-current text-white">
                      <path d="M50 48 C40 20 15 20 20 50 C22 65 35 70 50 55 C65 70 78 65 80 50 C85 20 60 20 50 48 Z" />
                    </svg>
                  </div>
                )}

                {/* Top-Right Green Checkmark Badge if Selected */}
                {isSelected ? (
                  <div className="flex justify-end z-10">
                    <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-md ring-2 ring-white/80">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                ) : (
                  <div className="h-5" />
                )}

                {/* Center "Aa" / "AA" Typography Preview */}
                <div className="flex items-center justify-center my-auto z-10">
                  <span
                    className={`text-2xl transition-transform duration-200 hover:scale-110 ${theme.fontFamily} ${
                      theme.fontWeight || 'font-normal'
                    }`}
                    style={{
                      color: theme.textColor,
                      textShadow: theme.textShadow || '0 1px 3px rgba(0,0,0,0.35)',
                    }}
                  >
                    {theme.sampleText || 'Aa'}
                  </span>
                </div>

                {/* Bottom Title / Tag with dark backdrop for 100% legibility */}
                <div className="z-10 flex items-center justify-center text-center w-full">
                  <span
                    className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-xs text-white line-clamp-1 shadow-xs max-w-full"
                  >
                    {theme.isCustom ? 'Custom' : theme.name.split(' ')[0]}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Save or Exit Confirmation Modal when clicking (X) */}
      <AnimatePresence>
        {showExitModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto z-50 bg-[#FAF7F2] dark:bg-[#1E191A] rounded-3xl p-6 border border-[#EFE9DF] dark:border-[#362D30] shadow-2xl space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#2D4A3E]/10 dark:bg-[#52796F]/20 text-[#2D4A3E] dark:text-[#A3C9B8] flex items-center justify-center mx-auto">
                <Palette className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-playfair font-bold text-[#1F1617] dark:text-[#FAF7F5]">
                  Save or Exit?
                </h3>
                <p className="text-xs text-[#7C706D] dark:text-[#A89F9E] mt-1 leading-relaxed">
                  Would you like to keep <span className="font-semibold text-[#1F1617] dark:text-[#FAF7F5]">"{activeArtTheme.name}"</span> as your sanctuary's active theme, or discard your selection?
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSaveAndExit}
                  className="w-full py-3 px-4 rounded-xl bg-[#2D4A3E] dark:bg-[#52796F] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Exit</span>
                </button>

                <button
                  onClick={handleDiscardAndExit}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#EFE9DF] dark:bg-[#2D2427] text-[#7C706D] dark:text-[#D1C7C5] hover:text-[#1F1617] text-xs font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Exit without Saving</span>
                </button>

                <button
                  onClick={() => setShowExitModal(false)}
                  className="w-full py-2 text-xs font-medium text-[#7C706D] hover:underline"
                >
                  Keep Choosing
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
