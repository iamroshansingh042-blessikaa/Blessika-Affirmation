import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Compass, Layers, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FEATURE_SLIDES } from '../data/seedData';
import { soundEngine } from '../services/audioSynthesizer';

export const FeatureCarousel: React.FC = () => {
  const { setStage, t } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const getSlideIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-[#A84457] dark:text-[#D47185]" />;
      case 'Compass':
        return <Compass className="w-8 h-8 text-[#8A6223] dark:text-[#B88B46]" />;
      case 'ShieldHeart':
        return <ShieldCheck className="w-8 h-8 text-[#476655] dark:text-[#6B947E]" />;
      case 'Layers':
      default:
        return <Layers className="w-8 h-8 text-[#6D5999] dark:text-[#9D88C7]" />;
    }
  };

  const handleNext = () => {
    soundEngine.playHapticTone();
    if (currentSlide < FEATURE_SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      soundEngine.playSingingBowl(528);
      setStage('onboarding');
    }
  };

  const handleSkip = () => {
    soundEngine.playSingingBowl(528);
    setStage('onboarding');
  };

  const slide = FEATURE_SLIDES[currentSlide];

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-6 bg-[#FAF7F2] dark:bg-[#141112] text-[#1F1617] dark:text-[#FAF7F5] max-w-md mx-auto">
      {/* Top Header with Skip Button */}
      <div className="pt-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8A6223] dark:text-[#B88B46]">
          {currentSlide + 1} / {FEATURE_SLIDES.length}
        </span>
        <button
          onClick={handleSkip}
          className="text-xs font-semibold text-[#7C706D] dark:text-[#A89F9E] hover:text-[#A84457] transition-colors flex items-center space-x-1"
        >
          <span>{t('skipToSanctuary')}</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Slide Content Area */}
      <div className="my-auto py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex flex-col items-start"
          >
            {/* Visual Icon Halo */}
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-sm flex items-center justify-center mb-6">
              {getSlideIcon(slide.iconName)}
            </div>

            {/* Glassmorphic Category Badge */}
            <div className="mb-3 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#EFE9DF]/80 dark:bg-[#362D30] text-[#8A6223] dark:text-[#B88B46]">
              {slide.category}
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-playfair font-semibold tracking-tight text-[#1F1617] dark:text-[#FAF7F5] leading-snug">
              {slide.title}
            </h2>

            {/* Subtitle */}
            <p className="mt-2 text-base font-garamond italic text-[#8A6223] dark:text-[#B88B46] font-medium">
              &ldquo;{slide.subtitle}&rdquo;
            </p>

            {/* Editorial Description */}
            <p className="mt-4 text-sm text-[#7C706D] dark:text-[#A89F9E] leading-relaxed">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation & Indicators */}
      <div className="pb-4 space-y-6">
        {/* Expanding Pagination Dots */}
        <div className="flex items-center justify-center space-x-2">
          {FEATURE_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                soundEngine.playHapticTone();
                setCurrentSlide(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-8 bg-[#A84457] dark:bg-[#D47185]'
                  : 'w-2 bg-[#EFE9DF] dark:bg-[#362D30]'
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full px-6 py-3.5 rounded-full bg-[#A84457] hover:bg-[#8F394A] text-white font-medium text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg shadow-[#A84457]/25 transition-colors"
        >
          <span>
            {currentSlide === FEATURE_SLIDES.length - 1
              ? t('finish')
              : t('next')}
          </span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
