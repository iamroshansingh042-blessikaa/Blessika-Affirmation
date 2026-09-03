import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  Layers,
  Radio,
  SlidersHorizontal,
  Bookmark,
  Volume2,
} from 'lucide-react';
import { CATEGORIES_DATA, CATEGORY_SECTIONS, CategoryDefinition } from '../data/categoryData';
import { CategoryArtwork } from './CategoryArtwork';
import { CategoryDeckModal } from './CategoryDeckModal';
import { soundEngine } from '../services/audioSynthesizer';
import { useApp } from '../context/AppContext';

export const CategoryExplorer: React.FC = () => {
  const { user, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [activeCategoryModal, setActiveCategoryModal] = useState<CategoryDefinition | null>(null);

  const handleCategoryClick = (cat: CategoryDefinition) => {
    soundEngine.playHapticTone();
    // Dynamically retune ambient sound frequency to the category frequency
    soundEngine.setFrequency(cat.frequencyHz);
    setActiveCategoryModal(cat);
  };

  // Filter categories based on search and section tabs
  const filteredCategories = CATEGORIES_DATA.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSection = selectedSection === 'all' || cat.sectionId === selectedSection;

    return matchesSearch && matchesSection;
  });

  // Group filtered categories by section for clean structured presentation
  const groupedSections = CATEGORY_SECTIONS.filter((sec) => sec.id !== 'all').map((section) => {
    const items = filteredCategories.filter((cat) => cat.sectionId === section.id);
    return {
      ...section,
      items,
    };
  }).filter((group) => group.items.length > 0);

  return (
    <div className="w-full pb-24 animate-fadeIn">
      {/* Search & Navigation Bar */}
      <div className="px-4 pt-2 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#8A6223] dark:text-[#B88B46] uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Categories & Mantras</span>
          </div>
          <span className="text-[11px] font-medium text-[#7C706D] dark:text-[#A89F9E]">
            {CATEGORIES_DATA.length} Sanctuaries
          </span>
        </div>

        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C706D] dark:text-[#A89F9E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mantras, gratitude, sleep, love..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] text-[#1F1617] dark:text-[#FAF7F5] placeholder-[#7C706D]/60 focus:outline-none focus:ring-2 focus:ring-[#8A6223]/30 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7C706D] hover:text-[#1F1617]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
          {CATEGORY_SECTIONS.map((sec) => {
            const isSelected = selectedSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  soundEngine.playHapticTone();
                  setSelectedSection(sec.id);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-[#8A6223] text-white shadow-sm'
                    : 'bg-white/80 dark:bg-[#241E20] text-[#7C706D] dark:text-[#A89F9E] border border-[#EFE9DF] dark:border-[#362D30]'
                }`}
              >
                <span>{sec.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Structured Category Display */}
      <div className="px-4 space-y-6">
        {groupedSections.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#7C706D] dark:text-[#A89F9E]">
            No categories found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          groupedSections.map((sectionGroup) => (
            <div key={sectionGroup.id} className="space-y-3">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-playfair font-bold text-[#1F1617] dark:text-[#FAF7F5] flex items-center space-x-1.5">
                  <span>{sectionGroup.title}</span>
                </h3>
                <span className="text-[10px] font-mono text-[#8A6223] dark:text-[#B88B46]">
                  {sectionGroup.items.length} categories
                </span>
              </div>

              {/* Responsive 2-Column Grid of Category Image/Buttons matching the uploaded reference */}
              <div className="grid grid-cols-2 gap-3">
                {sectionGroup.items.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCategoryClick(cat)}
                    className="group relative w-full h-44 rounded-2xl overflow-hidden text-left bg-gradient-to-b from-[#241E20] to-[#171314] border border-[#EFE9DF]/60 dark:border-[#362D30] shadow-sm hover:shadow-md transition-all flex flex-col justify-end"
                  >
                    {/* Visual Vector Artwork Backdrop */}
                    <div className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105">
                      <CategoryArtwork theme={cat.iconTheme} name={cat.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Top Pill Badges */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
                      <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-xs text-[#FFE5A3] border border-white/10">
                        {cat.frequencyHz} Hz
                      </span>
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-xs text-white/80">
                        {cat.affirmationCount}
                      </span>
                    </div>

                    {/* Frosted Glass Bottom Overlay for Typography */}
                    <div className="relative z-10 p-2.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-[2px] w-full">
                      <h4 className="text-xs sm:text-sm font-playfair font-bold text-white leading-tight group-hover:text-[#FFE5A3] transition-colors drop-shadow-sm">
                        {cat.name}
                      </h4>
                      <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5 leading-snug">
                        {cat.subtitle}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Interactive Category Deck Modal */}
      <AnimatePresence>
        {activeCategoryModal && (
          <CategoryDeckModal
            category={activeCategoryModal}
            onClose={() => {
              soundEngine.playHapticTone();
              setActiveCategoryModal(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
