import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquare,
  RotateCcw,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speechService } from '../services/speechService';
import { soundEngine } from '../services/audioSynthesizer';
import { getLocalizedAffirmation } from '../i18n/affirmationTranslations';

export const AffirmationCardDeck: React.FC = () => {
  const {
    affirmations,
    activeAffirmationIndex,
    setActiveAffirmationIndex,
    toggleFavoriteAffirmation,
    journalEntries,
    saveJournalEntry,
    currentLang,
    activeArtTheme,
    t,
  } = useApp();

  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState<boolean>(false);
  const [currentJournalText, setCurrentJournalText] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const activeCard = affirmations[activeAffirmationIndex] || affirmations[0];
  const localizedQuote = getLocalizedAffirmation(activeCard.quote, currentLang.code);

  const handleNextCard = () => {
    soundEngine.playHapticTone();
    setIsFlipped(false);
    setActiveAffirmationIndex((activeAffirmationIndex + 1) % affirmations.length);
  };

  const handlePrevCard = () => {
    soundEngine.playHapticTone();
    setIsFlipped(false);
    setActiveAffirmationIndex(
      (activeAffirmationIndex - 1 + affirmations.length) % affirmations.length
    );
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingSpeech) {
      speechService.stop();
      setIsPlayingSpeech(false);
    } else {
      soundEngine.playTone(activeCard.frequencyHz || 528, 0.15);
      setIsPlayingSpeech(true);
      // Speak in the user's chosen language with phonetic code (ne-NP, hi-IN, es-ES, etc.)
      const spokenText = `${activeCard.theme}. ${localizedQuote}. ${activeCard.mantra}`;
      speechService.speak(
        spokenText,
        currentLang.phonetic || 'en-US',
        () => setIsPlayingSpeech(false)
      );
    }
  };

  const handleFlip = () => {
    soundEngine.playTone(528, 0.2);
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setCurrentJournalText(journalEntries[activeCard.id] || '');
    }
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentJournalText.trim()) return;
    saveJournalEntry(activeCard.id, currentJournalText);
    setIsFlipped(false);
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#A84457] dark:text-[#D47185]" />
          <h2 className="text-base font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
            {t('affirmationTitle')}
          </h2>
        </div>
        <div className="flex items-center space-x-1 text-xs text-[#7C706D] dark:text-[#A89F9E]">
          <span className="font-semibold text-[#A84457]">
            {activeAffirmationIndex + 1}
          </span>
          <span>/</span>
          <span>{affirmations.length}</span>
        </div>
      </div>

      {/* 3D Flippable Affirmation Card */}
      <div className="relative w-full h-[290px] perspective-1000">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-full h-full transform-style-3d cursor-pointer"
          onClick={handleFlip}
        >
          {/* FRONT FACE: Daily Quote Card */}
          <div
            className="absolute inset-0 backface-hidden w-full h-full p-5 rounded-2xl border border-[#EFE9DF] dark:border-[#362D30] shadow-sm flex flex-col justify-between overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: activeArtTheme?.backgroundColor,
              background: activeArtTheme?.backgroundGradient || undefined,
              backgroundImage: activeArtTheme?.backgroundImage ? `url(${activeArtTheme.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark vignette if background is an image */}
            {activeArtTheme?.type === 'image' && (
              <div className="absolute inset-0 bg-black/35 pointer-events-none" />
            )}

            {/* Delicate Watermark Butterfly if solid color */}
            {activeArtTheme?.category === 'colors' && activeArtTheme?.patternType === 'butterfly' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
                <svg viewBox="0 0 100 100" className="w-32 h-32 fill-current text-white">
                  <path d="M50 48 C40 20 15 20 20 50 C22 65 35 70 50 55 C65 70 78 65 80 50 C85 20 60 20 50 48 Z" />
                </svg>
              </div>
            )}

            {/* Ambient Watermark Script */}
            <div className="absolute -bottom-4 -right-2 text-7xl font-script text-[#8A6223]/10 dark:text-[#B88B46]/10 select-none pointer-events-none">
              Blessed
            </div>

            {/* Card Top Meta */}
            <div className="flex items-center justify-between z-10">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/70 dark:bg-black/40 text-[#A84457] dark:text-[#D47185] border border-black/10 dark:border-white/10 shadow-xs backdrop-blur-xs">
                {activeCard.category}
              </span>
              <div className="flex items-center space-x-1.5 text-xs text-[#8A6223] dark:text-[#B88B46] font-mono bg-white/70 dark:bg-black/40 px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 backdrop-blur-xs">
                {isPlayingSpeech ? (
                  <div className="flex items-center space-x-0.5 h-3">
                    <span className="w-0.5 h-full bg-[#A84457] rounded-full animate-wave-bar" />
                    <span className="w-0.5 h-full bg-[#8A6223] rounded-full animate-wave-bar" style={{ animationDelay: '0.2s' }} />
                    <span className="w-0.5 h-full bg-[#A84457] rounded-full animate-wave-bar" style={{ animationDelay: '0.4s' }} />
                  </div>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#8A6223] animate-pulse" />
                )}
                <span>{activeCard.frequencyHz} Hz</span>
              </div>
            </div>

            {/* Quote Body */}
            <div className="my-auto py-2 z-10">
              <h3 className="text-xs uppercase font-bold tracking-widest text-[#8A6223] dark:text-[#B88B46] mb-1 flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-[#8A6223]" />
                <span>{activeCard.theme}</span>
              </h3>
              <p
                className={`text-lg sm:text-xl font-medium leading-snug drop-shadow-xs ${
                  activeArtTheme?.fontFamily || 'font-playfair'
                } ${activeArtTheme?.fontWeight || ''}`}
                style={{
                  color: activeArtTheme?.textColor || undefined,
                  textShadow: activeArtTheme?.textShadow || undefined,
                }}
              >
                &ldquo;{localizedQuote}&rdquo;
              </p>
              <p
                className="mt-2 text-xs font-garamond italic opacity-85"
                style={{ color: activeArtTheme?.textColor || undefined }}
              >
                Mantra: {activeCard.mantra}
              </p>
            </div>

            {/* Card Action Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-[#EFE9DF]/80 dark:border-[#362D30] z-10">
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleSpeak}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 transition-all shadow-xs ${
                    isPlayingSpeech
                      ? 'bg-gradient-to-r from-[#A84457] to-[#8A6223] text-white animate-sacred-pulse'
                      : 'bg-[#FAF7F2] dark:bg-[#262022] text-[#1F1617] dark:text-[#FAF7F5] hover:bg-[#EFE9DF] border border-[#EFE9DF] dark:border-[#362D30]'
                  }`}
                >
                  {isPlayingSpeech ? (
                    <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                  <span>{isPlayingSpeech ? 'Stop Voice' : 'Listen'}</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteAffirmation(activeCard.id);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    activeCard.isFavorite
                      ? 'text-[#A84457] bg-[#A84457]/10'
                      : 'text-[#7C706D] hover:text-[#A84457]'
                  }`}
                  title="Favorite"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      activeCard.isFavorite ? 'fill-[#A84457]' : ''
                    }`}
                  />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowShareModal(true);
                  }}
                  className="p-2 rounded-full text-[#7C706D] hover:text-[#8A6223]"
                  title="Share Blessing"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[11px] text-[#8A6223] dark:text-[#B88B46] font-medium flex items-center space-x-1">
                <MessageSquare className="w-3.5 h-3.5 mr-0.5" />
                <span>Tap for Journal</span>
              </span>
            </div>
          </div>

          {/* BACK FACE: Daily Reflection Prompt */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full p-5 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#8A6223]/40 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A6223]">
                  Reflection Journal • +15 Karma XP
                </span>
                <span className="text-xs text-[#7C706D]">Tap card to return</span>
              </div>
              <p className="text-sm font-playfair font-medium text-[#1F1617] dark:text-[#FAF7F5]">
                {activeCard.journalPrompt}
              </p>
            </div>

            <div onClick={(e) => e.stopPropagation()} className="my-2">
              <textarea
                value={currentJournalText}
                onChange={(e) => setCurrentJournalText(e.target.value)}
                placeholder="Write your heartfelt truth here..."
                rows={3}
                className="w-full p-2.5 text-xs rounded-xl bg-[#FAF7F2] dark:bg-[#262022] border border-[#EFE9DF] dark:border-[#362D30] text-[#1F1617] dark:text-[#FAF7F5] focus:outline-none focus:ring-1 focus:ring-[#8A6223]"
              />
            </div>

            <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleFlip}
                className="text-xs text-[#7C706D] hover:underline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveJournal}
                className="px-4 py-2 rounded-full bg-[#8A6223] text-white text-xs font-semibold hover:bg-[#73511C]"
              >
                Save Blessing Journal
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stack Navigation Arrows */}
      <div className="flex items-center justify-center space-x-4 mt-3">
        <button
          onClick={handlePrevCard}
          className="p-2 rounded-full bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] text-[#7C706D] hover:text-[#A84457] shadow-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-[#7C706D] dark:text-[#A89F9E]">
          Swipe or tap arrows for more mantras
        </span>
        <button
          onClick={handleNextCard}
          className="p-2 rounded-full bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] text-[#7C706D] hover:text-[#A84457] shadow-sm transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div
          onClick={() => setShowShareModal(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm p-6 rounded-3xl bg-[#FAF7F2] dark:bg-[#1E191A] border border-[#8A6223] text-center space-y-4 shadow-2xl"
          >
            <Sparkles className="w-8 h-8 mx-auto text-[#8A6223]" />
            <h4 className="text-lg font-playfair font-semibold">Share Sacred Affirmation</h4>
            <p className="text-sm font-garamond italic">&ldquo;{activeCard.quote}&rdquo;</p>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `"${activeCard.quote}" - Blessikaa Sanctuary (${activeCard.frequencyHz}Hz)`
                  );
                  soundEngine.playTone(600, 0.2);
                  setShowShareModal(false);
                }}
                className="flex-1 py-2.5 rounded-full bg-[#A84457] text-white text-xs font-semibold"
              >
                Copy Blessing Quote
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2.5 rounded-full bg-[#EFE9DF] dark:bg-[#362D30] text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
