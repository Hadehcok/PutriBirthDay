import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PolaroidProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  rotation?: number;
}

export default function Polaroid({ src, alt, caption, className, rotation = 0 }: PolaroidProps) {
  return (
    <div 
      className={cn(
        "polaroid w-64 md:w-80 transition-transform duration-500 hover:scale-105 hover:z-10",
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="w-full aspect-square overflow-hidden bg-charcoal/5">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
      {caption && (
        <p className="photo-caption text-center">{caption}</p>
      )}
    </div>
  );
}
