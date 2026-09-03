import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Download,
  Heart,
  Eye,
  EyeOff,
  Music,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Sparkles,
  Check,
  Palette,
  Layers,
  Type,
  Shuffle,
  SunMedium,
  CheckCircle2,
  Save,
  LogOut,
} from 'lucide-react';
import { ArtTheme } from '../types';
import { soundEngine } from '../services/audioSynthesizer';
import { useApp } from '../context/AppContext';
import { INSPIRING_QUOTES, ART_THEMES } from '../data/artThemesData';
import { FontPickerModal } from './FontPickerModal';
import { ImageSourceModal } from './ImageSourceModal';
import { BackgroundPickerModal } from './BackgroundPickerModal';

interface CreateYourArtStudioProps {
  onClose: () => void;
  onSaved: (theme: ArtTheme) => void;
}

// Preset wallpapers available for custom art
const WALLPAPER_PRESETS = [
  {
    id: 'wp-clouds',
    name: 'Pastel Clouds',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'wp-galaxy',
    name: 'Cosmic Galaxy',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'wp-watercolor',
    name: 'Rose Watercolor',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'wp-dark-gold',
    name: 'Obsidian Gold',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'wp-aurora',
    name: 'Pastel Aura',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'wp-botanical',
    name: 'Vintage Botanical',
    url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'wp-moon',
    name: 'Crescent Moon',
    url: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'wp-twilight',
    name: 'Twilight Mist',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  },
];

// Preset background colors & gradients
const COLOR_PRESETS = [
  { id: 'c-magenta', label: 'Vivid Berry', type: 'color', value: '#D91B5C' },
  { id: 'c-purple', label: 'Royal Purple', type: 'color', value: '#34195B' },
  { id: 'c-pine', label: 'Forest Pine', type: 'color', value: '#114B36' },
  { id: 'c-sky', label: 'Cloud Blue', type: 'color', value: '#C8E0FE' },
  { id: 'c-ivory', label: 'Warm Ivory', type: 'color', value: '#FFF2C6' },
  { id: 'c-espresso', label: 'Dark Espresso', type: 'color', value: '#351C12' },
  { id: 'c-peach', label: 'Blush Peach', type: 'color', value: '#FFDBC9' },
  { id: 'c-wine', label: 'Crimson Wine', type: 'color', value: '#8B1437' },
  { id: 'g-sand', label: 'Desert Sand', type: 'gradient', value: 'linear-gradient(135deg, #F3DEB8 0%, #E6C89C 50%, #D8B281 100%)' },
  { id: 'g-peach', label: 'Apricot Blush', type: 'gradient', value: 'linear-gradient(180deg, #FFDECE 0%, #FCA5A5 50%, #F472B6 100%)' },
  { id: 'g-mint', label: 'Aqua Mist', type: 'gradient', value: 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)' },
  { id: 'g-plum', label: 'Wine Plum', type: 'gradient', value: 'linear-gradient(180deg, #4C0519 0%, #3B0715 50%, #25020D 100%)' },
  { id: 'g-radial', label: 'Magenta Ray', type: 'gradient', value: 'radial-gradient(circle at center, #D946EF 0%, #A855F7 35%, #2563EB 85%, #1E3A8A 100%)' },
  { id: 'g-flame', label: 'Neon Flame', type: 'gradient', value: 'linear-gradient(135deg, #EF4444 0%, #EC4899 40%, #8B5CF6 80%, #3B82F6 100%)' },
  { id: 'g-sunset', label: 'Sunset Solstice', type: 'gradient', value: 'linear-gradient(180deg, #EA580C 0%, #F97316 45%, #FB923C 100%)' },
];

