import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Palette, Shuffle, ChevronUp, ChevronDown, Save, LogOut } from 'lucide-react';
import { ART_THEMES } from '../data/artThemesData';
import { soundEngine } from '../services/audioSynthesizer';

interface BackgroundPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundType: 'color' | 'gradient' | 'image';
  backgroundColor: string;
  backgroundGradient: string;
  onSelectColor: (color: string) => void;
  onSelectGradient: (gradient: string) => void;
}

export const BackgroundPickerModal: React.FC<BackgroundPickerModalProps> = ({
  isOpen,
  onClose,
  backgroundType,
  backgroundColor,
  backgroundGradient,
  onSelectColor,
  onSelectGradient,
}) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'gradients' | 'custom'>('colors');
  const [customHex, setCustomHex] = useState(backgroundColor);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const initialTypeRef = useRef(backgroundType);
  const initialColorRef = useRef(backgroundColor);
  const initialGradientRef = useRef(backgroundGradient);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const colorThemes = ART_THEMES.filter((t) => t.category === 'colors');
  const gradientThemes = ART_THEMES.filter((t) => t.category === 'gradients');

  const handleScrollUp = () => {
    soundEngine.playHapticTone();
    scrollContainerRef.current?.scrollBy({ top: -260, behavior: 'smooth' });
  };

  const handleScrollDown = () => {
    soundEngine.playHapticTone();
    scrollContainerRef.current?.scrollBy({ top: 260, behavior: 'smooth' });
  };

  const handleRandomize = () => {
    soundEngine.playSacredBell();
    const list = activeTab === 'gradients' ? gradientThemes : colorThemes;
    const randomItem = list[Math.floor(Math.random() * list.length)];
    if (randomItem.type === 'gradient' && randomItem.backgroundGradient) {
      onSelectGradient(randomItem.backgroundGradient);
    } else if (randomItem.backgroundColor) {
      onSelectColor(randomItem.backgroundColor);
    }
  };

  const handleCloseClick = () => {
    soundEngine.playHapticTone();
    setShowExitConfirm(true);
  };

  const handleSaveAndExit = () => {
    soundEngine.playSacredBell();
    setShowExitConfirm(false);
    onClose();
  };

  const handleDiscardAndExit = () => {
    soundEngine.playHapticTone();
    if (initialTypeRef.current === 'gradient') {
      onSelectGradient(initialGradientRef.current);
    } else {
      onSelectColor(initialColorRef.current);
    }
    setShowExitConfirm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Upside / downside auto-scroll sliding bottom sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 max-w-md mx-auto z-50 bg-[#FAF7F2] dark:bg-[#1C1719] rounded-t-3xl border-t border-[#EFE9DF] dark:border-[#382F32] shadow-2xl flex flex-col max-h-[86vh] overflow-hidden"
          >
            {/* Top Drag Handle that works to close directly */}
            <div
              onClick={handleCloseClick}
              className="pt-3 pb-1 flex items-center justify-center cursor-pointer group"
              title="Tap handle to close"
            >
              <div className="w-12 h-1.5 rounded-full bg-[#D5CEC2] dark:bg-[#473C3F] group-hover:bg-[#A84457] group-hover:w-16 transition-all" />
            </div>

            {/* Header */}
            <div className="px-5 pt-0.5 pb-2.5 flex items-center justify-between border-b border-[#EFE9DF] dark:border-[#332A2D]">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#A84457] dark:text-[#E07A8D] uppercase">
                  Create Your Art
                </span>
                <h2 className="text-xl font-playfair font-bold text-[#1F1617] dark:text-[#FAF7F5] flex items-center space-x-2">
                  <span>Background Style</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                    {colorThemes.length + gradientThemes.length}+ samples
                  </span>
                </h2>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={handleRandomize}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#7C706D] dark:text-[#A89F9E]"
                  title="Surprise Color"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCloseClick}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#7C706D] dark:text-[#A89F9E]"
                  title="Save or Exit"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs: Colors / Gradients / Custom Color + Upside & Downside Scroll buttons */}
            <div className="flex items-center justify-between border-b border-[#EFE9DF] dark:border-[#332A2D] px-4 bg-white/60 dark:bg-[#231D1F]/60">
              <div className="flex flex-1">
                <button
                  onClick={() => {
                    soundEngine.playHapticTone();
                    setActiveTab('colors');
                  }}
                  className={`flex-1 py-3 text-xs font-bold border-b-2 text-center transition-all flex items-center justify-center space-x-1.5 ${
                    activeTab === 'colors'
                      ? 'border-[#2D4A3E] text-[#2D4A3E] dark:border-[#52796F] dark:text-[#A3C9B8]'
                      : 'border-transparent text-[#7C706D]'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D91B5C]" />
                  <span>Colors ({colorThemes.length})</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playHapticTone();
                    setActiveTab('gradients');
                  }}
                  className={`flex-1 py-3 text-xs font-bold border-b-2 text-center transition-all flex items-center justify-center space-x-1.5 ${
                    activeTab === 'gradients'
                      ? 'border-[#2D4A3E] text-[#2D4A3E] dark:border-[#52796F] dark:text-[#A3C9B8]'
                      : 'border-transparent text-[#7C706D]'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500" />
                  <span>Gradients ({gradientThemes.length})</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playHapticTone();
                    setActiveTab('custom');
                  }}
                  className={`flex-1 py-3 text-xs font-bold border-b-2 text-center transition-all flex items-center justify-center space-x-1.5 ${
                    activeTab === 'custom'
                      ? 'border-[#2D4A3E] text-[#2D4A3E] dark:border-[#52796F] dark:text-[#A3C9B8]'
                      : 'border-transparent text-[#7C706D]'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Custom Hex</span>
                </button>
              </div>

              {/* Upside / Downside auto-scroll buttons */}
              <div className="flex items-center space-x-1 pl-2">
                <button
                  onClick={handleScrollUp}
                  className="p-1.5 rounded-lg bg-[#EFE9DF] dark:bg-[#2E2628] hover:bg-[#2D4A3E] hover:text-white transition-colors text-[#7C706D] dark:text-[#A89F9E]"
                  title="Scroll upside"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={handleScrollDown}
                  className="p-1.5 rounded-lg bg-[#EFE9DF] dark:bg-[#2E2628] hover:bg-[#2D4A3E] hover:text-white transition-colors text-[#7C706D] dark:text-[#A89F9E]"
                  title="Scroll downside"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div ref={scrollContainerRef} className="p-4 overflow-y-auto flex-1">
              {/* TAB 1: Solid Colors Grid */}
              {activeTab === 'colors' && (
                <div className="grid grid-cols-3 gap-3">
                  {colorThemes.map((c) => {
                    const isSelected = backgroundType === 'color' && backgroundColor === c.backgroundColor;

                    return (
                      <motion.button
                        key={c.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          soundEngine.playHapticTone();
                          if (c.backgroundColor) {
                            onSelectColor(c.backgroundColor);
                          }
                        }}
                        className={`aspect-square rounded-2xl relative p-2 flex flex-col justify-between text-left shadow-xs transition-all border-2 group ${
                          isSelected
                            ? 'border-white ring-4 ring-[#2D4A3E]/40 scale-105 shadow-md'
                            : 'border-white/30 hover:scale-102'
                        }`}
                        style={{ backgroundColor: c.backgroundColor }}
                      >
                        {/* Sample "Aa" badge matching request */}
                        <div className="flex justify-between items-start">
                          <span
                            className="px-1.5 py-0.5 rounded-md text-xs font-bold font-serif shadow-xs"
                            style={{
                              color: c.textColor,
                              backgroundColor: 'rgba(0,0,0,0.2)',
                            }}
                          >
                            Aa
                          </span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-white text-[#1F1617] flex items-center justify-center shadow-md">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        {/* Name label */}
                        <span className="text-[10px] font-semibold text-white bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded-md line-clamp-1 leading-tight">
                          {c.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: Gradients Grid */}
              {activeTab === 'gradients' && (
                <div className="grid grid-cols-3 gap-3">
                  {gradientThemes.map((g) => {
                    const isSelected = backgroundType === 'gradient' && backgroundGradient === g.backgroundGradient;

                    return (
                      <motion.button
                        key={g.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          soundEngine.playHapticTone();
                          if (g.backgroundGradient) {
                            onSelectGradient(g.backgroundGradient);
                          }
                        }}
                        className={`aspect-square rounded-2xl relative p-2 flex flex-col justify-between text-left shadow-xs transition-all border-2 group ${
                          isSelected
                            ? 'border-white ring-4 ring-[#2D4A3E]/40 scale-105 shadow-md'
                            : 'border-white/30 hover:scale-102'
                        }`}
                        style={{ backgroundImage: g.backgroundGradient, backgroundSize: 'cover' }}
                      >
                        {/* Sample "Aa" badge */}
                        <div className="flex justify-between items-start">
                          <span
                            className="px-1.5 py-0.5 rounded-md text-xs font-bold font-serif shadow-xs"
                            style={{
                              color: g.textColor,
                              backgroundColor: 'rgba(0,0,0,0.2)',
                            }}
                          >
                            Aa
                          </span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-white text-[#1F1617] flex items-center justify-center shadow-md">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        {/* Name label */}
                        <span className="text-[10px] font-semibold text-white bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded-md line-clamp-1 leading-tight">
                          {g.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: Custom Color Hex & Picker */}
              {activeTab === 'custom' && (
                <div className="space-y-4 p-2 bg-white dark:bg-[#241E20] rounded-2xl border border-[#EFE9DF] dark:border-[#382F32]">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-16 h-16 rounded-2xl border-2 border-black/10 shadow-md flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: customHex }}
                    >
                      Aa
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-bold text-[#7C706D] dark:text-[#A89F9E]">
                        Custom Background Color
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <input
                          type="color"
                          value={customHex}
                          onChange={(e) => {
                            setCustomHex(e.target.value);
                            onSelectColor(e.target.value);
                          }}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-[#EFE9DF]"
                        />
                        <input
                          type="text"
                          value={customHex}
                          onChange={(e) => {
                            setCustomHex(e.target.value);
                            onSelectColor(e.target.value);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-[#EFE9DF] dark:border-[#382F32] font-mono text-xs w-28 bg-[#FAF7F2] dark:bg-[#1C1719]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Color Swatches */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-[#7C706D]">Quick Palette:</span>
                    <div className="grid grid-cols-7 gap-2 mt-2">
                      {[
                        '#1F1617', '#D91B5C', '#8B1437', '#EA580C', '#D97706', '#059669',
                        '#0F766E', '#2563EB', '#4F46E5', '#7C3AED', '#DB2777', '#334155',
                        '#FFF2C6', '#F5EFE0'
                      ].map((hex) => (
                        <button
                          key={hex}
                          onClick={() => {
                            soundEngine.playHapticTone();
                            setCustomHex(hex);
                            onSelectColor(hex);
                          }}
                          className="w-9 h-9 rounded-xl border border-black/10 shadow-2xs hover:scale-110 transition-transform"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Save or Exit Confirmation Dialog */}
          {showExitConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-xs mx-auto z-60 bg-[#FAF7F2] dark:bg-[#1E191A] rounded-3xl p-5 border border-[#EFE9DF] dark:border-[#362D30] shadow-2xl text-center space-y-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#2D4A3E]/10 dark:bg-[#52796F]/20 text-[#2D4A3E] dark:text-[#A3C9B8] flex items-center justify-center mx-auto">
                <Palette className="w-5 h-5" />
              </div>

              <div>
                <h4 className="text-base font-playfair font-bold text-[#1F1617] dark:text-[#FAF7F5]">
                  Save or Exit?
                </h4>
                <p className="text-xs text-[#7C706D] dark:text-[#A89F9E] mt-1">
                  Apply current background style or exit without changes?
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleSaveAndExit}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#2D4A3E] text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all flex items-center justify-center space-x-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Apply</span>
                </button>

                <button
                  onClick={handleDiscardAndExit}
                  className="w-full py-2 px-3 rounded-xl bg-[#EFE9DF] dark:bg-[#2D2427] text-[#7C706D] dark:text-[#D1C7C5] hover:text-[#1F1617] text-xs font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit without Saving</span>
                </button>

                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="w-full py-1 text-xs font-medium text-[#7C706D] hover:underline"
                >
                  Keep Choosing
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};
