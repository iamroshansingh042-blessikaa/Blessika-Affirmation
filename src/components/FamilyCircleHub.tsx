import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Battery,
  BatteryCharging,
  Heart,
  MapPin,
  Plus,
  Radio,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../services/audioSynthesizer';

export const FamilyCircleHub: React.FC = () => {
  const { circleMembers, sendLoveToMember, user } = useApp();
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; memberId: string }[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleSendLove = (memberId: string) => {
    sendLoveToMember(memberId);
    const newId = Date.now();
    setFloatingHearts((prev) => [...prev, { id: newId, memberId }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newId));
    }, 1200);
  };

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#476655]/10 flex items-center justify-center text-[#476655] dark:text-[#6B947E]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
              Life360 Family Circle Hub
            </h3>
            <span className="text-[11px] text-[#7C706D] dark:text-[#A89F9E]">
              {circleMembers.length} active household souls protected
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playHapticTone();
            setShowInviteModal(true);
          }}
          className="p-1.5 rounded-full bg-[#FAF7F2] dark:bg-[#262022] text-[#476655] hover:bg-[#EFE9DF] transition-colors"
          title="Add Circle Member"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Circle Members List */}
      <div className="space-y-3">
        {circleMembers.map((member) => (
          <div
            key={member.id}
            className="relative p-3 rounded-xl bg-[#FAF7F2]/60 dark:bg-[#262022]/60 border border-[#EFE9DF] dark:border-[#362D30] flex items-center justify-between overflow-hidden"
          >
            {/* Member Profile Info */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-[#1E191A] shadow-xs"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#1E191A] flex items-center justify-center ${
                    member.locationStatus === 'At Home'
                      ? 'bg-[#476655]'
                      : member.locationStatus === 'In Transit'
                      ? 'bg-[#8A6223]'
                      : 'bg-[#A84457]'
                  }`}
                  title={member.locationStatus}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
                    {member.name}
                  </h4>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-[#7C706D] dark:text-[#A89F9E]">
                  <span className="font-medium text-[#476655] dark:text-[#6B947E]">
                    {member.locationStatus}
                  </span>
                  <span>•</span>
                  <span>{member.lastUpdated}</span>
                </div>

                <div className="text-[10px] text-[#7C706D] dark:text-[#A89F9E] truncate max-w-[170px]">
                  {member.address}
                </div>
              </div>
            </div>

            {/* Battery & Send Love Controls */}
            <div className="flex flex-col items-end space-y-1.5">
              {/* Battery Indicator */}
              <div className="flex items-center space-x-1 text-[11px] font-mono font-medium text-[#7C706D]">
                {member.isCharging ? (
                  <BatteryCharging className="w-3.5 h-3.5 text-[#476655]" />
                ) : (
                  <Battery className="w-3.5 h-3.5" />
                )}
                <span>{member.battery}%</span>
              </div>

              {/* Send Love Button */}
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => handleSendLove(member.id)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] text-[11px] font-semibold text-[#A84457] hover:bg-[#A84457] hover:text-white shadow-xs transition-all flex items-center space-x-1"
              >
                <Heart className="w-3 h-3 fill-current" />
                <span>{member.loveCount}</span>
              </motion.button>
            </div>

            {/* Floating Heart animation */}
            <AnimatePresence>
              {floatingHearts
                .filter((h) => h.memberId === member.id)
                .map((h) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 1, y: 0, scale: 0.8 }}
                    animate={{ opacity: 0, y: -40, scale: 1.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute right-8 top-4 text-[#A84457] pointer-events-none"
                  >
                    <Heart className="w-5 h-5 fill-[#A84457]" />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Circle Invite Code Modal */}
      {showInviteModal && (
        <div
          onClick={() => setShowInviteModal(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm p-5 rounded-3xl bg-[#FAF7F2] dark:bg-[#1E191A] border border-[#476655] text-center space-y-4 shadow-2xl"
          >
            <ShieldCheck className="w-8 h-8 mx-auto text-[#476655]" />
            <h4 className="text-lg font-playfair font-semibold">Invite Family Member</h4>
            <p className="text-xs text-[#7C706D]">
              Give this code to your loved one to connect them to your sanctuary circle:
            </p>
            <div className="text-xl font-mono font-bold tracking-widest text-[#A84457]">
              {user.circleCode}
            </div>
            <button
              onClick={() => setShowInviteModal(false)}
              className="w-full py-2.5 rounded-full bg-[#476655] text-white text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