const TEXT_COLORS = [
  { id: 'txt-white', label: 'Pure White', value: '#FFFFFF' },
  { id: 'txt-cream', label: 'Warm Cream', value: '#FFF8E7' },
  { id: 'txt-dark', label: 'Obsidian Charcoal', value: '#1F1617' },
  { id: 'txt-gold', label: 'Sacred Gold', value: '#FDE047' },
  { id: 'txt-rose', label: 'Blush Rose', value: '#FDA4AF' },
  { id: 'txt-wine', label: 'Deep Wine', value: '#701A28' },
  { id: 'txt-navy', label: 'Deep Navy', value: '#0C4A6E' },
  { id: 'txt-amber', label: 'Warm Amber', value: '#F59E0B' },
  { id: 'txt-emerald', label: 'Emerald Mint', value: '#10B981' },
  { id: 'txt-cyan', label: 'Ice Cyan', value: '#38BDF8' },
  { id: 'txt-lavender', label: 'Lilac Dusk', value: '#C084FC' },
  { id: 'txt-coral', label: 'Sunset Coral', value: '#FB7185' },
];

const SHADOW_PRESETS = [
  { id: 'none', label: 'None', value: 'none' },
  { id: 'soft', label: 'Soft', value: '0 2px 6px rgba(0,0,0,0.35)' },
  { id: 'cinema', label: 'Cinema', value: '0 4px 14px rgba(0,0,0,0.7)' },
  { id: 'gold-glow', label: 'Gold Glow', value: '0 0 16px rgba(253, 224, 71, 0.7)' },
  { id: 'aura-glow', label: 'Aura Glow', value: '0 0 20px rgba(236, 72, 153, 0.8)' },
];

const FONT_FAMILIES = [
  { id: 'font-sans', name: 'Modern Sans', sample: 'Aa' },
  { id: 'font-playfair', name: 'Playfair Display', sample: 'Aa' },
  { id: 'font-garamond', name: 'Cormorant Garamond', sample: 'AA' },
  { id: 'font-script', name: 'Dancing Script', sample: 'Aa' },
  { id: 'font-caveat', name: 'Caveat Brush', sample: 'Aa' },
  { id: 'font-cinzel', name: 'Cinzel Classic', sample: 'AA' },
];

type ActiveTool = 'none' | 'image' | 'background' | 'text' | 'shadow' | 'font' | 'size';

