import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Bell,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  QrCode,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../services/audioSynthesizer';
import { CHALLENGE_TRACKS } from '../data/seedData';

export const OnboardingAssessment: React.FC = () => {
  const { setStage, completeOnboarding, user } = useApp();
  const [step, setStep] = useState(1);

  // Step 1: Intentions
  const [selectedIntentions, setSelectedIntentions] = useState<string[]>([
    'Mindfulness & Peace',
    'Family Safety & Circle',
  ]);

  const INTENTION_OPTIONS = [
    { id: 'mindfulness', label: 'Mindfulness & Peace', icon: '🕊️' },
    { id: 'habits', label: 'Habit Discipline & Quests', icon: '⚡' },
    { id: 'safety', label: 'Family Safety & Circle', icon: '🛡️' },
    { id: 'meds', label: 'Medication & Health Tracking', icon: '💊' },
    { id: 'finance', label: 'Sanctuary Budgeting', icon: '🌱' },
    { id: 'family', label: 'Pet & Child Care', icon: '🐾' },
  ];

  // Step 2: Affirmation preferences
  const [affirmationTimes, setAffirmationTimes] = useState<string[]>([
    '08:00 AM (Sunrise Awakening)',
    '09:30 PM (Twilight Reflection)',
  ]);
  const [selectedFrequency, setSelectedFrequency] = useState<number>(528);

  // Step 3: Challenge track
  const [selectedTrack, setSelectedTrack] = useState<string>('morning-meditation');

  // Step 4: Circle code
  const [circleCode, setCircleCode] = useState<string>('BLESS-9821');
  const [copied, setCopied] = useState(false);

  const toggleIntention = (label: string) => {
    soundEngine.playHapticTone();
    if (selectedIntentions.includes(label)) {
      setSelectedIntentions(selectedIntentions.filter((i) => i !== label));
    } else {
      setSelectedIntentions([...selectedIntentions, label]);
    }
  };

  const testFrequencyTone = (freq: number) => {
    setSelectedFrequency(freq);
    soundEngine.playSingingBowl(freq);
  };

  const copyCode = () => {
    soundEngine.playTone(600, 0.2);
    navigator.clipboard?.writeText(circleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNext = () => {
    soundEngine.playHapticTone();
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Complete Onboarding and proceed to Auth / PIN setup
      completeOnboarding({
        intentions: selectedIntentions,
        preferredFrequency: selectedFrequency,
        selectedTrackId: selectedTrack,
        circleCode,
      });
      setStage('auth');
    }
  };

  const handleBack = () => {
    soundEngine.playHapticTone();
    if (step > 1) {
      setStep(step - 1);
    } else {
      setStage('features');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-6 bg-[#FAF7F2] dark:bg-[#141112] text-[#1F1617] dark:text-[#FAF7F5] max-w-md mx-auto">
      {/* Top Header & Step Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleBack}
            className="p-1.5 rounded-full hover:bg-[#EFE9DF] dark:hover:bg-[#362D30] text-[#7C706D] dark:text-[#A89F9E]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8A6223] dark:text-[#B88B46]">
            Step {step} of 5
          </span>
          <div className="w-5" />
        </div>

        {/* 5-Segment Progress Line */}
        <div className="flex items-center space-x-1.5 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-[#A84457] dark:bg-[#D47185]' : 'bg-[#EFE9DF] dark:bg-[#362D30]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Dynamic Step Content */}
      <div className="my-auto py-2">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-2xl font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
                  What are your sacred life intentions?
                </h2>
                <p className="mt-1 text-xs text-[#7C706D] dark:text-[#A89F9E]">
                  Select the focal areas you wish to elevate in Blessikaa.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {INTENTION_OPTIONS.map((item) => {
                  const isSelected = selectedIntentions.includes(item.label);
                  return (
                    <motion.div
                      key={item.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleIntention(item.label)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#A84457] bg-white dark:bg-[#1E191A] shadow-sm ring-1 ring-[#A84457]'
                          : 'border-[#EFE9DF] dark:border-[#362D30] bg-[#FFFFFF]/60 dark:bg-[#1E191A]/60'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm font-medium text-[#1F1617] dark:text-[#FAF7F5]">
                          {item.label}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? 'bg-[#A84457] border-[#A84457] text-white'
                            : 'border-[#EFE9DF] dark:border-[#362D30]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-2xl font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
                  Affirmation Alarms & Tuning
                </h2>
                <p className="mt-1 text-xs text-[#7C706D] dark:text-[#A89F9E]">
                  Choose your Solfeggio frequency and mindful reflection times.
                </p>
              </div>

              {/* Solfeggio frequency selection */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A6223] dark:text-[#B88B46]">
                  Sacred Solfeggio Resonance
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { freq: 432, label: '432 Hz', desc: 'Cosmic Calm' },
                    { freq: 528, label: '528 Hz', desc: 'Love & Miracles' },
                    { freq: 963, label: '963 Hz', desc: 'Pure Light' },
                  ].map((item) => (
                    <div
                      key={item.freq}
                      onClick={() => testFrequencyTone(item.freq)}
                      className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                        selectedFrequency === item.freq
                          ? 'border-[#A84457] bg-white dark:bg-[#1E191A] ring-1 ring-[#A84457]'
                          : 'border-[#EFE9DF] dark:border-[#362D30] bg-white/60 dark:bg-[#1E191A]/60'
                      }`}
                    >
                      <div className="text-sm font-bold text-[#1F1617] dark:text-[#FAF7F5]">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-[#7C706D] dark:text-[#A89F9E]">
                        {item.desc}
                      </div>
                      <div className="mt-1 flex items-center justify-center text-[#A84457] text-[10px]">
                        <Volume2 className="w-3 h-3 mr-0.5" />
                        <span>Tap to hear</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Affirmation Times */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A6223] dark:text-[#B88B46]">
                  Daily Whispering Times
                </span>
                <div className="space-y-2">
                  {[
                    '08:00 AM (Sunrise Awakening)',
                    '01:00 PM (Midday Realignment)',
                    '09:30 PM (Twilight Reflection)',
                  ].map((timeStr) => {
                    const active = affirmationTimes.includes(timeStr);
                    return (
                      <div
                        key={timeStr}
                        onClick={() => {
                          soundEngine.playHapticTone();
                          if (active) {
                            setAffirmationTimes(affirmationTimes.filter((t) => t !== timeStr));
                          } else {
                            setAffirmationTimes([...affirmationTimes, timeStr]);
                          }
                        }}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${
                          active
                            ? 'border-[#8A6223] bg-white dark:bg-[#1E191A]'
                            : 'border-[#EFE9DF] dark:border-[#362D30] bg-white/40'
                        }`}
                      >
                        <div className="flex items-center space-x-2 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#8A6223]" />
                          <span>{timeStr}</span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                            active ? 'bg-[#8A6223] text-white' : 'border-[#EFE9DF]'
                          }`}
                        >
                          {active && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-2xl font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
                  Select Your 21-Day Quest
                </h2>
                <p className="mt-1 text-xs text-[#7C706D] dark:text-[#A89F9E]">
                  21 days of micro-tasks that build subconscious excellence.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {CHALLENGE_TRACKS.map((track) => {
                  const isSelected = selectedTrack === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => {
                        soundEngine.playHapticTone();
                        setSelectedTrack(track.id);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#A84457] bg-white dark:bg-[#1E191A] shadow-md ring-1 ring-[#A84457]'
                          : 'border-[#EFE9DF] dark:border-[#362D30] bg-white/60 dark:bg-[#1E191A]/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EFE9DF] dark:bg-[#362D30] text-[#8A6223]">
                            {track.category}
                          </span>
                          <h3 className="text-base font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
                            {track.title}
                          </h3>
                          <p className="text-xs text-[#7C706D] dark:text-[#A89F9E]">
                            {track.subtitle}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            isSelected ? 'bg-[#A84457] text-white border-[#A84457]' : 'border-[#EFE9DF]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-2xl font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
                  Smart Family Circle Setup
                </h2>
                <p className="mt-1 text-xs text-[#7C706D] dark:text-[#A89F9E]">
                  Connect your household for Life360 safety, battery pings & SOS alerts.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-sm text-center space-y-4">
                {/* QR Code Graphic simulation */}
                <div className="w-32 h-32 mx-auto rounded-2xl bg-[#FAF7F2] dark:bg-[#141112] border-2 border-dashed border-[#8A6223]/40 flex flex-col items-center justify-center p-3">
                  <QrCode className="w-20 h-20 text-[#8A6223] dark:text-[#B88B46]" />
                  <span className="text-[9px] uppercase font-bold text-[#7C706D] mt-1">
                    Scan Sanctuary QR
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#7C706D] dark:text-[#A89F9E]">
                    Your Unique Family Circle Invite Code
                  </span>
                  <div className="mt-1 flex items-center justify-center space-x-2">
                    <span className="text-xl font-mono font-bold tracking-widest text-[#A84457] dark:text-[#D47185]">
                      {circleCode}
                    </span>
                    <button
                      onClick={copyCode}
                      className="p-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#362D30] text-[#7C706D] hover:text-[#A84457]"
                      title="Copy code"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-[#476655]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-[#7C706D] dark:text-[#A89F9E]">
                  Share this code with your partner, children, or elderly parents to sync location
                  awareness securely.
                </p>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 text-center"
            >
              {/* Personalized Sanctuary Passport Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-white to-[#F6F0E6] dark:from-[#1E191A] dark:via-[#262022] dark:to-[#141112] border-2 border-[#8A6223]/30 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 rounded-full bg-[#8A6223]/10 blur-xl" />

                <div className="flex items-center justify-between mb-4 border-b border-[#EFE9DF] dark:border-[#362D30] pb-3">
                  <div className="text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A6223]">
                      Sanctuary Passport
                    </span>
                    <h3 className="text-base font-playfair font-bold text-[#1F1617] dark:text-[#FAF7F5]">
                      {user.name}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#A84457] text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-b border-[#EFE9DF] dark:border-[#362D30] text-left">
                  <div>
                    <span className="text-[10px] text-[#7C706D] block">Tone</span>
                    <span className="text-xs font-bold text-[#8A6223]">
                      {selectedFrequency} Hz
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7C706D] block">Quest</span>
                    <span className="text-xs font-bold text-[#476655]">21-Day Med</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7C706D] block">Initial Karma</span>
                    <span className="text-xs font-bold text-[#A84457]">+420 XP</span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-center space-x-2 text-xs font-semibold text-[#476655] dark:text-[#6B947E]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sanctuary Seal & Biometrics Ready</span>
                </div>
              </div>

              <p className="text-xs text-[#7C706D] dark:text-[#A89F9E]">
                Your personalized sanctuary space is ready to welcome your peaceful awakening.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Button */}
      <div className="pb-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full px-6 py-3.5 rounded-full bg-[#A84457] hover:bg-[#8F394A] text-white font-medium text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg shadow-[#A84457]/25 transition-colors"
        >
          <span>{step === 5 ? 'Enter Sanctuary' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
