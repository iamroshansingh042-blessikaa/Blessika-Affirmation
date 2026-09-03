import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  Flame,
  MapPin,
  PhoneCall,
  Radio,
  ShieldAlert,
  Volume2,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../services/audioSynthesizer';

export const EmergencySosModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user, circleMembers } = useApp();
  const [countdown, setCountdown] = useState(5);
  const [isBeaconActive, setIsBeaconActive] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isOpen && countdown > 0 && !isBeaconActive) {
      soundEngine.playTone(880, 0.1, 'sawtooth');
      interval = window.setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            setIsBeaconActive(true);
            soundEngine.playTone(950, 0.4, 'sawtooth');
            return 0;
          }
          soundEngine.playTone(880, 0.1, 'sawtooth');
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, countdown, isBeaconActive]);

  const handleCancel = () => {
    soundEngine.playHapticTone();
    setCountdown(5);
    setIsBeaconActive(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-[#1A1214] text-[#FAF7F5] border-2 border-[#A8483B] p-6 text-center space-y-5 shadow-2xl relative overflow-hidden">
        {/* Pulsing Red Strobe Background */}
        <div className="absolute -inset-10 bg-[#A8483B]/20 rounded-full blur-2xl animate-ping pointer-events-none" />

        <div className="relative flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#A8483B]/20 border-2 border-[#A8483B] flex items-center justify-center animate-sacred-pulse">
            <ShieldAlert className="w-10 h-10 text-[#C96859]" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-playfair font-bold text-white">
            {isBeaconActive ? 'EMERGENCY BEACON ACTIVE' : 'SOS BEACON COUNTDOWN'}
          </h3>
          <p className="mt-1 text-xs text-[#A89F9E]">
            {isBeaconActive
              ? 'Broadcasting high-priority GPS & safety ping to all circle members'
              : 'Broadcasting in... tap Cancel if this was an accidental press'}
          </p>
        </div>

        {!isBeaconActive ? (
          <div className="text-5xl font-mono font-bold text-[#C96859] animate-bounce">
            {countdown}
          </div>
        ) : (
          <div className="space-y-3 p-3.5 rounded-2xl bg-[#261E20] border border-[#3D2E32] text-left text-xs">
            <div className="flex items-center space-x-2 text-[#C96859] font-bold">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Broadcast Active • GPS: 37.7749° N, 122.4194° W</span>
            </div>
            <div className="text-[#A89F9E]">
              Alert sent to: {circleMembers.map((m) => m.name.split(' ')[0]).join(', ')}
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <a
            href="tel:911"
            className="w-full py-3.5 rounded-full bg-[#A8483B] hover:bg-[#8F3B30] text-white text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-[#A8483B]/30"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 911 / Emergency Dispatch</span>
          </a>

          <button
            onClick={handleCancel}
            className="w-full py-3 rounded-full bg-[#362D30] hover:bg-[#453A3D] text-xs font-semibold text-[#FAF7F5]"
          >
            {isBeaconActive ? 'Deactivate Beacon & Stand Down' : 'Cancel SOS Alert'}
          </button>
        </div>
      </div>
    </div>
  );
};
