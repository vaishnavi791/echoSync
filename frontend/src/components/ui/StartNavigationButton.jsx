import React from 'react';
import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';

const StartNavigationButton = ({ onClick, disabled = false }) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`relative group px-8 py-4 bg-violet rounded-full font-bold text-lg text-white shadow-lg animate-pulse-glow flex items-center gap-3 transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-violet/90'
      }`}
    >
      <Navigation size={24} />
      {disabled ? 'LOADING...' : 'START NAVIGATION'}
    </motion.button>
  );
};

export default StartNavigationButton;
