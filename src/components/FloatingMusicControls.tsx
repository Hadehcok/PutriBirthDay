import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingMusicControlsProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  show: boolean;
}

export default function FloatingMusicControls({ audioRef, show }: FloatingMusicControlsProps) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  if (!show) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-8 right-8 z-[150]"
    >
      <button
        onClick={toggleMute}
        className="w-12 h-12 rounded-full bg-burgundy text-cream flex items-center justify-center shadow-lg hover:bg-amber hover:text-burgundy transition-colors group"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-[pulse_2s_infinite]" />}
        <span className="absolute right-full mr-4 bg-burgundy text-cream px-3 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {isMuted ? 'Unmute' : 'Mute'}
        </span>
      </button>
    </motion.div>
  );
}
