import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChooseYourArtScreen } from './ChooseYourArtScreen';
import { CreateYourArtStudio } from './CreateYourArtStudio';
import { ArtTheme } from '../types';

export const MyArtStudio: React.FC = () => {
  const [viewMode, setViewMode] = useState<'choose' | 'create'>('choose');

  const handleSaved = (_theme: ArtTheme) => {
    setViewMode('choose');
  };

  return (
    <div className="w-full min-h-screen">
      <AnimatePresence mode="wait">
        {viewMode === 'choose' ? (
          <motion.div
            key="choose-art"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
          >
            <ChooseYourArtScreen onOpenCustomCreator={() => setViewMode('create')} />
          </motion.div>
        ) : (
          <motion.div
            key="create-art"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
          >
            <CreateYourArtStudio
              onClose={() => setViewMode('choose')}
              onSaved={handleSaved}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