export const CreateYourArtStudio: React.FC<CreateYourArtStudioProps> = ({ onClose, onSaved }) => {
  const { addCustomTheme } = useApp();

  // Quote State
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [customQuote, setCustomQuote] = useState(INSPIRING_QUOTES[0]);
  const [isEditingText, setIsEditingText] = useState(false);

  // Styling States matching Screenshot 5
  const [backgroundType, setBackgroundType] = useState<'color' | 'gradient' | 'image'>('color');
  const [backgroundColor, setBackgroundColor] = useState('#D91B5C');
  const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(180deg, #D91B5C 0%, #A81244 100%)');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const [textColor, setTextColor] = useState('#FFFFFF');
  const [shadowStyle, setShadowStyle] = useState('none');
  const [fontFamily, setFontFamily] = useState('font-sans');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [fontWeight, setFontWeight] = useState<'font-normal' | 'font-medium' | 'font-bold' | 'font-extrabold'>('font-bold');
  const [fontSize, setFontSize] = useState(28); // in px

  // Interactive controls
  const [isFavorite, setIsFavorite] = useState(false);
  const [hideControls, setHideControls] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTool, setActiveTool] = useState<ActiveTool>('none');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sliding Modals matching screenshots
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShuffleQuote = () => {
    soundEngine.playHapticTone();
    const nextIdx = (quoteIndex + 1) % INSPIRING_QUOTES.length;
    setQuoteIndex(nextIdx);
    setCustomQuote(INSPIRING_QUOTES[nextIdx]);
  };

  const handleToggleAlign = () => {
    soundEngine.playHapticTone();
    if (textAlign === 'center') setTextAlign('left');
    else if (textAlign === 'left') setTextAlign('right');
    else setTextAlign('center');
  };

  const handleToggleWeight = () => {
    soundEngine.playHapticTone();
    if (fontWeight === 'font-bold') setFontWeight('font-extrabold');
    else if (fontWeight === 'font-extrabold') setFontWeight('font-normal');
    else if (fontWeight === 'font-normal') setFontWeight('font-medium');
    else setFontWeight('font-bold');
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      soundEngine.playHapticTone();
      setIsPlayingAudio(false);
    } else {
      soundEngine.playTibetanBowl();
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 3500);
    }
  };

  const handleShare = async () => {
    soundEngine.playHapticTone();
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Daily Affirmation Art',
          text: `"${customQuote}"`,
        });
      } else {
        await navigator.clipboard.writeText(`"${customQuote}"`);
        showToast('Affirmation quote copied to clipboard!');
      }
    } catch {
      await navigator.clipboard.writeText(`"${customQuote}"`);
      showToast('Affirmation quote copied!');
    }
  };

  const handleDownload = () => {
    soundEngine.playSacredBell();
    showToast('Theme visual exported to gallery!');
  };

  const handleSaveTheme = () => {
    soundEngine.playTibetanBowl();
    const newTheme: ArtTheme = {
      id: 'custom-' + Date.now(),
      name: 'Custom Creation',
      category: backgroundType === 'image' ? 'images' : backgroundType === 'gradient' ? 'gradients' : 'colors',
      type: backgroundType,
      backgroundColor: backgroundType === 'color' ? backgroundColor : undefined,
      backgroundGradient: backgroundType === 'gradient' ? backgroundGradient : undefined,
      backgroundImage: backgroundType === 'image' && backgroundImage ? backgroundImage : undefined,
      textColor,
      fontFamily,
      fontWeight,
      textShadow: shadowStyle !== 'none' ? shadowStyle : undefined,
      sampleText: 'Aa',
      isCustom: true,
    };

    addCustomTheme(newTheme);
    onSaved(newTheme);
  };

  // Helper for background style rendering
  const getCardBackgroundStyle = (): React.CSSProperties => {
    if (backgroundType === 'image' && backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (backgroundType === 'gradient') {
      return {
        background: backgroundGradient,
      };
    }
    return {
      backgroundColor,
    };
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#141112] text-[#1F1617] dark:text-[#FAF7F5] flex flex-col justify-between pb-2">
      {/* 1. Header matching Screenshot 5 */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-[#EFE9DF] dark:border-[#362D30] bg-white/90 dark:bg-[#1E191A]/90 backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={() => {
            soundEngine.playHapticTone();
            setShowExitConfirm(true);
          }}
          className="p-2 -ml-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#1F1617] dark:text-[#FAF7F5]"
          title="Save or Exit"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <h1 className="text-xl font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5] tracking-tight">
          Create your art
        </h1>

        <button
          onClick={handleSaveTheme}
          className="px-3 py-1.5 rounded-full text-sm font-semibold text-[#2D4A3E] dark:text-[#74A892] hover:bg-[#2D4A3E]/10 dark:hover:bg-[#74A892]/10 transition-colors"
        >
          Save
        </button>
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

      {/* 2. Main Art Canvas Area */}
      <div className="flex-1 px-4 py-3 flex flex-col items-center justify-center relative">
        <motion.div
          layout
          className="relative w-full max-w-[360px] aspect-[9/15] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 transition-all duration-300 border border-white/20"
          style={getCardBackgroundStyle()}
        >
          {/* Ambient Vignette Overlay if image */}
          {backgroundType === 'image' && (
            <div className="absolute inset-0 bg-black/35 pointer-events-none" />
          )}

          {/* Delicate Watermark Butterfly if solid color */}
          {backgroundType === 'color' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
              <svg viewBox="0 0 100 100" className="w-48 h-48 fill-current text-white">
                <path d="M50 48 C40 20 15 20 20 50 C22 65 35 70 50 55 C65 70 78 65 80 50 C85 20 60 20 50 48 Z" />
              </svg>
            </div>
          )}

          {/* Top Canvas Controls (Shuffle Quote / Tap to Edit) */}
          <div className="relative z-10 flex items-center justify-between">
            <button
              onClick={handleShuffleQuote}
              className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/30 transition-all text-xs flex items-center space-x-1.5"
              title="Shuffle Affirmation"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium tracking-wide uppercase">Shuffle</span>
            </button>

            <button
              onClick={() => setIsEditingText((prev) => !prev)}
              className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/30 transition-all text-xs flex items-center space-x-1.5"
              title="Edit Affirmation Text"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium tracking-wide uppercase">Edit</span>
            </button>
          </div>

          {/* Center Quote Display */}
          <div className="relative z-10 my-auto py-4 px-1">
            {isEditingText ? (
              <textarea
                value={customQuote}
                onChange={(e) => setCustomQuote(e.target.value)}
                onBlur={() => setIsEditingText(false)}
                rows={4}
                autoFocus
                className="w-full bg-black/30 text-white rounded-xl p-3 text-center text-lg font-medium outline-none border border-white/30 backdrop-blur-md resize-none shadow-inner"
              />
            ) : (
              <motion.p
                key={customQuote + fontFamily + fontWeight}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                onClick={() => setIsEditingText(true)}
                className={`leading-snug cursor-pointer select-none transition-all ${fontFamily} ${fontWeight}`}
                style={{
                  color: textColor,
                  textAlign,
                  fontSize: `${fontSize}px`,
                  textShadow: shadowStyle !== 'none' ? shadowStyle : undefined,
                }}
              >
                {customQuote}
              </motion.p>
            )}
          </div>

          {/* 3. Floating Pill Toolbar on bottom of Card (Matching Screenshot 5) */}
          <div className="relative z-10 flex items-center justify-center pb-1">
            <div className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#1E191A]/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-lg flex items-center space-x-3 text-[#1F1617] dark:text-[#FAF7F5]">
              {/* Share */}
              <button
                onClick={handleShare}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title="Share Quote"
              >
                <Share2 className="w-4 h-4 stroke-[2]" />
              </button>

              {/* Download / Camera */}
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title="Export Art"
              >
                <Download className="w-4 h-4 stroke-[2]" />
              </button>

              {/* Heart (Dark circle background matching screenshot 5) */}
              <button
                onClick={() => {
                  soundEngine.playTone(880, 0.15);
                  setIsFavorite((prev) => !prev);
                }}
                className={`p-2 rounded-full transition-all shadow-xs ${
                  isFavorite
                    ? 'bg-[#A84457] text-white scale-110'
                    : 'bg-[#2B2325] text-white hover:bg-black'
                }`}
                title="Favorite"
              >
                <Heart
                  className={`w-4 h-4 ${isFavorite ? 'fill-current text-white' : 'stroke-[2]'}`}
                />
              </button>

              {/* Visibility eye toggle */}
              <button
                onClick={() => setHideControls((prev) => !prev)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title={hideControls ? 'Show Tools' : 'Hide Tools'}
              >
                {hideControls ? (
                  <EyeOff className="w-4 h-4 stroke-[2] text-[#A84457]" />
                ) : (
                  <Eye className="w-4 h-4 stroke-[2]" />
                )}
              </button>

              {/* Audio Note */}
              <button
                onClick={handleToggleAudio}
                className={`p-1.5 rounded-full transition-colors ${
                  isPlayingAudio ? 'text-[#A84457] scale-110' : 'hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                title="Play Sacred Solfeggio Chime"
              >
                <Music className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. Bottom Editing Sheet & Tools (Screenshot 5) */}
      <AnimatePresence>
        {!hideControls && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="w-full max-w-md mx-auto px-3 pb-2 pt-1"
          >
            {/* Expanded Tool Tray if a tool is active */}
            <AnimatePresence>
              {activeTool !== 'none' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-2 p-3 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-md overflow-hidden"
                >
                  {/* Tool Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#EFE9DF] dark:border-[#362D30] mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#7C706D] dark:text-[#A89F9E]">
                      {activeTool === 'image' && 'Select Background Artwork'}
                      {activeTool === 'background' && 'Select Color or Gradient'}
                      {activeTool === 'text' && 'Select Text Color'}
                      {activeTool === 'shadow' && 'Select Text Shadow'}
                      {activeTool === 'font' && 'Select Typography Font'}
                      {activeTool === 'size' && 'Adjust Text Size'}
                    </span>
                    <button
                      onClick={() => setActiveTool('none')}
                      className="text-xs font-semibold text-[#A84457] hover:underline"
                    >
                      Done
                    </button>
                  </div>

                  {/* 1. Image Tool Shelf */}
                  {activeTool === 'image' && (
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          soundEngine.playHapticTone();
                          setIsImageModalOpen(true);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#A84457] to-[#D91B5C] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm hover:opacity-95 transition-opacity"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Browse 5 Sources & 45+ Wallpapers</span>
                      </button>

                      <div className="grid grid-cols-4 gap-2">
                        {WALLPAPER_PRESETS.map((wp) => (
                          <button
                            key={wp.id}
                            onClick={() => {
                              soundEngine.playHapticTone();
                              setBackgroundType('image');
                              setBackgroundImage(wp.url);
                            }}
                            className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all group ${
                              backgroundType === 'image' && backgroundImage === wp.url
                                ? 'border-[#2D4A3E] dark:border-[#74A892] ring-2 ring-[#2D4A3E]/30'
                                : 'border-transparent hover:border-black/20'
                            }`}
                          >
                            <img
                              src={wp.url}
                              alt={wp.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1">
                              <span className="text-[9px] font-medium text-white line-clamp-1 leading-tight">
                                {wp.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Background Color / Gradient Tool Shelf */}
                  {activeTool === 'background' && (
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          soundEngine.playHapticTone();
                          setIsBackgroundModalOpen(true);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm hover:opacity-95 transition-opacity"
                      >
                        <Palette className="w-4 h-4" />
                        <span>Browse 45+ Colors & Gradients</span>
                      </button>

                      <div className="grid grid-cols-5 gap-2">
                        {COLOR_PRESETS.map((cp) => (
                          <button
                            key={cp.id}
                            onClick={() => {
                              soundEngine.playHapticTone();
                              if (cp.type === 'color') {
                                setBackgroundType('color');
                                setBackgroundColor(cp.value);
                              } else {
                                setBackgroundType('gradient');
                                setBackgroundGradient(cp.value);
                              }
                            }}
                            className="aspect-square rounded-xl relative border-2 border-white/40 shadow-xs hover:scale-105 transition-transform flex items-center justify-center"
                            style={{
                              background: cp.value,
                            }}
                            title={cp.label}
                          >
                            {((backgroundType === 'color' && backgroundColor === cp.value) ||
                              (backgroundType === 'gradient' && backgroundGradient === cp.value)) && (
                              <Check className="w-4 h-4 text-white drop-shadow-md" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Text Color Tool Shelf */}
                  {activeTool === 'text' && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-6 gap-2">
                        {TEXT_COLORS.map((tc) => (
                          <button
                            key={tc.id}
                            onClick={() => {
                              soundEngine.playHapticTone();
                              setTextColor(tc.value);
                            }}
                            className="aspect-square rounded-xl relative border-2 border-black/15 shadow-xs hover:scale-105 transition-transform flex items-center justify-center"
                            style={{ backgroundColor: tc.value }}
                            title={tc.label}
                          >
                            {textColor === tc.value && (
                              <Check
                                className="w-4 h-4 drop-shadow-md"
                                style={{
                                  color: tc.value === '#FFFFFF' || tc.value === '#FFF8E7' ? '#1F1617' : '#FFFFFF',
                                }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Shadow Tool Shelf */}
                  {activeTool === 'shadow' && (
                    <div className="grid grid-cols-3 gap-2">
                      {SHADOW_PRESETS.map((sp) => (
                        <button
                          key={sp.id}
                          onClick={() => {
                            soundEngine.playHapticTone();
                            setShadowStyle(sp.value);
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            shadowStyle === sp.value
                              ? 'border-[#2D4A3E] bg-[#2D4A3E]/10 dark:border-[#74A892] dark:bg-[#74A892]/10 font-bold'
                              : 'border-[#EFE9DF] dark:border-[#362D30] hover:bg-black/5'
                          }`}
                        >
                          <span className="text-xs">{sp.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 5. Font Family Tool Shelf */}
                  {activeTool === 'font' && (
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          soundEngine.playHapticTone();
                          setIsFontModalOpen(true);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm hover:opacity-95 transition-opacity"
                      >
                        <Type className="w-4 h-4" />
                        <span>Browse 28+ Google Fonts Library</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        {FONT_FAMILIES.map((ff) => (
                          <button
                            key={ff.id}
                            onClick={() => {
                              soundEngine.playHapticTone();
                              setFontFamily(ff.id);
                            }}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                              fontFamily === ff.id
                                ? 'border-[#2D4A3E] bg-[#2D4A3E]/10 dark:border-[#74A892] dark:bg-[#74A892]/10'
                                : 'border-[#EFE9DF] dark:border-[#362D30] hover:bg-black/5'
                            }`}
                          >
                            <span className="text-xs font-medium">{ff.name}</span>
                            <span className={`text-base font-bold ${ff.id}`}>{ff.sample}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. Font Size Tool Shelf */}
                  {activeTool === 'size' && (
                    <div className="space-y-3 py-1">
                      <div className="flex items-center justify-between text-xs text-[#7C706D]">
                        <span>Small (18px)</span>
                        <span className="font-bold text-[#1F1617] dark:text-[#FAF7F5]">{fontSize}px</span>
                        <span>Large (44px)</span>
                      </div>
                      <input
                        type="range"
                        min="18"
                        max="44"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-[#2D4A3E] dark:accent-[#74A892] cursor-pointer"
                      />
                      <div className="flex justify-center space-x-2">
                        {[22, 26, 28, 32, 36, 40].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setFontSize(sz)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              fontSize === sz
                                ? 'bg-[#2D4A3E] text-white'
                                : 'bg-[#EFE9DF] dark:bg-[#362D30]'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* The 2-Row Tool Shelf Matching Screenshot 5 Exactly */}
            <div className="rounded-3xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-xl p-3 space-y-3">
              {/* Row 1: Image, Background, Text, Shadow */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {/* 1. Image */}
                <button
                  onClick={() => {
                    soundEngine.playHapticTone();
                    setIsImageModalOpen(true);
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all ${
                    isImageModalOpen ? 'bg-[#2D4A3E]/10 dark:bg-[#74A892]/15' : 'hover:bg-black/5'
                  }`}
                >
                  <div className="w-14 h-9 rounded-xl border border-[#EFE9DF] dark:border-[#362D30] overflow-hidden flex items-center justify-center relative shadow-xs bg-[#FAF7F2] dark:bg-[#2A2325]">
                    <div className="flex items-center -space-x-2 scale-90">
                      <div className="w-6 h-7 rounded-md bg-amber-200 border border-amber-400 rotate-[-10deg] shadow-xs flex items-center justify-center text-[10px]">
                        🦋
                      </div>
                      <div className="w-6 h-7 rounded-md bg-rose-200 border border-rose-400 rotate-[8deg] shadow-xs flex items-center justify-center text-[10px]">
                        🕊️
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold mt-1 text-[#1F1617] dark:text-[#FAF7F5]">
                    Image
                  </span>
                </button>

                {/* 2. Background */}
                <button
                  onClick={() => {
                    soundEngine.playHapticTone();
                    setIsBackgroundModalOpen(true);
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all ${
                    isBackgroundModalOpen ? 'bg-[#2D4A3E]/10 dark:bg-[#74A892]/15' : 'hover:bg-black/5'
                  }`}
                >
                  <div
                    className="w-14 h-9 rounded-full border border-black/15 shadow-xs transition-transform flex items-center justify-center"
                    style={{
                      background: backgroundType === 'gradient' ? backgroundGradient : backgroundColor,
                    }}
                  >
                    <span
                      className="text-[10px] font-bold"
                      style={{
                        color: backgroundColor === '#FFFFFF' || backgroundColor === '#FAF7F2' ? '#1F1617' : '#FFFFFF',
                      }}
                    >
                      Aa
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold mt-1 text-[#1F1617] dark:text-[#FAF7F5]">
                    Background
                  </span>
                </button>

                {/* 3. Text */}
                <button
                  onClick={() => {
                    soundEngine.playHapticTone();
                    setActiveTool((prev) => (prev === 'text' ? 'none' : 'text'));
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all ${
                    activeTool === 'text' ? 'bg-[#2D4A3E]/10 dark:bg-[#74A892]/15' : 'hover:bg-black/5'
                  }`}
                >
                  <div
                    className="w-14 h-9 rounded-full border-2 border-black/30 dark:border-white/30 shadow-xs flex items-center justify-center"
                    style={{ backgroundColor: textColor }}
                  >
                    <span
                      className="text-xs font-bold font-mono"
                      style={{ color: textColor === '#FFFFFF' ? '#1F1617' : '#FFFFFF' }}
                    >
                      Aa
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold mt-1 text-[#1F1617] dark:text-[#FAF7F5]">
                    Text
                  </span>
                </button>

                {/* 4. Shadow */}
                <button
                  onClick={() => {
                    soundEngine.playHapticTone();
                    setActiveTool((prev) => (prev === 'shadow' ? 'none' : 'shadow'));
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all ${
                    activeTool === 'shadow' ? 'bg-[#2D4A3E]/10 dark:bg-[#74A892]/15' : 'hover:bg-black/5'
                  }`}
                >
                  <div className="w-14 h-9 rounded-full border border-[#D5CEC2] dark:border-[#473C3F] bg-white dark:bg-[#262022] shadow-xs flex items-center justify-center">
                    {/* Dotted matrix pattern matching Screenshot 5 */}
                    <div className="grid grid-cols-3 gap-0.5 scale-90">
                      <div className="w-1 h-1 rounded-full bg-[#7C706D]" />
                      <div className="w-1 h-1 rounded-full bg-[#7C706D]" />
                      <div className="w-1 h-1 rounded-full bg-[#7C706D]" />
                      <div className="w-1 h-1 rounded-full bg-[#7C706D]" />
                      <div className="w-1 h-1 rounded-full bg-[#1F1617] dark:bg-white" />
                      <div className="w-1 h-1 rounded-full bg-[#7C706D]" />
                      <div className="w-1 h-1 rounded-full bg-[#7C706D]" />
                      <div className="w-1 h-1 rounded-full bg-[#7C706D]" />
                      <div className="w-1 h-1 rounded-full bg-[#7C706D]" />
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold mt-1 text-[#1F1617] dark:text-[#FAF7F5]">
                    Shadow
                  </span>
                </button>
              </div>

              {/* Row 2: Font, Align, Weight, Size */}
              <div className="grid grid-cols-4 gap-2 text-center pt-1 border-t border-[#EFE9DF] dark:border-[#362D30]">
                {/* Font */}
                <button
                  onClick={() => {
                    soundEngine.playHapticTone();
                    setIsFontModalOpen(true);
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all ${
                    isFontModalOpen ? 'bg-[#2D4A3E]/10 dark:bg-[#74A892]/15' : 'hover:bg-black/5'
                  }`}
                >
                  <span className={`text-xl font-medium tracking-tight ${fontFamily}`}>
                    Aa
                  </span>
                  <span className="text-[11px] font-semibold mt-0.5 text-[#1F1617] dark:text-[#FAF7F5]">
                    Font
                  </span>
                </button>

                {/* Align */}
                <button
                  onClick={handleToggleAlign}
                  className="flex flex-col items-center justify-center p-1.5 rounded-2xl hover:bg-black/5 transition-all"
                  title="Cycle Alignment"
                >
                  <div className="h-6 flex items-center justify-center">
                    {textAlign === 'center' && <AlignCenter className="w-5 h-5 text-[#1F1617] dark:text-[#FAF7F5]" />}
                    {textAlign === 'left' && <AlignLeft className="w-5 h-5 text-[#1F1617] dark:text-[#FAF7F5]" />}
                    {textAlign === 'right' && <AlignRight className="w-5 h-5 text-[#1F1617] dark:text-[#FAF7F5]" />}
                  </div>
                  <span className="text-[11px] font-semibold mt-0.5 text-[#1F1617] dark:text-[#FAF7F5]">
                    Align
                  </span>
                </button>

                {/* Weight */}
                <button
                  onClick={handleToggleWeight}
                  className="flex flex-col items-center justify-center p-1.5 rounded-2xl hover:bg-black/5 transition-all"
                  title="Cycle Weight"
                >
                  <span className="text-xl font-bold">B</span>
                  <span className="text-[11px] font-semibold mt-0.5 text-[#1F1617] dark:text-[#FAF7F5]">
                    Weight
                  </span>
                </button>

                {/* Size */}
                <button
                  onClick={() => {
                    soundEngine.playHapticTone();
                    setActiveTool((prev) => (prev === 'size' ? 'none' : 'size'));
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all ${
                    activeTool === 'size' ? 'bg-[#2D4A3E]/10 dark:bg-[#74A892]/15' : 'hover:bg-black/5'
                  }`}
                  title="Adjust Size"
                >
                  <span className="text-xl font-medium font-mono">{fontSize}</span>
                  <span className="text-[11px] font-semibold mt-0.5 text-[#1F1617] dark:text-[#FAF7F5]">
                    Size
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Sliding Image Source Modal (Camera, Gallery, Believe backgrounds, Unsplash, GIPHY) */}
      <ImageSourceModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelectImage={(url) => {
          setBackgroundType('image');
          setBackgroundImage(url);
          showToast('Image wallpaper applied!');
        }}
        onSelectColorOrGradient={(type, val) => {
          if (type === 'gradient') {
            setBackgroundType('gradient');
            setBackgroundGradient(val);
          } else {
            setBackgroundType('color');
            setBackgroundColor(val);
          }
          showToast('Theme background applied!');
        }}
      />

      {/* 2. Sliding Background Picker Modal (45+ Colors & Gradients with "Aa" sample preview) */}
      <BackgroundPickerModal
        isOpen={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
        backgroundType={backgroundType}
        backgroundColor={backgroundColor}
        backgroundGradient={backgroundGradient}
        onSelectColor={(color) => {
          setBackgroundType('color');
          setBackgroundColor(color);
          showToast('Solid color background applied!');
        }}
        onSelectGradient={(gradient) => {
          setBackgroundType('gradient');
          setBackgroundGradient(gradient);
          showToast('Gradient background applied!');
        }}
      />

      {/* 3. Sliding Font Picker Modal (28+ Google Fonts with Live Typography & Filters) */}
      <FontPickerModal
        isOpen={isFontModalOpen}
        onClose={() => setIsFontModalOpen(false)}
        selectedFont={fontFamily}
        onSelectFont={(fontCls) => {
          setFontFamily(fontCls);
          showToast('Typography font applied!');
        }}
      />

      {/* Save or Exit Confirmation Dialog matching user request */}
      <AnimatePresence>
        {showExitConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitConfirm(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
            />

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
                  Would you like to save this custom art creation to your sanctuary, or exit without saving changes?
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    handleSaveTheme();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#2D4A3E] dark:bg-[#52796F] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Exit</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playHapticTone();
                    setShowExitConfirm(false);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#EFE9DF] dark:bg-[#2D2427] text-[#7C706D] dark:text-[#D1C7C5] hover:text-[#1F1617] text-xs font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Exit without Saving</span>
                </button>

                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="w-full py-2 text-xs font-medium text-[#7C706D] hover:underline"
                >
                  Keep Editing
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
