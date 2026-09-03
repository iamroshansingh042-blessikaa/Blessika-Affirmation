import React from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Check,
  CheckCircle2,
  Compass,
  Crown,
  Flame,
  Lock,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../services/audioSynthesizer';

export const QuestTracker: React.FC = () => {
  const {
    challengeTracks,
    activeTrackId,
    setActiveTrackId,
    toggleTaskCompletion,
    user,
  } = useApp();

  const currentTrack =
    challengeTracks.find((t) => t.id === activeTrackId) || challengeTracks[0];

  const todayTask =
    currentTrack.tasks.find((t) => t.day === user.currentDay) || currentTrack.tasks[0];

  const completedCount = currentTrack.tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / 21) * 100);

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-sm space-y-4">
      {/* Header & Track Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#8A6223]/10 flex items-center justify-center text-[#8A6223]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
              21-Day Quest Roadmap
            </h3>
            <span className="text-[11px] text-[#7C706D] dark:text-[#A89F9E]">
              {completedCount} of 21 Days Completed • {progressPercent}%
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#FAF7F2] dark:bg-[#262022] text-xs font-semibold text-[#8A6223]">
          <Flame className="w-3.5 h-3.5 text-[#A84457] fill-[#A84457]" />
          <span>{user.streakCount}d Streak</span>
        </div>
      </div>

      {/* Track Selection Tabs */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar py-0.5">
        {challengeTracks.map((track) => {
          const isActive = track.id === activeTrackId;
          return (
            <button
              key={track.id}
              onClick={() => {
                soundEngine.playHapticTone();
                setActiveTrackId(track.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#8A6223] text-white shadow-sm'
                  : 'bg-[#FAF7F2] dark:bg-[#262022] text-[#7C706D] hover:text-[#1F1617]'
              }`}
            >
              {track.title}
            </button>
          );
        })}
      </div>

      {/* Today's Actionable Micro-Task Box */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#FAF7F2] to-white dark:from-[#262022] dark:to-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A84457] dark:text-[#D47185]">
              Today’s Sacred Action (Day {todayTask.day})
            </span>
            <h4 className="text-sm font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
              {todayTask.title}
            </h4>
          </div>
          <button
            onClick={() => toggleTaskCompletion(todayTask.day)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              todayTask.completed
                ? 'bg-[#476655] text-white shadow-sm'
                : 'border-2 border-[#8A6223] text-transparent hover:border-[#476655]'
            }`}
            title="Mark Completed"
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        <p className="text-xs text-[#7C706D] dark:text-[#A89F9E]">
          {todayTask.action}
        </p>

        {todayTask.completed && (
          <div className="text-[11px] text-[#476655] dark:text-[#6B947E] font-medium flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Completed! +{todayTask.xp} Karma XP Earned</span>
          </div>
        )}
      </div>

      {/* 21-Node Visual Milestone Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#7C706D] dark:text-[#A89F9E] px-0.5">
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            Milestone Map
          </span>
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="flex items-center">🥉 D7</span>
            <span className="flex items-center">🥈 D14</span>
            <span className="flex items-center">👑 D21</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-1">
          {currentTrack.tasks.map((task) => {
            const isToday = task.day === user.currentDay;
            const isMilestone = task.day === 7 || task.day === 14 || task.day === 21;

            return (
              <motion.button
                key={task.day}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleTaskCompletion(task.day)}
                className={`relative h-10 rounded-xl flex flex-col items-center justify-center border text-xs font-semibold transition-all ${
                  task.completed
                    ? 'bg-[#476655] text-white border-[#476655] shadow-xs'
                    : isToday
                    ? 'bg-white dark:bg-[#262022] border-2 border-[#A84457] text-[#A84457]'
                    : 'bg-[#FAF7F2] dark:bg-[#1E191A] border-[#EFE9DF] dark:border-[#362D30] text-[#7C706D]'
                }`}
              >
                {task.completed ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span>{task.day}</span>
                )}

                {/* Milestone Badge Icon */}
                {isMilestone && (
                  <span
                    className={`absolute -top-1.5 -right-1 text-[9px] px-1 rounded-full ${
                      task.completed ? 'bg-[#8A6223] text-white' : 'bg-[#EFE9DF] text-[#8A6223]'
                    }`}
                  >
                    ★
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
