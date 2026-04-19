/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MusicGate from './components/MusicGate';
import Polaroid from './components/Polaroid';
import FloatingMusicControls from './components/FloatingMusicControls';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [gatePassed, setGatePassed] = useState(false);
  const [isVideoBuffering, setIsVideoBuffering] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  
  // Refs for sections
  const heroRef = useRef<HTMLDivElement>(null);
  const chapter1Ref = useRef<HTMLDivElement>(null);
  const chapter2Ref = useRef<HTMLDivElement>(null);
  const chapter3Ref = useRef<HTMLDivElement>(null);
  const chapter4Ref = useRef<HTMLDivElement>(null);
  const chapter5Ref = useRef<HTMLDivElement>(null);
  const birthdayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gatePassed) return;

    const ctx = gsap.context(() => {
      // 1. Hero Ken Burns & Text Animation
      gsap.to(".hero-bg", {
        scale: 1.2,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "none"
      });

      gsap.from(".hero-text", {
        opacity: 0,
        y: 50,
        duration: 2,
        ease: "power4.out",
        delay: 0.5
      });

      // 2. Chapter 1: Pinned Word-by-word reveal
      const ch1Tl = gsap.timeline({
        scrollTrigger: {
          trigger: chapter1Ref.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1.5,
        }
      });

      // Wrap words in spans for reveal
      const ch1Text = document.querySelector('.ch1-text');
      if (ch1Text) {
        const words = ch1Text.textContent?.split(' ') || [];
        ch1Text.innerHTML = words.map(word => `<span class="opacity-10 inline-block mr-2">${word}</span>`).join('');
        
        ch1Tl.to('.ch1-text span', {
          opacity: 1,
          stagger: 0.1,
          ease: "none"
        })
        .from('.ch1-photo', {
          x: 100,
          opacity: 0,
          rotation: 15,
          duration: 1
        }, "-=0.5");
      }

      // 3. Chapter 2: Horizontal Photo Strip
      const ch2Tl = gsap.timeline({
        scrollTrigger: {
          trigger: chapter2Ref.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1.5,
        }
      });

      ch2Tl.to('.photo-strip', {
        x: (index, target: any) => -(target.scrollWidth - window.innerWidth),
        ease: "none"
      });

      gsap.from('.photo-strip-item', {
        scrollTrigger: {
          trigger: chapter2Ref.current,
          start: "top center",
          end: "bottom center",
          scrub: 1
        },
        y: 100,
        stagger: 0.2,
        opacity: 0
      });

      // 3. Chapter 3: Video Pinned
      const ch3Tl = gsap.timeline({
        scrollTrigger: {
          trigger: chapter3Ref.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1.5,
          onEnter: () => {
            gsap.to(audioRef.current, { volume: 0, duration: 1 });
            videoRef.current?.play().catch(e => console.error("Video play failed", e));
          },
          onLeave: () => {
            gsap.to(audioRef.current, { volume: 1, duration: 1 });
            videoRef.current?.pause();
          },
          onEnterBack: () => {
            gsap.to(audioRef.current, { volume: 0, duration: 1 });
            videoRef.current?.play().catch(e => console.error("Video play failed", e));
          },
          onLeaveBack: () => {
            gsap.to(audioRef.current, { volume: 1, duration: 1 });
            videoRef.current?.pause();
          }
        }
      });

      ch3Tl.from('.ch3-quote', {
        opacity: 0,
        scale: 0.9,
        duration: 1
      });

      // 5. Chapter 4: Scattered Gallery
      const ch4Tl = gsap.timeline({
        scrollTrigger: {
          trigger: chapter4Ref.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
        }
      });

      // Animate each item in sequence within the pinned timeline
      gsap.utils.toArray('.scattered-item').forEach((item: any, i) => {
        ch4Tl.from(item, {
          x: i % 2 === 0 ? -200 : 200,
          y: 100,
          rotation: i % 2 === 0 ? -25 : 25,
          opacity: 0,
          duration: 1,
          ease: "power2.out"
        }, i * 0.5); // Stagger them by 0.5 units in timeline time
      });

      // 6. Chapter 5: Love Letter Reveal
      const ch5Tl = gsap.timeline({
        scrollTrigger: {
          trigger: chapter5Ref.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1.5,
        }
      });

      ch5Tl.from('.letter-paragraph', {
        opacity: 0,
        y: 50,
        stagger: 1,
        duration: 1
      });

      // 7. Birthday Finale
      gsap.from(".birthday-content", {
        scrollTrigger: {
          trigger: birthdayRef.current,
          start: "top center",
          toggleActions: "play none none reverse"
        },
        scale: 0.8,
        opacity: 0,
        duration: 2,
        ease: "back.out(1.7)"
      });

    }, mainContainerRef);

    return () => ctx.revert();
  }, [gatePassed]);

  return (
    <div className="relative overflow-x-hidden" ref={mainContainerRef}>
      <div className="film-grain" />
      <div className="vignette" />
      
      <audio 
        ref={audioRef} 
        src="/Photograph [SlbfAYvA_gI].mp3" 
        loop 
        preload="auto"
      />

      <MusicGate 
        onStart={() => setGatePassed(true)} 
        audioRef={audioRef} 
      />

      <FloatingMusicControls 
        audioRef={audioRef} 
        show={gatePassed} 
      />

      {gatePassed && (
        <main className="w-full">
          {/* Hero Section */}
          <section 
            ref={heroRef}
            className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-charcoal"
          >
            <div 
              className="hero-bg absolute inset-0 bg-cover bg-center grayscale-[20%] scale-[1.3] md:scale-110"
              style={{ backgroundImage: 'url(HeroSection.webp)' }}
            />
            {/* Stronger Cinematic Overlay */}
            <div className="absolute inset-0 bg-black/40" /> 
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
            
            <div className="relative z-10 text-center px-6">
              <h1 className="hero-text font-script text-cream text-5xl sm:text-7xl md:text-9xl mb-4 text-shadow-lg leading-tight">
                Every love has a story.
              </h1>
              <p className="font-body text-amber text-lg md:text-2xl tracking-[0.2em] md:tracking-widest uppercase font-medium text-shadow-md">
                Ours began in the quiet moments
              </p>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-cream/50">
              <ChevronDown size={32} />
            </div>
          </section>

          {/* Chapter 1: The Beginning */}
          <section 
            ref={chapter1Ref}
            className="relative h-screen bg-offwhite flex items-center justify-center overflow-hidden px-6 md:px-8"
          >
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-4 md:space-y-6">
                <span className="font-script text-amber text-3xl md:text-4xl block">First Meet</span>
                <h2 className="text-3xl md:text-6xl font-serif text-burgundy mb-4 md:mb-8">The Beginning</h2>
                <div className="ch1-text font-body text-xl md:text-3xl leading-relaxed text-charcoal/80">
                  It started with a simple glance in a crowded beach. A moment where the world seemed to slow down, and for the first time, I saw everything clearly. We didn't know then that this was the start of our forever.
                </div>
              </div>
              <div className="ch1-photo flex justify-center scale-90 md:scale-100">
                <Polaroid 
                  src="/Chapter1.webp"
                  alt="Our first meeting"
                  caption="Where it all began"
                  rotation={-3}
                />
              </div>
            </div>
          </section>

          {/* Chapter 2: First Adventures */}
          <section 
            ref={chapter2Ref}
            className="relative h-screen bg-sepia/10 flex flex-col justify-center overflow-hidden"
          >
            <div className="px-6 md:px-12 mb-8 md:mb-12">
              <span className="font-script text-amber text-3xl md:text-4xl block">The Wild Years</span>
              <h2 className="text-3xl md:text-6xl font-serif text-burgundy">First Adventures</h2>
            </div>
            <div className="photo-strip flex gap-6 md:gap-12 px-6 md:px-12 items-start w-fit">
              <div className="photo-strip-item scale-[0.85] md:scale-100 origin-top">
                <Polaroid 
                  src="/DnDTogether.webp"
                  alt="DnD games"
                  caption="Playing DnD together"
                  rotation={2}
                />
              </div>
              <div className="photo-strip-item mt-10 md:mt-20 scale-[0.85] md:scale-100 origin-top">
                <Polaroid 
                  src="/PantaiKuta.webp"
                  alt="Beach day"
                  caption="Salty air & laughter"
                  rotation={-4}
                />
              </div>
              <div className="photo-strip-item scale-[0.85] md:scale-100 origin-top">
                <Polaroid 
                  src="/Nugas.webp"
                  alt="Nugas"
                  caption="Accompany me while coding"
                  rotation={3}
                />
              </div>
              <div className="photo-strip-item mt-8 md:mt-12 scale-[0.85] md:scale-100 origin-top">
                <Polaroid 
                  src="/Gogo.webp"
                  alt="Gogo date"
                  caption="Simple Restaurant Dates"
                  rotation={-2}
                />
              </div>
            </div>
          </section>

          {/* Chapter 3: Video Memory */}
          <section 
            ref={chapter3Ref}
            className="relative h-screen bg-charcoal flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
              <video 
                ref={videoRef}
                loop 
                muted={false}
                playsInline
                preload="metadata"
                className="w-full h-full object-cover grayscale opacity-40 scale-[1.1]"
                onWaiting={() => setIsVideoBuffering(true)}
                onPlaying={() => setIsVideoBuffering(false)}
                onCanPlay={() => setIsVideoBuffering(false)}
              >
                <source src="/Chapter3.mp4" type="video/mp4" />
              </video>
              
              {/* Cinematic Loading Overlay */}
              <AnimatePresence>
                {isVideoBuffering && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-charcoal/40 backdrop-blur-[2px]"
                  >
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 border-2 border-amber/30 border-t-amber rounded-full animate-spin mx-auto" />
                      <p className="font-serif italic text-cream text-xl tracking-widest animate-pulse">
                        Loading Memory...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
            </div>
            <div className="relative z-10 text-center px-6 max-w-4xl">
              <blockquote className="ch3-quote text-cream">
                <p className="font-serif italic text-2xl md:text-5xl lg:text-6xl mb-6 md:mb-8 leading-tight text-shadow-lg">
                  "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine."
                </p>
                <cite className="font-body uppercase tracking-[0.2em] text-amber text-base md:text-lg text-shadow-md">— Maya Angelou</cite>
              </blockquote>
            </div>
          </section>

          {/* Chapter 4: Little Moments */}
          <section 
            ref={chapter4Ref}
            className="relative h-screen bg-offwhite overflow-hidden"
          >
            <div className="absolute top-16 md:top-24 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none px-4 w-full">
              <span className="font-script text-amber text-3xl md:text-4xl block italic">The Chapters In-between</span>
              <h2 className="text-3xl md:text-6xl font-serif text-burgundy drop-shadow-sm">Little Moments</h2>
            </div>
            
            <div className="relative w-full h-full">
              <div className="scattered-item absolute top-[20%] left-[5%] md:left-[10%] scale-[0.7] md:scale-90 lg:scale-100">
                <Polaroid 
                  src="/1.webp" 
                  alt="Moment 1" 
                  caption="My room"
                  rotation={-5}
                />
              </div>
              <div className="scattered-item absolute top-[15%] right-[2%] md:right-[15%] scale-[0.7] md:scale-90 lg:scale-100">
                <Polaroid 
                  src="/2.webp" 
                  alt="Moment 2" 
                  caption="Eat again"
                  rotation={8}
                />
              </div>
              <div className="scattered-item absolute top-[45%] left-[-5%] md:left-[20%] scale-[0.7] md:scale-90 lg:scale-100">
                <Polaroid 
                  src="/3.webp" 
                  alt="Moment 3" 
                  caption="Nasi Goreng with Pork & Beacon"
                  rotation={-2}
                />
              </div>
              <div className="scattered-item absolute top-[50%] right-[-5%] md:right-[10%] scale-[0.7] md:scale-90 lg:scale-100">
                <Polaroid 
                  src="/4.webp" 
                  alt="Moment 4" 
                  caption="Romantic Hug"
                  rotation={4}
                />
              </div>
              <div className="scattered-item absolute top-[70%] left-[10%] md:left-[15%] scale-[0.7] md:scale-90 lg:scale-100">
                <Polaroid 
                  src="/5.webp" 
                  alt="Moment 5" 
                  caption="Always together"
                  rotation={-7}
                />
              </div>
            </div>
          </section>

          {/* Chapter 5: The Love Letter */}
          <section 
            ref={chapter5Ref}
            className="relative h-screen bg-burgundy flex items-center justify-center overflow-hidden px-6"
          >
            <div className="max-w-3xl w-full text-cream space-y-6 md:space-y-12">
              <div className="letter-paragraph space-y-4 md:space-y-6">
                <p className="font-body text-lg md:text-2xl italic opacity-90 leading-relaxed">
                  My Dearest,
                </p>
                <p className="font-body text-lg md:text-3xl leading-relaxed">
                  They say that time is the fire in which we burn, but with you, time feels like a sanctuary. Every second we've spent building this life together is a memory I treasure.
                </p>
              </div>
              
              <p className="letter-paragraph font-body text-lg md:text-3xl leading-relaxed">
                Thank you for being my anchor in the storm and the light in my darkest days. You are the story I want to keep writing, as long as we have ink.
              </p>

              <div className="letter-paragraph pt-6 md:pt-12">
                <p className="font-body text-lg italic opacity-80 mb-1 md:mb-2">Forever yours,</p>
                <p className="font-script text-4xl md:text-7xl text-amber">— Signed with Love</p>
              </div>
            </div>
          </section>

          {/* Birthday Finale Section */}
          <section 
            ref={birthdayRef}
            className="relative h-screen bg-charcoal flex flex-col items-center justify-center overflow-hidden px-6"
          >
            {/* Background Flair */}
            <div className="absolute inset-0 opacity-20 bg-radial-[circle_at_center,_var(--color-amber)_0%,_transparent_70%]" />
            
            <div className="birthday-content relative z-10 text-center space-y-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [-1, 1, -1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <h2 className="font-script text-6xl md:text-9xl text-amber text-shadow-lg">
                  Happy Birth Day Sayang &lt;3
                </h2>
              </motion.div>
              
              <div className="space-y-4">
                <p className="font-serif text-cream text-xl md:text-3xl tracking-widest uppercase opacity-80">
                  To many more chapters together
                </p>
                <div className="w-24 h-[1px] bg-amber/50 mx-auto" />
                <p className="font-body text-cream/60 italic text-lg md:text-xl">
                  You are my favorite story.
                </p>
              </div>

              {/* Decorative Hearts/Sparkles could be added here */}
            </div>
            
            <div className="absolute bottom-8 text-cream/20 font-body text-sm tracking-tighter">
              Scroll back up to relive the story
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

