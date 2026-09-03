import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  Image as ImageIcon,
  Layers,
  Search,
  ChevronLeft,
  Upload,
  Check,
  Smile,
  Flame,
  Sticker,
  Film,
  Minus,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { ART_THEMES } from '../data/artThemesData';
import { soundEngine } from '../services/audioSynthesizer';

interface ImageSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  onSelectColorOrGradient?: (type: 'color' | 'gradient', value: string) => void;
}

type SubView = 'main' | 'gallery' | 'believe' | 'unsplash' | 'giphy';

// Curated 48+ wallpaper images derived directly from high-quality curated collection
const IMAGE_THEMES = ART_THEMES.filter((t) => t.category === 'images');

const UNSPLASH_IMAGES = IMAGE_THEMES.map((t, idx) => ({
  id: `u-${idx + 1}`,
  title: t.name,
  query: t.name.toLowerCase(),
  url: t.backgroundImage || '',
}));

const GALLERY_RECENT_PHOTOS = IMAGE_THEMES.map((t) => t.backgroundImage || '').filter(Boolean);

// GIPHY items (Screenshots 10, 11, 12)
const GIPHY_GIFS = [
  { id: 'g1', title: 'Serene Starlight', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80' },
  { id: 'g2', title: 'Peaceful Waves', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { id: 'g3', title: 'Sakura Petals', url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=600&q=80' },
  { id: 'g4', title: 'Golden Sunset', url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80' },
];

const GIPHY_STICKERS = [
  { id: 's1', label: 'Good Night Moon', icon: '🌙', desc: 'Good night stars' },
  { id: 's2', label: 'Sparkle Heart', icon: '💖', desc: 'Love & peace' },
  { id: 's3', label: 'Celebration Confetti', icon: '🎉', desc: 'Blessing & joy' },
  { id: 's4', label: 'Spiritual Lotus', icon: '🪷', desc: 'Inner enlightenment' },
  { id: 's5', label: 'Flying Butterfly', icon: '🦋', desc: 'Transformation' },
  { id: 's6', label: 'Peace Dove', icon: '🕊️', desc: 'Serene tranquility' },
  { id: 's7', label: 'Sun Radiance', icon: '☀️', desc: 'Positive energy' },
  { id: 's8', label: 'Zen Crystal', icon: '💎', desc: 'Clarity of mind' },
];

const GIPHY_3D_EMOJIS = [
  '🙏', '✨', '💖', '🕊️', '🦋', '🌸', '🪷', '🌟', '🧘‍♀️', '💫', '🌿', '🌅', '🕯️', '👑', '🌈', '🌻'
];

export const ImageSourceModal: React.FC<ImageSourceModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  onSelectColorOrGradient,
}) => {
  const [currentView, setCurrentView] = useState<SubView>('main');
  const [unsplashSearch, setUnsplashSearch] = useState('');
  const [galleryTab, setGalleryTab] = useState<'photos' | 'albums'>('photos');
  const [giphyTab, setGiphyTab] = useState<'gifs' | 'stickers' | 'emojis'>('gifs');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollUp = () => {
    soundEngine.playHapticTone();
    scrollContainerRef.current?.scrollBy({ top: -280, behavior: 'smooth' });
  };

  const handleScrollDown = () => {
    soundEngine.playHapticTone();
    scrollContainerRef.current?.scrollBy({ top: 280, behavior: 'smooth' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      soundEngine.playSacredBell();
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSelectImage(reader.result);
          onClose();
          setCurrentView('main');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredUnsplash = UNSPLASH_IMAGES.filter((img) =>
    unsplashSearch.trim() === ''
      ? true
      : img.title.toLowerCase().includes(unsplashSearch.toLowerCase()) ||
        img.query.toLowerCase().includes(unsplashSearch.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              onClose();
              setCurrentView('main');
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Upside / Downside auto-scroll sliding bottom sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 max-w-md mx-auto z-50 bg-[#FAF7F2] dark:bg-[#1C1719] rounded-t-3xl border-t border-[#EFE9DF] dark:border-[#382F32] shadow-2xl flex flex-col max-h-[88vh] overflow-hidden"
          >
            {/* Hidden native inputs for Camera and Gallery upload */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Top Drag Handle that works to close */}
            <div
              onClick={() => {
                soundEngine.playHapticTone();
                onClose();
                setCurrentView('main');
              }}
              className="pt-3 pb-1 flex items-center justify-center cursor-pointer group"
              title="Tap handle to close"
            >
              <div className="w-12 h-1.5 rounded-full bg-[#D5CEC2] dark:bg-[#473C3F] group-hover:bg-[#A84457] group-hover:w-16 transition-all" />
            </div>

            {/* VIEW 1: Main "Pick an image source" Menu (Screenshot 6) */}
            {currentView === 'main' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <div className="px-5 pt-0.5 pb-2.5 flex items-start justify-between border-b border-[#EFE9DF] dark:border-[#332A2D]">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#A84457] dark:text-[#E07A8D] uppercase">
                      Create Your Art
                    </span>
                    <h2 className="text-xl font-playfair font-bold text-[#1F1617] dark:text-[#FAF7F5] mt-0.5">
                      Pick an image source
                    </h2>
                    <p className="text-xs text-[#7C706D] dark:text-[#A89F9E] mt-0.5">
                      Choose a photo, a Believe background ({ART_THEMES.length}+ choices), or online search.
                    </p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        soundEngine.playHapticTone();
                        onClose();
                        setCurrentView('main');
                      }}
                      className="p-2 -mr-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#7C706D] dark:text-[#A89F9E]"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* List of 5 Options Matching Screenshot 6 */}
                <div className="p-4 space-y-2.5 overflow-y-auto">
                  {/* 1. Camera */}
                  <button
                    onClick={() => {
                      soundEngine.playHapticTone();
                      cameraInputRef.current?.click();
                    }}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-[#241E20] border border-[#EFE9DF] dark:border-[#362D30] hover:border-[#2D4A3E] dark:hover:border-[#52796F] shadow-xs flex items-center space-x-4 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Camera className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1F1617] dark:text-[#FAF7F5]">Camera</h3>
                      <p className="text-xs text-[#7C706D] dark:text-[#A89F9E]">Capture the perfect moment!</p>
                    </div>
                  </button>

                  {/* 2. Gallery */}
                  <button
                    onClick={() => {
                      soundEngine.playHapticTone();
                      setCurrentView('gallery');
                    }}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-[#241E20] border border-[#EFE9DF] dark:border-[#362D30] hover:border-[#2D4A3E] dark:hover:border-[#52796F] shadow-xs flex items-center space-x-4 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ImageIcon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1F1617] dark:text-[#FAF7F5]">Gallery</h3>
                      <p className="text-xs text-[#7C706D] dark:text-[#A89F9E]">Pick an image from your gallery!</p>
                    </div>
                  </button>

                  {/* 3. Believe Backgrounds */}
                  <button
                    onClick={() => {
                      soundEngine.playHapticTone();
                      setCurrentView('believe');
                    }}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-[#241E20] border border-[#EFE9DF] dark:border-[#362D30] hover:border-[#2D4A3E] dark:hover:border-[#52796F] shadow-xs flex items-center space-x-4 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Layers className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1F1617] dark:text-[#FAF7F5]">Believe backgrounds</h3>
                      <p className="text-xs text-[#7C706D] dark:text-[#A89F9E]">
                        Beautiful backgrounds ready to use! (45+ choices)
                      </p>
                    </div>
                  </button>

                  {/* 4. Search Images (Unsplash) */}
                  <button
                    onClick={() => {
                      soundEngine.playHapticTone();
                      setCurrentView('unsplash');
                    }}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-[#241E20] border border-[#EFE9DF] dark:border-[#362D30] hover:border-[#2D4A3E] dark:hover:border-[#52796F] shadow-xs flex items-center space-x-4 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Search className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1F1617] dark:text-[#FAF7F5]">Search images</h3>
                      <p className="text-xs text-[#7C706D] dark:text-[#A89F9E]">Browse images from Unsplash</p>
                    </div>
                  </button>

                  {/* 5. Search GIPHY */}
                  <button
                    onClick={() => {
                      soundEngine.playHapticTone();
                      setCurrentView('giphy');
                    }}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-[#241E20] border border-[#EFE9DF] dark:border-[#362D30] hover:border-[#2D4A3E] dark:hover:border-[#52796F] shadow-xs flex items-center space-x-4 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Sparkles className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-[#1F1617] dark:text-[#FAF7F5]">Search GIPHY</h3>
                        <span className="px-1.5 py-0.5 rounded-md bg-black text-white dark:bg-white dark:text-black text-[9px] font-black tracking-wider">
                          GIPHY
                        </span>
                      </div>
                      <p className="text-xs text-[#7C706D] dark:text-[#A89F9E]">Search for a GIF, Sticker or Emoji</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 2: Gallery Subview (Screenshot 7) */}
            {currentView === 'gallery' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-4 pt-1 pb-2.5 flex items-center justify-between border-b border-[#EFE9DF] dark:border-[#332A2D]">
                  <button
                    onClick={() => setCurrentView('main')}
                    className="p-1.5 -ml-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center text-xs font-semibold text-[#1F1617] dark:text-[#FAF7F5]"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    <span>Back</span>
                  </button>
                  <h2 className="text-base font-bold">Your Gallery ({GALLERY_RECENT_PHOTOS.length})</h2>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-[#2D4A3E] text-white text-xs font-semibold flex items-center space-x-1 shadow-xs mr-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Browse</span>
                    </button>
                    <button
                      onClick={handleScrollUp}
                      className="p-1.5 rounded-lg bg-[#EFE9DF] dark:bg-[#2E2628] hover:bg-[#A84457] hover:text-white transition-colors"
                      title="Scroll upside"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleScrollDown}
                      className="p-1.5 rounded-lg bg-[#EFE9DF] dark:bg-[#2E2628] hover:bg-[#A84457] hover:text-white transition-colors"
                      title="Scroll downside"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tabs: Photos / Albums */}
                <div className="flex border-b border-[#EFE9DF] dark:border-[#332A2D] px-4">
                  <button
                    onClick={() => setGalleryTab('photos')}
                    className={`flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition-all ${
                      galleryTab === 'photos'
                        ? 'border-[#2D4A3E] text-[#2D4A3E] dark:border-[#52796F] dark:text-[#A3C9B8]'
                        : 'border-transparent text-[#7C706D]'
                    }`}
                  >
                    Photos ({GALLERY_RECENT_PHOTOS.length})
                  </button>
                  <button
                    onClick={() => setGalleryTab('albums')}
                    className={`flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition-all ${
                      galleryTab === 'albums'
                        ? 'border-[#2D4A3E] text-[#2D4A3E] dark:border-[#52796F] dark:text-[#A3C9B8]'
                        : 'border-transparent text-[#7C706D]'
                    }`}
                  >
                    Albums
                  </button>
                </div>

                {/* Photo Grid */}
                <div ref={scrollContainerRef} className="p-3 overflow-y-auto flex-1">
                  <div className="grid grid-cols-3 gap-2">
                    {GALLERY_RECENT_PHOTOS.map((url, i) => (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          soundEngine.playHapticTone();
                          onSelectImage(url);
                          onClose();
                          setCurrentView('main');
                        }}
                        className="relative aspect-square rounded-xl overflow-hidden border border-black/10 hover:border-[#2D4A3E] transition-all group"
                      >
                        <img
                          src={url}
                          alt="Gallery item"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: Believe Backgrounds Subview (Screenshot 8) */}
            {currentView === 'believe' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-4 pt-1 pb-2.5 flex items-center justify-between border-b border-[#EFE9DF] dark:border-[#332A2D]">
                  <button
                    onClick={() => setCurrentView('main')}
                    className="p-1.5 -ml-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center text-xs font-semibold text-[#1F1617] dark:text-[#FAF7F5]"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    <span>Back</span>
                  </button>
                  <h2 className="text-base font-bold">Believe Backgrounds ({ART_THEMES.length})</h2>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handleScrollUp}
                      className="p-1.5 rounded-lg bg-[#EFE9DF] dark:bg-[#2E2628] hover:bg-[#A84457] hover:text-white transition-colors"
                      title="Scroll upside"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleScrollDown}
                      className="p-1.5 rounded-lg bg-[#EFE9DF] dark:bg-[#2E2628] hover:bg-[#A84457] hover:text-white transition-colors"
                      title="Scroll downside"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3-Column Scrollable Grid */}
                <div ref={scrollContainerRef} className="p-3 overflow-y-auto flex-1">
                  <div className="grid grid-cols-3 gap-2.5">
                    {ART_THEMES.map((theme) => (
                      <motion.button
                        key={theme.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          soundEngine.playHapticTone();
                          if (theme.type === 'image' && theme.backgroundImage) {
                            onSelectImage(theme.backgroundImage);
                          } else if (theme.type === 'gradient' && theme.backgroundGradient && onSelectColorOrGradient) {
                            onSelectColorOrGradient('gradient', theme.backgroundGradient);
                          } else if (theme.type === 'color' && theme.backgroundColor && onSelectColorOrGradient) {
                            onSelectColorOrGradient('color', theme.backgroundColor);
                          }
                          onClose();
                          setCurrentView('main');
                        }}
                        className="relative aspect-[9/14] rounded-xl overflow-hidden border border-black/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-2 text-left group"
                        style={{
                          backgroundImage: theme.type === 'image' ? `url(${theme.backgroundImage})` : undefined,
                          background:
                            theme.type === 'gradient'
                              ? theme.backgroundGradient
                              : theme.type === 'color'
                              ? theme.backgroundColor
                              : undefined,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        {/* Sample Aa badge */}
                        <div className="flex justify-between items-start">
                          <span
                            className="px-1.5 py-0.5 rounded-md bg-black/20 backdrop-blur-xs text-[10px] font-bold"
                            style={{ color: theme.textColor }}
                          >
                            {theme.sampleText || 'Aa'}
                          </span>
                        </div>

                        <div className="bg-black/40 backdrop-blur-xs p-1 rounded-md">
                          <span className="text-[10px] font-medium text-white line-clamp-1 leading-tight">
                            {theme.name}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: Unsplash Search Subview (Screenshot 9) */}
            {currentView === 'unsplash' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-4 pt-1 pb-2.5 flex items-center justify-between border-b border-[#EFE9DF] dark:border-[#332A2D]">
                  <button
                    onClick={() => setCurrentView('main')}
                    className="p-1.5 -ml-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center text-xs font-semibold text-[#1F1617] dark:text-[#FAF7F5]"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    <span>Back</span>
                  </button>
                  <h2 className="text-base font-bold">Search Unsplash ({UNSPLASH_IMAGES.length})</h2>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handleScrollUp}
                      className="p-1.5 rounded-lg bg-[#EFE9DF] dark:bg-[#2E2628] hover:bg-[#A84457] hover:text-white transition-colors"
                      title="Scroll upside"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleScrollDown}
                      className="p-1.5 rounded-lg bg-[#EFE9DF] dark:bg-[#2E2628] hover:bg-[#A84457] hover:text-white transition-colors"
                      title="Scroll downside"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Search Bar matching Screenshot 9 */}
                <div className="p-3 bg-white/60 dark:bg-[#231D1F]/60 border-b border-[#EFE9DF] dark:border-[#332A2D]">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7C706D]" />
                    <input
                      type="text"
                      placeholder="Search photos (e.g. lake, puppy, cosmos, sunset)..."
                      value={unsplashSearch}
                      onChange={(e) => setUnsplashSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-[#181415] border border-[#E8E1D5] dark:border-[#3A3034] text-[#1F1617] dark:text-[#FAF7F5] focus:outline-hidden focus:border-[#A84457]"
                    />
                  </div>
                </div>

                {/* 3-Column Image Grid matching Screenshot 9 */}
                <div ref={scrollContainerRef} className="p-3 overflow-y-auto flex-1">
                  <div className="grid grid-cols-3 gap-2">
                    {filteredUnsplash.map((img) => (
                      <motion.button
                        key={img.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          soundEngine.playHapticTone();
                          onSelectImage(img.url);
                          onClose();
                          setCurrentView('main');
                        }}
                        className="relative aspect-square rounded-xl overflow-hidden border border-black/10 hover:border-[#2D4A3E] transition-all group shadow-2xs"
                      >
                        <img
                          src={img.url}
                          alt={img.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1">
                          <span className="text-[9px] font-medium text-white line-clamp-1 leading-tight">
                            {img.title}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 5: GIPHY Subview (Screenshots 10, 11, 12) */}
            {currentView === 'giphy' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-4 pt-1 pb-2 flex items-center justify-between border-b border-[#EFE9DF] dark:border-[#332A2D]">
                  <button
                    onClick={() => setCurrentView('main')}
                    className="p-1.5 -ml-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center text-xs font-semibold text-[#1F1617] dark:text-[#FAF7F5]"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    <span>Back</span>
                  </button>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-base font-bold">Search GIPHY</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-black text-white dark:bg-white dark:text-black text-[9px] font-black">
                      GIPHY
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handleScrollUp}
                      className="p-1.5 rounded-lg bg-[#EFE9DF] dark:bg-[#2E2628] hover:bg-[#A84457] hover:text-white transition-colors"
                      title="Scroll upside"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleScrollDown}
                      className="p-1.5 rounded-lg bg-[#EFE9DF] dark:bg-[#2E2628] hover:bg-[#A84457] hover:text-white transition-colors"
                      title="Scroll downside"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3 Tabs: GIFs / Stickers / Emojis (Screenshots 10, 11, 12) */}
                <div className="flex border-b border-[#EFE9DF] dark:border-[#332A2D] px-4">
                  <button
                    onClick={() => setGiphyTab('gifs')}
                    className={`flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition-all flex items-center justify-center space-x-1 ${
                      giphyTab === 'gifs'
                        ? 'border-[#2D4A3E] text-[#2D4A3E] dark:border-[#52796F] dark:text-[#A3C9B8]'
                        : 'border-transparent text-[#7C706D]'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>GIFs</span>
                  </button>
                  <button
                    onClick={() => setGiphyTab('stickers')}
                    className={`flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition-all flex items-center justify-center space-x-1 ${
                      giphyTab === 'stickers'
                        ? 'border-[#2D4A3E] text-[#2D4A3E] dark:border-[#52796F] dark:text-[#A3C9B8]'
                        : 'border-transparent text-[#7C706D]'
                    }`}
                  >
                    <Sticker className="w-3.5 h-3.5" />
                    <span>Stickers</span>
                  </button>
                  <button
                    onClick={() => setGiphyTab('emojis')}
                    className={`flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition-all flex items-center justify-center space-x-1 ${
                      giphyTab === 'emojis'
                        ? 'border-[#2D4A3E] text-[#2D4A3E] dark:border-[#52796F] dark:text-[#A3C9B8]'
                        : 'border-transparent text-[#7C706D]'
                    }`}
                  >
                    <Smile className="w-3.5 h-3.5" />
                    <span>Emojis</span>
                  </button>
                </div>

                {/* GIPHY Tab Content */}
                <div className="p-3 overflow-y-auto flex-1">
                  {giphyTab === 'gifs' && (
                    <div className="grid grid-cols-2 gap-2">
                      {GIPHY_GIFS.map((gif) => (
                        <motion.button
                          key={gif.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            soundEngine.playHapticTone();
                            onSelectImage(gif.url);
                            onClose();
                            setCurrentView('main');
                          }}
                          className="relative aspect-video rounded-xl overflow-hidden border border-black/10 hover:border-[#2D4A3E] transition-all group"
                        >
                          <img
                            src={gif.url}
                            alt={gif.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span className="text-xs font-bold text-white shadow-md">{gif.title}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {giphyTab === 'stickers' && (
                    <div className="grid grid-cols-4 gap-3">
                      {GIPHY_STICKERS.map((stk) => (
                        <motion.button
                          key={stk.id}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            soundEngine.playTibetanBowl();
                            // If a sticker is tapped, we can create an aesthetic background or set a backdrop
                            onSelectImage('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80');
                            onClose();
                            setCurrentView('main');
                          }}
                          className="p-3 rounded-2xl bg-white dark:bg-[#262022] border border-[#EFE9DF] dark:border-[#382F32] flex flex-col items-center justify-center hover:scale-105 transition-transform"
                        >
                          <span className="text-3xl animate-bounce-short">{stk.icon}</span>
                          <span className="text-[10px] font-semibold mt-1 text-center line-clamp-1">{stk.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {giphyTab === 'emojis' && (
                    <div className="grid grid-cols-4 gap-3">
                      {GIPHY_3D_EMOJIS.map((emoji, idx) => (
                        <motion.button
                          key={idx}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => {
                            soundEngine.playTone(660, 0.1);
                            onClose();
                            setCurrentView('main');
                          }}
                          className="p-3 rounded-2xl bg-white dark:bg-[#262022] border border-[#EFE9DF] dark:border-[#382F32] flex items-center justify-center hover:scale-110 transition-transform text-3xl"
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
