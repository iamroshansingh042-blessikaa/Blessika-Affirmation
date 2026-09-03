import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Gift, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../services/audioSynthesizer';

export const DailyScratchCard: React.FC = () => {
  const { scratchReward, claimScratchReward } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [clearedPercent, setClearedPercent] = useState(scratchReward.isRevealed ? 100 : 0);

  useEffect(() => {
    if (scratchReward.isRevealed) {
      setClearedPercent(100);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI canvas resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Render shimmering Gold/Silver Scratch Foil
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#C9A96E');
    gradient.addColorStop(0.3, '#E6D3A3');
    gradient.addColorStop(0.5, '#A88448');
    gradient.addColorStop(0.8, '#D8C28E');
    gradient.addColorStop(1, '#9C763A');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Decorative foil pattern lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    for (let i = -rect.height; i < rect.width + rect.height; i += 24) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + rect.height, rect.height);
      ctx.stroke();
    }

    // Centered foil seal stamp
    ctx.fillStyle = '#1F1617';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ SCRATCH TO REVEAL BLESSING ✦', rect.width / 2, rect.height / 2 + 4);
  }, [scratchReward.isRevealed]);

  const scratch = (clientX: number, clientY: number) => {
    if (scratchReward.isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * window.devicePixelRatio;
    const y = (clientY - rect.top) * window.devicePixelRatio;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22 * window.devicePixelRatio, 0, Math.PI * 2);
    ctx.fill();

    // Soft haptic scratch tone
    if (Math.random() < 0.25) {
      soundEngine.playTone(800 + Math.random() * 400, 0.03);
    }

    checkClearedPercentage();
  };

  const checkClearedPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sample pixels to evaluate percentage scratched
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;
      const totalPixels = pixels.length / 4;

      // Sample every 8th pixel for fast performance
      for (let i = 3; i < pixels.length; i += 32) {
        if (pixels[i] < 128) {
          transparentCount++;
        }
      }

      const percent = Math.round((transparentCount / (totalPixels / 8)) * 100);
      setClearedPercent(percent);

      if (percent >= 45 && !scratchReward.isRevealed) {
        // Trigger celebration confetti
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#A84457', '#8A6223', '#476655', '#D4AF37'],
        });
        claimScratchReward();
      }
    } catch {
      // Fallback
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => setIsDrawing(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDrawing(true);
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawing) return;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#A84457]/10 flex items-center justify-center text-[#A84457]">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
              Daily Scratch-to-Reveal Reward
            </h3>
            <span className="text-[11px] text-[#7C706D] dark:text-[#A89F9E]">
              {scratchReward.isRevealed ? 'Revealed & Claimed' : 'Rub foil to uncover cosmic blessing'}
            </span>
          </div>
        </div>

        <span className="text-xs font-bold text-[#8A6223]">
          {scratchReward.isRevealed ? '✓ Claimed' : `${clearedPercent}% cleared`}
        </span>
      </div>

      {/* Scratch Box Area */}
      <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#EFE9DF] dark:border-[#362D30] select-none touch-none">
        {/* Underneath Reward Card Content */}
        <div className="absolute inset-0 p-4 bg-gradient-to-tr from-[#FAF7F2] to-white dark:from-[#262022] dark:to-[#1E191A] flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-full bg-[#8A6223]/10 text-[#8A6223] flex items-center justify-center mb-1">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#A84457] dark:text-[#D47185]">
            {scratchReward.title}
          </div>
          <div className="text-sm font-playfair font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
            {scratchReward.rewardText}
          </div>
          <div className="mt-1 text-[10px] font-mono text-[#7C706D]">
            Code: {scratchReward.code}
          </div>
        </div>

        {/* Tactile Scratch Foil Canvas */}
        {!scratchReward.isRevealed && (
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="absolute inset-0 w-full h-full cursor-crosshair z-10"
          />
        )}
      </div>

      {/* Reward Status Banner */}
      {scratchReward.isRevealed && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#476655]/10 text-[#476655] dark:text-[#6B947E] text-xs font-medium">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>+75 Karma XP credited to your sanctuary</span>
          </div>
          <span className="font-bold">2x Multiplier Active</span>
        </div>
      )}
    </div>
  );
};
