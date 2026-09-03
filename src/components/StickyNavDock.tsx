import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  LayoutGrid,
  Wand2,
  Palette,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavTab } from '../types';
import { soundEngine } from '../services/audioSynthesizer';

export const StickyNavDock: React.FC = () => {
  const { navTab, setNavTab, t } = useApp();

  const handleTabClick = (tab: NavTab) => {
    soundEngine.playHapticTone();
    setNavTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const TABS = [
    { id: 'home' as NavTab, label: t('homeNav') || 'Home', icon: Home },
    { id: 'category' as NavTab, label: t('categoryNav') || 'Category', icon: LayoutGrid },
    { id: 'magic_max' as NavTab, label: t('magicMaxNav') || 'Magic Max', icon: Wand2, isSpecial: true },
    { id: 'my_art' as NavTab, label: t('myArtNav') || 'My Art', icon: Palette },
    { id: 'profile' as NavTab, label: t('profileNav') || 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-3 pointer-events-none">
      <nav className="pointer-events-auto w-full p-1.5 rounded-3xl bg-white/95 dark:bg-[#1E191A]/95 backdrop-blur-md border border-[#EFE9DF] dark:border-[#362D30] shadow-xl flex items-center justify-between">
        {TABS.map((tab) => {
          const IconComp = tab.icon;
          const isActive = navTab === tab.id;

          if (tab.isSpecial) {
            return (
              <div key={tab.id} className="relative -top-3.5 flex flex-col items-center">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-[#FAF7F2] dark:ring-[#141112] transition-all ${
                    isActive
                      ? 'bg-gradient-to-tr from-[#A84457] via-[#C95B72] to-[#E58397] text-white shadow-[#A84457]/50 ring-[#A84457]/30'
                      : 'bg-gradient-to-tr from-[#8A6223] via-[#B88636] to-[#D8A84E] text-white shadow-[#8A6223]/40'
                  }`}
                  title="Magic Max AI Alchemist"
                >
                  <IconComp className="w-6 h-6 animate-pulse" />
                </motion.button>
                <span
                  className={`text-[9px] font-bold mt-1 tracking-tight ${
                    isActive ? 'text-[#A84457] dark:text-[#D47185]' : 'text-[#8A6223] dark:text-[#D8A84E]'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center transition-colors relative ${
                isActive
                  ? 'text-[#A84457] dark:text-[#D47185]'
                  : 'text-[#7C706D] dark:text-[#A89F9E] hover:text-[#1F1617] dark:hover:text-[#FAF7F5]'
              }`}
            >
              <IconComp className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] font-medium mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeDockDot"
                  className="w-1.5 h-1.5 rounded-full bg-[#A84457] dark:bg-[#D47185] mt-0.5 shadow-2xs"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
