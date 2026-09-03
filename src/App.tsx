import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashEntrance } from './components/SplashEntrance';
import { LanguagePicker } from './components/LanguagePicker';
import { FeatureCarousel } from './components/FeatureCarousel';
import { OnboardingAssessment } from './components/OnboardingAssessment';
import { AuthModal } from './components/AuthModal';
import { PinProtectionModal } from './components/PinProtectionModal';
import { SanctuaryHomeScreen } from './components/SanctuaryHomeScreen';

const AppContent: React.FC = () => {
  const { stage } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#141112] text-[#1F1617] dark:text-[#FAF7F5] flex flex-col items-center justify-start antialiased">
      <div className="w-full max-w-md min-h-screen shadow-2xl relative bg-[#FAF7F2] dark:bg-[#141112]">
        <AnimatePresence mode="wait">
          {stage === 'splash' && (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full min-h-screen"
            >
              <SplashEntrance />
            </motion.div>
          )}

          {stage === 'language' && (
            <motion.div
              key="language"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full min-h-screen"
            >
              <LanguagePicker />
            </motion.div>
          )}

          {stage === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="w-full min-h-screen"
            >
              <FeatureCarousel />
            </motion.div>
          )}

          {stage === 'onboarding' && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full min-h-screen"
            >
              <OnboardingAssessment />
            </motion.div>
          )}

          {stage === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full min-h-screen"
            >
              <AuthModal />
            </motion.div>
          )}

          {stage === 'pin_lock' && (
            <motion.div
              key="pin_lock"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.35 }}
              className="w-full min-h-screen"
            >
              <PinProtectionModal />
            </motion.div>
          )}

          {stage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full min-h-screen"
            >
              <SanctuaryHomeScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
