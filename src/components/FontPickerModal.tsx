import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Search, Minus, ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';
import { AVAILABLE_FONTS } from '../data/fontsData';
import { soundEngine } from '../services/audioSynthesizer';

interface FontPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFont: string;
  onSelectFont: (fontId: string) => void;
}

export const FontPickerModal: React.FC<FontPickerModalProps> = ({
  isOpen,
  onClose,
  selectedFont,
  onSelectFont,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Handwriting', 'Serif', 'Sans-serif', 'Display'];

  const filteredFonts = AVAILABLE_FONTS.filter((font) => {
    const matchesSearch = font.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || font.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleScrollUp = () => {
    soundEngine.playHapticTone();
    scrollContainerRef.current?.scrollBy({ top: -280, behavior: 'smooth' });
  };

  const handleScrollDown = () => {
    soundEngine.playHapticTone();
    scrollContainerRef.current?.scrollBy({ top: 280, behavior: 'smooth' });
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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Upside / Downside sliding bottom sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 max-w-md mx-auto z-50 bg-[#FAF7F2] dark:bg-[#1C1719] rounded-t-3xl border-t border-[#EFE9DF] dark:border-[#382F32] shadow-2xl flex flex-col max-h-[86vh] overflow-hidden"
          >
            {/* Top Drag Handle that works to close */}
            <div
              onClick={() => {
                soundEngine.playHapticTone();
                onClose();
              }}
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
                  <span>Select a font</span>
                  <span className="px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-serif font-bold">
                    Aa ({AVAILABLE_FONTS.length})
                  </span>
                </h2>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#7C706D] dark:text-[#A89F9E]"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search and Category Filter Pills */}
            <div className="px-4 pt-3 pb-2 space-y-2 bg-white/60 dark:bg-[#231D1F]/60 backdrop-blur-xs border-b border-[#EFE9DF] dark:border-[#332A2D]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7C706D]" />
                <input
                  type="text"
                  placeholder={`Search ${AVAILABLE_FONTS.length}+ typography fonts...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-[#181415] border border-[#E8E1D5] dark:border-[#3A3034] text-[#1F1617] dark:text-[#FAF7F5] focus:outline-hidden focus:border-[#A84457]"
                />
              </div>

              {/* Category Pills and Upside / Downside auto-scroll buttons */}
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        soundEngine.playHapticTone();
                        setActiveCategory(cat);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        activeCategory === cat
                          ? 'bg-[#2D4A3E] dark:bg-[#52796F] text-white shadow-xs'
                          : 'bg-[#EFE9DF]/80 dark:bg-[#2E2628] text-[#7C706D] dark:text-[#A89F9E] hover:text-[#1F1617]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Auto Scroll Upside and Downside buttons */}
                <div className="flex items-center space-x-1 pl-1 shrink-0">
                  <button
                    onClick={handleScrollUp}
                    className="p-1 rounded-lg bg-[#EFE9DF] dark:bg-[#2E2628] hover:bg-[#A84457] hover:text-white transition-colors text-[#7C706D] dark:text-[#A89F9E]"
                    title="Scroll upside"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleScrollDown}
                    className="p-1 rounded-lg bg-[#EFE9DF] dark:bg-[#2E2628] hover:bg-[#A84457] hover:text-white transition-colors text-[#7C706D] dark:text-[#A89F9E]"
                    title="Scroll downside"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Auto-scrollable Font List */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-4 py-2 space-y-1 divide-y divide-[#EFE9DF]/50 dark:divide-[#332A2D]/50"
            >
              {filteredFonts.map((font) => {
                const isSelected = selectedFont === font.className;

                return (
                  <motion.button
                    key={font.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      soundEngine.playHapticTone();
                      onSelectFont(font.className);
                      onClose();
                    }}
                    className={`w-full py-3 px-3 rounded-2xl flex items-center justify-between text-left transition-all group ${
                      isSelected
                        ? 'bg-[#2D4A3E]/10 dark:bg-[#52796F]/20 text-[#2D4A3E] dark:text-[#A3C9B8]'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#1F1617] dark:text-[#FAF7F5]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Selection Check or Bullet */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-[#2D4A3E] dark:bg-[#52796F] border-[#2D4A3E] text-white'
                            : 'border-[#D5CEC2] dark:border-[#4A3E42]'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : (
                          <span className="text-[10px] text-[#7C706D] font-mono">{font.sample}</span>
                        )}
                      </div>

                      <div>
                        {/* Font Name rendered in that exact font */}
                        <div className={`text-lg leading-snug ${font.className} tracking-wide`}>
                          {font.name}
                        </div>
                        <div className="text-[10px] text-[#7C706D] dark:text-[#A89F9E]">
                          {font.category} • Example: &ldquo;I am filled with inner peace&rdquo;
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-[#7C706D] group-hover:translate-x-0.5 transition-transform">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </motion.button>
                );
              })}

              {filteredFonts.length === 0 && (
                <div className="py-12 text-center text-xs text-[#7C706D]">
                  No fonts found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
