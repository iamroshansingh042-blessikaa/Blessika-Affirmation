import React from 'react';

interface CategoryArtworkProps {
  theme: string;
  name: string;
  className?: string;
}

// Curated high-res aesthetic thematic imagery matching each category
const THEMATIC_PHOTOS: Record<string, string> = {
  universe: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
  thinker: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
  inspiring: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80',
  emojis: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
  mandala: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
  phone_quote: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
  compliment: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  angel: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  journal: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
  envelope: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?auto=format&fit=crop&w=600&q=80',
  prayer_hands: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
  gratitude: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80',
  yogi_sunset: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
  open_arms: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
  magnet: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
  butterfly: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=600&q=80',
  prism_soul: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  herbal_tree: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
  workout: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
  bath: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  morning_tea: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
  morning_stretch: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
  cozy_sleep: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=600&q=80',
  sunset_couple: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
  intimate_embrace: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
  radiant_eye: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=600&q=80',
  parent_child: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=600&q=80',
  pregnancy_belly: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
  teens_kids: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80',
  laptop: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
  piggy_bank: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
  paint_splash: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80',
  books: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
  clock_alarm: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80',
  drawing_sketch: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
};

// Fallback background color gradients
const THEMATIC_GRADIENTS: Record<string, string> = {
  universe: 'from-[#0F172A] via-[#1E1B4B] to-[#312E81]',
  thinker: 'from-[#134E4A] via-[#115E59] to-[#042F2E]',
  inspiring: 'from-[#831843] via-[#9D174D] to-[#4C0519]',
  emojis: 'from-[#854D0E] via-[#A16207] to-[#713F12]',
  mandala: 'from-[#4C0519] via-[#831843] to-[#701A75]',
  prayer_hands: 'from-[#78350F] via-[#92400E] to-[#451A03]',
  yogi_sunset: 'from-[#4C0519] via-[#831843] to-[#1E1B4B]',
  cozy_sleep: 'from-[#0F172A] via-[#1E293B] to-[#020617]',
  butterfly: 'from-[#713F12] via-[#365314] to-[#14532D]',
  laptop: 'from-[#0F172A] via-[#1E3A8A] to-[#172554]',
  piggy_bank: 'from-[#78350F] via-[#A16207] to-[#451A03]',
  paint_splash: 'from-[#581C87] via-[#701A75] to-[#831843]',
};

