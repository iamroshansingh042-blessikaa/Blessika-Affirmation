import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  CloudRain,
  Headphones,
  Sliders,
  Sparkles,
  Timer,
  TreePine,
  Volume2,
  Waves,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SOUND_TRACKS } from '../data/seedData';
import { SoundType } from '../types';
import { soundEngine } from '../services/audioSynthesizer';

export const AmbientSoundStudio: React.FC = () => {
  const {
    activeAmbient,
    playAmbientSound,
    stopAmbientSound,
    ambientVolume,
    setAmbientVolume,
    sleepTimer,
    setSleepTimer,
  } = useApp();

  const [showTimerMenu, setShowTimerMenu] = useState(false);

  const getSoundIcon = (id: SoundType) => {
    switch (id) {
      case 'rain':
        return <CloudRain className="w-4 h-4" />;
      case 'waves':
        return <Waves className="w-4 h-4" />;
      case 'birds':
        return <TreePine className="w-4 h-4" />;
      case 'solfeggio':
        return <Sparkles className="w-4 h-4" />;
      case 'crystal':
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const handleTrackToggle = (type: SoundType) => {
    soundEngine.playHapticTone();
    playAmbientSound(type);
  };

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-sm space-y-4">
      {/* Studio Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#8A6223]/10 dark:bg-[#B88B46]/20 flex items-center justify-center text-[#8A6223] dark:text-[#B88B46]">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
              Ambient Soundscape Studio
            </h3>
            <span className="text-[11px] text-[#7C706D] dark:text-[#A89F9E]">
              Zero-latency Web Audio Synthesizer
            </span>
          </div>
        </div>

        {/* Sleep Timer Indicator Button */}
        <div className="relative">
          <button
            onClick={() => {
              soundEngine.playHapticTone();
              setShowTimerMenu(!showTimerMenu);
            }}
            className={`px-2.5 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              sleepTimer > 0
                ? 'bg-[#8A6223] text-white'
                : 'bg-[#FAF7F2] dark:bg-[#262022] text-[#7C706D] hover:text-[#1F1617]'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>{sleepTimer > 0 ? `${sleepTimer}m timer` : 'Timer'}</span>
          </button>

          {showTimerMenu && (
            <div className="absolute right-0 top-8 z-30 w-36 py-1 bg-white dark:bg-[#262022] rounded-xl border border-[#EFE9DF] dark:border-[#362D30] shadow-lg text-xs space-y-0.5">
              {[
                { mins: 0, label: 'Off' },
                { mins: 15, label: '15 Minutes' },
                { mins: 30, label: '30 Minutes' },
                { mins: 60, label: '60 Minutes' },
              ].map((opt) => (
                <button
                  key={opt.mins}
                  onClick={() => {
                    setSleepTimer(opt.mins);
                    setShowTimerMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left transition-colors ${
                    sleepTimer === opt.mins
                      ? 'bg-[#A84457] text-white font-semibold'
                      : 'hover:bg-[#FAF7F2] dark:hover:bg-[#1E191A]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Synthesizer Track Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {SOUND_TRACKS.map((track) => {
          const isPlaying = activeAmbient === track.id;
          return (
            <motion.button
              key={track.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleTrackToggle(track.id)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isPlaying
                  ? 'border-[#8A6223] bg-gradient-to-br from-[#FDFCFA] to-[#F5ECE0] dark:from-[#262022] dark:to-[#1E191A] shadow-sm ring-1 ring-[#8A6223]'
                  : 'border-[#EFE9DF] dark:border-[#362D30] bg-[#FAF7F2]/50 dark:bg-[#1E191A]/50 hover:border-[#8A6223]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isPlaying
                      ? 'bg-[#8A6223] text-white'
                      : 'bg-[#EFE9DF] dark:bg-[#362D30] text-[#7C706D]'
                  }`}
                >
                  {getSoundIcon(track.id)}
                </div>
                {isPlaying && (
                  <div className="flex items-end space-x-0.5 h-3">
                    <span className="w-1 bg-[#8A6223] rounded-full animate-bounce h-2" />
                    <span className="w-1 bg-[#8A6223] rounded-full animate-bounce h-3" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1 bg-[#8A6223] rounded-full animate-bounce h-1.5" style={{ animationDelay: '0.4s' }} />
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-[#1F1617] dark:text-[#FAF7F5] truncate">
                  {track.name}
                </div>
                <div className="text-[10px] text-[#7C706D] dark:text-[#A89F9E] truncate">
                  {track.frequency}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Volume & Master Controls */}
      {activeAmbient && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pt-2 border-t border-[#EFE9DF] dark:border-[#362D30] flex items-center space-x-3"
        >
          <Volume2 className="w-4 h-4 text-[#8A6223] shrink-0" />
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={ambientVolume}
            onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
            className="w-full accent-[#8A6223] h-1.5 bg-[#EFE9DF] dark:bg-[#362D30] rounded-lg cursor-pointer"
          />
          <button
            onClick={stopAmbientSound}
            className="px-2.5 py-1 rounded-full text-[11px] bg-[#FAF7F2] dark:bg-[#262022] text-[#A8483B] font-semibold hover:bg-[#EFE9DF]"
          >
            Mute
          </button>
        </motion.div>
      )}
    </div>
  );
};
