import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Shield,
  Key,
  Globe2,
  Moon,
  Sun,
  Flame,
  Sparkles,
  Award,
  ChevronRight,
  BookOpen,
  Volume2,
  VolumeX,
  Check,
  Edit2,
  LogOut,
  Heart,
  Grid,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProfileType } from '../types';
import { soundEngine } from '../services/audioSynthesizer';
import { ServiceDirectoryModal } from './ServiceDirectoryModal';
import { LanguageModal } from './LanguageModal';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    setUser,
    switchProfile,
    isDarkMode,
    setIsDarkMode,
    isMuted,
    toggleMute,
    currentLang,
    affirmations,
    t,
  } = useApp();

  const [isEditingPin, setIsEditingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const PROFILES: { role: ProfileType; label: string; desc: string }[] = [
    { role: 'personal', label: 'Personal (Elena)', desc: 'Primary sanctuary account & habits' },
    { role: 'partner', label: 'Partner (Julian)', desc: 'Shared relationship & abundance goals' },
    { role: 'child', label: 'Child (Liam)', desc: 'Gentle morning routine & school safety' },
    { role: 'caregiver', label: 'Caregiver (Nurse Sarah)', desc: 'Medical alerts & vital check-ins' },
    { role: 'elderly', label: 'Elderly (Grandma Maya)', desc: 'Large text, peace mantras & SOS beacon' },
  ];

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) return;
    setUser((u) => ({ ...u, pinCode: newPin }));
    setPinSuccess(true);
    soundEngine.playSingingBowl(528);
    setTimeout(() => {
      setPinSuccess(false);
      setIsEditingPin(false);
      setNewPin('');
    }, 1200);
  };

  const favoriteCount = affirmations.filter((a) => a.isFavorite).length;

  return (
    <div className="w-full pb-24 animate-fadeIn">
      {/* Profile Header Banner */}
      <div className="px-4 pt-2 pb-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-xs relative overflow-hidden">
          <div className="flex items-center space-x-3.5 mb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#8A6223] shadow-md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-playfair font-bold text-[#1F1617] dark:text-[#FAF7F5] truncate">
                  {user.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#A84457]/10 text-[#A84457] text-[10px] font-bold uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-[#7C706D] dark:text-[#A89F9E] truncate">{user.email}</p>
              <div className="mt-1 flex items-center space-x-2 text-[11px] text-[#8A6223] font-semibold">
                <span>Circle Code:</span>
                <span className="bg-[#FAF7F2] dark:bg-[#251F21] px-2 py-0.5 rounded-md border border-[#EFE9DF] dark:border-[#3E3437]">
                  {user.circleCode}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#EFE9DF] dark:border-[#362D30] text-center">
            <div className="p-2 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F21]">
              <div className="text-[10px] text-[#7C706D] font-bold uppercase">Streak</div>
              <div className="text-sm font-bold text-[#A84457] flex items-center justify-center space-x-0.5 mt-0.5">
                <Flame className="w-3.5 h-3.5 fill-[#A84457]" />
                <span>{user.streakCount} Days</span>
              </div>
            </div>

            <div className="p-2 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F21]">
              <div className="text-[10px] text-[#7C706D] font-bold uppercase">Blessing XP</div>
              <div className="text-sm font-bold text-[#8A6223] flex items-center justify-center space-x-0.5 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{user.karmaPoints}</span>
              </div>
            </div>

            <div className="p-2 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F21]">
              <div className="text-[10px] text-[#7C706D] font-bold uppercase">Favorites</div>
              <div className="text-sm font-bold text-[#6D5999] flex items-center justify-center space-x-0.5 mt-0.5">
                <Heart className="w-3.5 h-3.5 fill-[#6D5999]" />
                <span>{favoriteCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Switch Sanctuary Persona / Role */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A6223] mb-2.5">
            Switch Sanctuary Persona
          </h3>

          <div className="space-y-1.5">
            {PROFILES.map((p) => (
              <button
                key={p.role}
                onClick={() => {
                  soundEngine.playTone(600, 0.15);
                  switchProfile(p.role);
                }}
                className={`w-full p-2.5 rounded-2xl text-left flex items-center justify-between transition-all ${
                  user.role === p.role
                    ? 'bg-[#A84457] text-white shadow-2xs'
                    : 'bg-[#FAF7F2] dark:bg-[#251F21] text-[#1F1617] dark:text-[#FAF7F5] border border-[#EFE9DF] dark:border-[#3E3437] hover:border-[#8A6223]/50'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">{p.label}</div>
                  <div
                    className={`text-[10px] ${
                      user.role === p.role ? 'text-white/80' : 'text-[#7C706D] dark:text-[#A89F9E]'
                    }`}
                  >
                    {p.desc}
                  </div>
                </div>
                {user.role === p.role && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Universal Life Services Directory Quick Link */}
        <div
          onClick={() => {
            soundEngine.playTone(528, 0.2);
            setIsDirectoryOpen(true);
          }}
          className="p-4 rounded-3xl bg-gradient-to-r from-white to-[#FAF7F2] dark:from-[#1E191A] dark:to-[#251F21] border border-[#EFE9DF] dark:border-[#362D30] shadow-xs cursor-pointer flex items-center justify-between hover:border-[#8A6223]/50 transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-[#8A6223]/10 text-[#8A6223] flex items-center justify-center font-bold">
              <Grid className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1F1617] dark:text-[#FAF7F5]">
                Universal Life Directory
              </div>
              <div className="text-[10px] text-[#7C706D]">
                Access Medicine, CBT, Plants, Vehicles, Pets & Vault
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#7C706D]" />
        </div>

        {/* Security & Preferences */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-xs space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A6223] mb-1">
            Sanctuary Settings & Security
          </h3>

          {/* PIN Lock Management */}
          <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F21] border border-[#EFE9DF] dark:border-[#3E3437]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Key className="w-4 h-4 text-[#A84457]" />
                <div>
                  <div className="text-xs font-semibold text-[#1F1617] dark:text-[#FAF7F5]">4-Digit Passcode</div>
                  <div className="text-[10px] text-[#7C706D]">Current PIN: ****</div>
                </div>
              </div>
              <button
                onClick={() => setIsEditingPin(!isEditingPin)}
                className="text-xs font-semibold text-[#A84457] dark:text-[#D47185] hover:underline"
              >
                {isEditingPin ? 'Cancel' : 'Change PIN'}
              </button>
            </div>

            {isEditingPin && (
              <form onSubmit={handleSavePin} className="mt-3 pt-3 border-t border-[#EFE9DF] dark:border-[#3E3437] flex items-center space-x-2">
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter new 4-digit PIN"
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#3E3437] text-xs text-center tracking-widest font-mono"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-[#A84457] text-white text-xs font-semibold"
                >
                  {pinSuccess ? 'Saved!' : 'Save'}
                </button>
              </form>
            )}
          </div>

          {/* Language Selector */}
          <div
            onClick={() => {
              soundEngine.playHapticTone();
              setIsLanguageModalOpen(true);
            }}
            className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F21] border border-[#EFE9DF] dark:border-[#3E3437] flex items-center justify-between cursor-pointer hover:border-[#8A6223]/40 transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <Globe2 className="w-4 h-4 text-[#8A6223]" />
              <div>
                <div className="text-xs font-semibold text-[#1F1617] dark:text-[#FAF7F5]">App Language</div>
                <div className="text-[10px] text-[#7C706D]">
                  {currentLang.flag} {currentLang.name} ({currentLang.nativeName})
                </div>
              </div>
            </div>
            <span className="text-xs text-[#A84457] dark:text-[#D47185] font-semibold">Change →</span>
          </div>

          {/* Sound & Audio Mute Settings */}
          <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F21] border border-[#EFE9DF] dark:border-[#3E3437] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-[#8A6223]" />}
              <div>
                <div className="text-xs font-semibold text-[#1F1617] dark:text-[#FAF7F5]">Audio & Sound Effects</div>
                <div className="text-[10px] text-[#7C706D]">{isMuted ? 'Muted (Silent sanctuary)' : 'Unmuted (528Hz & voice active)'}</div>
              </div>
            </div>
            <button
              onClick={() => {
                toggleMute();
              }}
              className={`px-3 py-1 rounded-full border text-xs font-semibold transition-colors ${
                isMuted
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-600 border-red-200 dark:border-red-900/50'
                  : 'bg-white dark:bg-[#1E191A] border-[#EFE9DF] dark:border-[#3E3437] text-[#8A6223]'
              }`}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
          </div>

          {/* Dark / Light Mode */}
          <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F21] border border-[#EFE9DF] dark:border-[#3E3437] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              {isDarkMode ? <Moon className="w-4 h-4 text-[#6D5999]" /> : <Sun className="w-4 h-4 text-[#8A6223]" />}
              <div>
                <div className="text-xs font-semibold text-[#1F1617] dark:text-[#FAF7F5]">Display Theme</div>
                <div className="text-[10px] text-[#7C706D]">{isDarkMode ? 'Twilight Sanctuary (Dark)' : 'Radiant Daylight (Light)'}</div>
              </div>
            </div>
            <button
              onClick={() => {
                soundEngine.playHapticTone();
                setIsDarkMode(!isDarkMode);
              }}
              className="px-3 py-1 rounded-full bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#3E3437] text-xs font-semibold"
            >
              Toggle
            </button>
          </div>
        </div>

        {/* About Blessikaa */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-xs text-center">
          <div className="text-xs font-playfair font-bold text-[#8A6223]">Blessikaa - Building a Blessed Life!</div>
          <div className="text-[10px] text-[#7C706D] mt-0.5">Version 2.4.0 • 528Hz Solfeggio Resonant</div>
        </div>
      </div>

      {/* Service Directory Modal */}
      <ServiceDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
      />

      {/* In-App Language Selection Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />
    </div>
  );
};
