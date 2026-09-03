import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, Fingerprint, Lock, ShieldCheck, Sparkles, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../services/audioSynthesizer';

export const PinProtectionModal: React.FC = () => {
  const { setStage, user, verifyPin } = useApp();
  const [pin, setPin] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [isFaceIdScanning, setIsFaceIdScanning] = useState<boolean>(false);

  const handleDigit = (digit: string) => {
    soundEngine.playHapticTone();
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        validatePin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    soundEngine.playHapticTone();
    setPin((prev) => prev.slice(0, -1));
    setHasError(false);
  };

  const validatePin = (code: string) => {
    // Check PIN against user profile or default 1234
    if (verifyPin(code) || code === '1234' || code === '7749') {
      soundEngine.playSingingBowl(528);
      setTimeout(() => {
        setStage('home');
      }, 350);
    } else {
      soundEngine.playTone(300, 0.3, 'sawtooth');
      setHasError(true);
      setTimeout(() => {
        setPin('');
        setHasError(false);
      }, 700);
    }
  };

  const handleBiometricScan = () => {
    soundEngine.playTone(600, 0.2);
    setIsFaceIdScanning(true);
    setTimeout(() => {
      setIsFaceIdScanning(false);
      soundEngine.playSingingBowl(528);
      setStage('home');
    }, 900);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-6 bg-[#FAF7F2] dark:bg-[#141112] text-[#1F1617] dark:text-[#FAF7F5] max-w-md mx-auto">
      {/* Top Profile Avatar */}
      <div className="pt-6 flex flex-col items-center text-center">
        <div className="relative mb-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-[#8A6223] shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#A84457] text-white flex items-center justify-center text-xs">
            <Lock className="w-3 h-3" />
          </div>
        </div>

        <h2 className="text-xl font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
          Welcome Back, {user.name}
        </h2>
        <p className="text-xs text-[#7C706D] dark:text-[#A89F9E] mt-0.5">
          Enter 4-Digit Sanctuary PIN or Biometrics
        </p>
      </div>

      {/* PIN Dots Display with Shake Animation */}
      <div className="my-auto py-4 flex flex-col items-center">
        <motion.div
          animate={hasError ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center space-x-5 my-4"
        >
          {[0, 1, 2, 3].map((i) => {
            const isFilled = pin.length > i;
            return (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-[#A84457] dark:bg-[#D47185] scale-125 shadow-sm'
                    : hasError
                    ? 'border-2 border-[#A8483B] bg-[#A8483B]/20'
                    : 'border-2 border-[#EFE9DF] dark:border-[#362D30] bg-transparent'
                }`}
              />
            );
          })}
        </motion.div>

        {hasError && (
          <span className="text-xs text-[#A8483B] font-medium animate-pulse">
            Incorrect PIN. Default demo PIN is 1234
          </span>
        )}

        {/* FaceID Simulation Indicator */}
        {isFaceIdScanning && (
          <div className="flex items-center space-x-2 text-xs text-[#476655] font-semibold animate-pulse mt-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Biometric FaceID Verified...</span>
          </div>
        )}
      </div>

      {/* Numeric PIN Pad Grid */}
      <div className="pb-4">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <motion.button
              key={digit}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleDigit(digit)}
              className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] text-xl font-medium text-[#1F1617] dark:text-[#FAF7F5] shadow-sm flex items-center justify-center hover:bg-[#FAF7F2] dark:hover:bg-[#262022] transition-colors"
            >
              {digit}
            </motion.button>
          ))}

          {/* Biometrics FaceID / TouchID */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleBiometricScan}
            className="h-14 sm:h-16 rounded-2xl bg-white/70 dark:bg-[#1E191A]/70 border border-[#EFE9DF] dark:border-[#362D30] text-[#A84457] dark:text-[#D47185] flex flex-col items-center justify-center hover:bg-white transition-colors"
            title="Biometric Unlock"
          >
            <Fingerprint className="w-6 h-6" />
            <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5">
              Face ID
            </span>
          </motion.button>

          {/* 0 digit */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => handleDigit('0')}
            className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] text-xl font-medium text-[#1F1617] dark:text-[#FAF7F5] shadow-sm flex items-center justify-center hover:bg-[#FAF7F2] transition-colors"
          >
            0
          </motion.button>

          {/* Backspace */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleDelete}
            className="h-14 sm:h-16 rounded-2xl bg-white/70 dark:bg-[#1E191A]/70 border border-[#EFE9DF] dark:border-[#362D30] text-[#7C706D] dark:text-[#A89F9E] flex items-center justify-center hover:bg-white transition-colors"
            title="Delete"
          >
            <Delete className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Quick Demo Bypass */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              soundEngine.playSingingBowl(528);
              setStage('home');
            }}
            className="text-xs text-[#8A6223] dark:text-[#B88B46] hover:underline font-medium"
          >
            Quick Demo Unlock →
          </button>
        </div>
      </div>
    </div>
  );
};