export const CategoryArtwork: React.FC<CategoryArtworkProps> = ({ theme, name, className = 'w-full h-full' }) => {
  const photoUrl = THEMATIC_PHOTOS[theme] || 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80';
  const gradientClass = THEMATIC_GRADIENTS[theme] || 'from-[#1E191A] via-[#241E20] to-[#171314]';

  return (
    <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br ${gradientClass}`}>
      {/* 1. High Quality Thematic Photographic Layer */}
      <img
        src={photoUrl}
        alt={name}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
      />

      {/* 2. Soft Ambient Gradient Tint Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40 pointer-events-none" />

      {/* 3. Live Animated SVG Art & Dynamic Particles Layer */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {renderAnimatedOverlay(theme)}
      </div>

      {/* 4. Sweeping Luxury Shimmer Beam */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer-gleam" />
      </div>
    </div>
  );
};

// Render custom micro-animations matching the specific category theme
function renderAnimatedOverlay(theme: string) {
  switch (theme) {
    case 'universe':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-indigo-300">
          {/* Rotating Planetary Ring */}
          <g className="animate-spin-slow origin-center">
            <ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" strokeDasharray="4 2" />
            <circle cx="88" cy="50" r="2.5" fill="#FFE5A3" />
          </g>
          {/* Central Pulsing Planet */}
          <circle cx="50" cy="50" r="14" fill="#6366F1" className="animate-aura origin-center" opacity="0.8" />
          <circle cx="50" cy="50" r="10" fill="#E0E7FF" opacity="0.9" />
          {/* Twinkling Cosmos Stars */}
          <circle cx="20" cy="25" r="1.5" fill="#FFF" className="animate-twinkle-1" />
          <circle cx="80" cy="20" r="2" fill="#FFF" className="animate-twinkle-2" />
          <circle cx="75" cy="78" r="1.5" fill="#FFE5A3" className="animate-twinkle-3" />
          <circle cx="25" cy="75" r="1.2" fill="#FFF" className="animate-twinkle-1" />
        </svg>
      );

    case 'thinker':
    case 'inspiring':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-200">
          {/* Luminous Expanding Thought Waves */}
          <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="1" className="animate-ripple origin-center" opacity="0.8" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="1" className="animate-ripple origin-center" style={{ animationDelay: '1.2s' }} opacity="0.5" />
          <g className="animate-float origin-center">
            <circle cx="50" cy="45" r="12" fill="#D97706" opacity="0.6" />
            <text x="50" y="52" fill="#FFF" fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="serif">?</text>
          </g>
          <circle cx="32" cy="28" r="1.5" fill="#FFF" className="animate-twinkle-1" />
          <circle cx="68" cy="28" r="1.5" fill="#FFF" className="animate-twinkle-2" />
        </svg>
      );

    case 'emojis':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          <g className="animate-float origin-center">
            {/* Playful smiling sun / face */}
            <circle cx="50" cy="50" r="20" fill="#FBBF24" className="animate-aura origin-center" />
            <circle cx="43" cy="45" r="2.5" fill="#78350F" />
            <circle cx="57" cy="45" r="2.5" fill="#78350F" />
            <path d="M43 53 Q50 62 57 53" stroke="#78350F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
          {/* Floating Sparkling Hearts */}
          <g className="animate-drift origin-center">
            <path d="M72 30 C70 26 64 26 64 30 C64 36 72 40 72 40 C72 40 80 36 80 30 C80 26 74 26 72 30 Z" fill="#F43F5E" opacity="0.85" />
          </g>
        </svg>
      );

    case 'mandala':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-300">
          <circle cx="50" cy="50" r="26" fill="#F59E0B" opacity="0.2" className="animate-aura origin-center" />
          {/* Rotating Sacred Mandala Petals */}
          <g className="animate-spin-slow origin-center">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 50 50)`}>
                <path d="M50 20 Q54 34 50 40 Q46 34 50 20" fill="currentColor" opacity="0.85" />
                <circle cx="50" cy="20" r="1.5" fill="#FFF" />
              </g>
            ))}
          </g>
          {/* Center Om / Core Light */}
          <circle cx="50" cy="50" r="7" fill="#FFF" className="animate-sacred-pulse origin-center" />
        </svg>
      );

    case 'prayer_hands':
    case 'gratitude':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-200">
          {/* Luminous Golden Aura Halo */}
          <circle cx="50" cy="45" r="24" fill="#FDE68A" opacity="0.3" className="animate-aura origin-center" />
          <g className="animate-float origin-center">
            {/* Serene Prayer Hands */}
            <path d="M50 30 C45 36 44 54 50 62 C56 54 55 36 50 30 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
            <line x1="50" y1="34" x2="50" y2="58" stroke="#D97706" strokeWidth="1" />
          </g>
          {/* Rising Light Rays */}
          <circle cx="28" cy="30" r="1.5" fill="#FFF" className="animate-twinkle-1" />
          <circle cx="72" cy="30" r="1.5" fill="#FFF" className="animate-twinkle-2" />
        </svg>
      );

    case 'yogi_sunset':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-rose-300">
          {/* Glowing Golden Sun */}
          <circle cx="50" cy="45" r="18" fill="#F59E0B" className="animate-aura origin-center" opacity="0.7" />
          {/* Meditating Yogi Silhouette */}
          <g className="animate-float origin-center">
            <circle cx="50" cy="40" r="5" fill="#1C1917" />
            <path d="M44 48 C42 56 36 60 36 64 L64 64 C64 60 58 56 56 48 Z" fill="#1C1917" />
          </g>
          {/* Expanding Harmonic Ring */}
          <circle cx="50" cy="45" r="32" fill="none" stroke="#FDE68A" strokeWidth="1" className="animate-ripple origin-center" opacity="0.5" />
        </svg>
      );

    case 'butterfly':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-300">
          {/* Fluttering Golden Butterfly */}
          <g className="animate-butterfly origin-center">
            <g transform="translate(50, 48)">
              {/* Top Wings */}
              <path d="M0 0 C-18 -20 -28 -5 -12 6 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
              <path d="M0 0 C18 -20 28 -5 12 6 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
              {/* Bottom Wings */}
              <path d="M0 4 C-14 8 -12 20 0 14 Z" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
              <path d="M0 4 C14 8 12 20 0 14 Z" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
              {/* Body */}
              <ellipse cx="0" cy="5" rx="1.5" ry="7" fill="#451A03" />
            </g>
          </g>
          {/* Drifting Golden Pollen */}
          <circle cx="30" cy="35" r="1.5" fill="#FFF" className="animate-twinkle-1" />
          <circle cx="70" cy="65" r="1.2" fill="#FDE68A" className="animate-twinkle-2" />
        </svg>
      );

    case 'angel':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-100">
          {/* Luminous Halo */}
          <ellipse cx="50" cy="28" rx="10" ry="3" fill="none" stroke="#FDE68A" strokeWidth="1.5" className="animate-aura origin-center" />
          {/* Shimmering Wings */}
          <g className="animate-float origin-center">
            <path d="M45 42 C20 18 8 36 28 52 C38 60 45 52 48 44 Z" fill="#FEF3C7" opacity="0.85" />
            <path d="M55 42 C80 18 92 36 72 52 C62 60 55 52 52 44 Z" fill="#FEF3C7" opacity="0.85" />
            <circle cx="50" cy="36" r="6" fill="#FFF" />
          </g>
          <circle cx="22" cy="25" r="1.5" fill="#FFF" className="animate-twinkle-1" />
          <circle cx="78" cy="25" r="1.5" fill="#FFF" className="animate-twinkle-2" />
        </svg>
      );

    case 'cozy_sleep':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-indigo-200">
          {/* Glowing Crescent Moon */}
          <g className="animate-float origin-center">
            <path d="M45 30 A18 18 0 0 0 62 55 A22 22 0 1 1 45 30 Z" fill="#FDE68A" className="animate-aura origin-center" />
          </g>
          {/* Twinkling Starlight Night */}
          <circle cx="25" cy="35" r="2" fill="#FFF" className="animate-twinkle-1" />
          <circle cx="75" cy="30" r="1.5" fill="#FFF" className="animate-twinkle-2" />
          <circle cx="35" cy="70" r="1.2" fill="#FFF" className="animate-twinkle-3" />
          <circle cx="70" cy="65" r="1.8" fill="#FDE68A" className="animate-twinkle-1" />
        </svg>
      );

    case 'morning_tea':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-200">
          {/* Steaming Vapor Waves */}
          <path d="M44 38 Q40 28 46 20" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" className="animate-float origin-center" />
          <path d="M52 36 Q56 26 50 18" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" className="animate-float origin-center" style={{ animationDelay: '1s' }} />
          {/* Warm Teacup */}
          <g transform="translate(50, 52)">
            <path d="M-14 -6 C-12 10 12 10 14 -6 Z" fill="#FDE68A" />
            <path d="M13 -4 C19 -4 19 6 13 6" stroke="#FDE68A" strokeWidth="2" fill="none" />
            <ellipse cx="0" cy="11" rx="20" ry="4" fill="#78350F" opacity="0.4" />
          </g>
        </svg>
      );

    case 'laptop':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-cyan-200">
          <g className="animate-float origin-center">
            {/* Glowing Laptop Screen */}
            <rect x="26" y="30" width="48" height="30" rx="3" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
            <rect x="30" y="34" width="40" height="22" rx="1" fill="#0284C7" opacity="0.7" className="animate-aura origin-center" />
            {/* Keyboard Base */}
            <polygon points="20,64 80,64 74,60 26,60" fill="#94A3B8" />
          </g>
          <circle cx="34" cy="42" r="1.5" fill="#FFF" className="animate-twinkle-1" />
          <circle cx="66" cy="42" r="1.5" fill="#38BDF8" className="animate-twinkle-2" />
        </svg>
      );

    case 'piggy_bank':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-300">
          {/* Floating Falling Gold Coins */}
          <g className="animate-drift origin-center">
            <circle cx="50" cy="30" r="7" fill="#FBBF24" stroke="#78350F" strokeWidth="1" className="animate-spin-slow origin-center" />
            <text x="50" y="33" fontSize="8" fontWeight="bold" fill="#78350F" textAnchor="middle">$</text>
          </g>
          {/* Glowing Abundance Core */}
          <circle cx="50" cy="55" r="16" fill="#F59E0B" opacity="0.4" className="animate-aura origin-center" />
          <circle cx="28" cy="45" r="1.5" fill="#FFF" className="animate-twinkle-1" />
          <circle cx="72" cy="45" r="2" fill="#FDE68A" className="animate-twinkle-2" />
        </svg>
      );

    case 'sunset_couple':
    case 'intimate_embrace':
    case 'compliment':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-rose-200">
          {/* Floating Glowing Hearts */}
          <g className="animate-float origin-center">
            <path d="M50 36 C46 30 38 30 38 36 C38 46 50 54 50 54 C50 54 62 46 62 36 C62 30 54 30 50 36 Z" fill="#F43F5E" className="animate-aura origin-center" />
          </g>
          <circle cx="28" cy="40" r="1.5" fill="#FDA4AF" className="animate-twinkle-1" />
          <circle cx="72" cy="35" r="2" fill="#FFF" className="animate-twinkle-2" />
        </svg>
      );

    case 'radiant_eye':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-cyan-200">
          <circle cx="50" cy="50" r="22" fill="#0284C7" opacity="0.3" className="animate-aura origin-center" />
          <g className="animate-float origin-center">
            <path d="M22 50 C34 34 66 34 78 50 C66 66 34 66 22 50 Z" fill="#FFF" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="10" fill="#0284C7" />
            <circle cx="50" cy="50" r="5" fill="#0F172A" />
            <circle cx="47" cy="47" r="2" fill="#FFF" />
          </g>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-200">
          <circle cx="50" cy="50" r="18" fill="#F59E0B" opacity="0.3" className="animate-aura origin-center" />
          <g className="animate-float origin-center">
            {/* Sacred 8-Point Golden Star */}
            <polygon points="50,26 55,42 71,42 58,52 63,68 50,58 37,68 42,52 29,42 45,42" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
          </g>
          <circle cx="25" cy="25" r="1.5" fill="#FFF" className="animate-twinkle-1" />
          <circle cx="75" cy="75" r="1.5" fill="#FFF" className="animate-twinkle-2" />
        </svg>
      );
  }
}
