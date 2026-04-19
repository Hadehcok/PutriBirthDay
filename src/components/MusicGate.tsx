import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';

interface MusicGateProps {
  onStart: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export default function MusicGate({ onStart, audioRef }: MusicGateProps) {
  const [isStarted, setIsStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio playback failed", e));
    }
    
    // Animate out
    const tl = gsap.timeline({
      onComplete: () => {
        setIsStarted(true);
        onStart();
      }
    });

    tl.to(containerRef.current, {
      opacity: 0,
      scale: 1.1,
      duration: 1.5,
      ease: 'power4.inOut'
    });
  };

  if (isStarted) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-burgundy flex flex-col items-center justify-center text-cream overflow-hidden gate-shadow"
    >
      {/* Film Grain inside gate too */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="text-center px-6 max-w-2xl relative z-10"
      >
        <h1 className="font-script text-6xl md:text-8xl mb-6 text-amber gate-text-shadow">
          This story is best felt with sound
        </h1>
        <p className="font-body italic text-xl md:text-2xl opacity-80 mb-12">
          Turn up your volume and press play to begin
        </p>

        <button 
          onClick={handleStart}
          className="group relative flex items-center justify-center w-[100px] h-[100px] rounded-full border-2 border-amber bg-transparent text-amber transition-transform hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(200,136,42,0.4)]"
          aria-label="Play Story"
        >
          {/* Pulsing ring animation */}
          <div className="absolute inset-0 rounded-full border border-amber/50 animate-ping opacity-20 group-hover:opacity-40" />
          <Play fill="currentColor" size={32} className="ml-1" />
        </button>
      </motion.div>
    </div>
  );
}
