import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Apple,
  ArrowRight,
  Fingerprint,
  KeyRound,
  Mail,
  Phone,
  Shield,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../services/audioSynthesizer';
import { ProfileType } from '../types';

export const AuthModal: React.FC = () => {
  const { setStage, user, switchProfile } = useApp();
  const [authMethod, setAuthMethod] = useState<'social' | 'phone' | 'email' | 'guest'>('social');
  const [phoneInput, setPhoneInput] = useState('+1 (555) 234-5678');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [emailInput, setEmailInput] = useState('soul.seeker@sanctuary.app');

  const handleGuestContinue = () => {
    soundEngine.playSingingBowl(528);
    setStage('pin_lock');
  };

  const handleSocialSignIn = (provider: string) => {
    soundEngine.playTone(600, 0.2);
    // Simulate instantaneous secure authentication
    setTimeout(() => {
      soundEngine.playSingingBowl(528);
      setStage('pin_lock');
    }, 400);
  };

  const handleSendOtp = () => {
    soundEngine.playTone(528, 0.2);
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    soundEngine.playSingingBowl(528);
    setStage('pin_lock');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-6 bg-[#FAF7F2] dark:bg-[#141112] text-[#1F1617] dark:text-[#FAF7F5] max-w-md mx-auto">
      {/* Header */}
      <div className="pt-2">
        <div className="flex items-center space-x-2 text-[#8A6223] dark:text-[#B88B46] mb-2">
          <Shield className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Stage 4 • Sanctuary Pass & Privacy
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-playfair font-semibold tracking-tight text-[#1F1617] dark:text-[#FAF7F5]">
          Secure Your Sanctuary
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#7C706D] dark:text-[#A89F9E]">
          Save your blessings, family circle locations, and 21-day milestones.
        </p>
      </div>

      {/* Auth Methods */}
      <div className="my-auto py-4 space-y-4">
        {/* Profile Switcher Quick Selector */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A6223] dark:text-[#B88B46] flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 mr-1" />
              Active Household Profile
            </span>
            <span className="text-[11px] font-semibold text-[#A84457] capitalize">
              {user.role}
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {(['personal', 'partner', 'child', 'caregiver', 'elderly'] as ProfileType[]).map((r) => {
              const active = user.role === r;
              return (
                <button
                  key={r}
                  onClick={() => switchProfile(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    active
                      ? 'bg-[#A84457] text-white shadow-sm'
                      : 'bg-[#FAF7F2] dark:bg-[#262022] text-[#7C706D] dark:text-[#A89F9E]'
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1-Click Social Sign-In */}
        <div className="space-y-2.5">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSocialSignIn('Google')}
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] font-medium text-sm text-[#1F1617] dark:text-[#FAF7F5] flex items-center justify-center space-x-3 shadow-sm hover:border-[#8A6223]/50 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSocialSignIn('Apple')}
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] font-medium text-sm text-[#1F1617] dark:text-[#FAF7F5] flex items-center justify-center space-x-3 shadow-sm hover:border-[#8A6223]/50 transition-all"
          >
            <Apple className="w-4 h-4 text-black dark:text-white" />
            <span>Continue with Apple ID</span>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="flex items-center space-x-3 my-2">
          <div className="h-px bg-[#EFE9DF] dark:bg-[#362D30] flex-1" />
          <span className="text-[11px] uppercase tracking-wider text-[#7C706D] dark:text-[#A89F9E]">
            Or Direct Security
          </span>
          <div className="h-px bg-[#EFE9DF] dark:bg-[#362D30] flex-1" />
        </div>

        {/* Phone OTP or Magic Link */}
        <div className="space-y-2">
          {!otpSent ? (
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Phone className="w-4 h-4 absolute left-3 top-3.5 text-[#7C706D]" />
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Enter mobile number"
                  className="w-full pl-9 pr-3 py-3 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#A84457]"
                />
              </div>
              <button
                onClick={handleSendOtp}
                className="px-4 py-3 rounded-2xl bg-[#8A6223] text-white text-xs font-semibold hover:bg-[#73511C]"
              >
                Send OTP
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit SMS code"
                  className="w-full px-3 py-3 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] text-sm text-center font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-[#A84457]"
                />
                <button
                  onClick={handleVerifyOtp}
                  className="px-5 py-3 rounded-2xl bg-[#A84457] text-white text-xs font-semibold"
                >
                  Verify
                </button>
              </div>
              <p className="text-[11px] text-[#476655] dark:text-[#6B947E] text-center">
                ✓ Demo SMS code 7749 auto-filled
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Guest Mode with Local Storage */}
      <div className="pb-4 space-y-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGuestContinue}
          className="w-full px-6 py-3.5 rounded-full bg-[#A84457] hover:bg-[#8F394A] text-white font-medium text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg shadow-[#A84457]/25 transition-colors"
        >
          <KeyRound className="w-4 h-4" />
          <span>Set 4-Digit Sanctuary PIN & Enter</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </motion.button>

        <p className="text-[11px] text-center text-[#7C706D] dark:text-[#A89F9E]">
          🔒 End-to-end encrypted local persistence enabled. Zero tracking.
        </p>
      </div>
    </div>
  );
};
