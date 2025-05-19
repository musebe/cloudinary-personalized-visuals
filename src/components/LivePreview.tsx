'use client';

import Image from 'next/image';
import { motion } from 'motion/react';

type Gravity =
  | 'north_west'
  | 'north'
  | 'north_east'
  | 'west'
  | 'center'
  | 'east'
  | 'south_west'
  | 'south'
  | 'south_east';

interface LivePreviewProps {
  baseUrl: string;
  overlay?: {
    mode: 'text' | 'image';
    text?: string;
    imageId?: string;
    textColor: string;
    bgColor: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: 'normal' | 'bold';
    gravity: Gravity;
    x: number;
    y: number;
  };
}

const GRAVITY_TO_CLASS: Record<Gravity, string> = {
  north_west: 'items-start justify-start',
  north: 'items-start justify-center',
  north_east: 'items-start justify-end',
  west: 'items-center justify-start',
  center: 'items-center justify-center',
  east: 'items-center justify-end',
  south_west: 'items-end justify-start',
  south: 'items-end justify-center',
  south_east: 'items-end justify-end',
};

export function LivePreview({ baseUrl, overlay }: LivePreviewProps) {
  return (
    <div className='relative w-full h-[400px] rounded-lg border bg-gray-50 overflow-hidden'>
      {baseUrl && (
        <Image
          src={baseUrl}
          alt='preview'
          fill
          className='object-contain'
          unoptimized
        />
      )}

      {overlay && (
        <div
          className={`absolute inset-0 flex ${
            GRAVITY_TO_CLASS[overlay.gravity]
          }`}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{ transform: `translate(${overlay.x}px,${overlay.y}px)` }}
          >
            {overlay.mode === 'text' && overlay.text ? (
              <motion.span
                key={`${overlay.text}-${overlay.textColor}-${overlay.bgColor}`}
                className='inline-block rounded-lg shadow-md'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                style={{
                  color: `#${overlay.textColor}`,
                  backgroundColor: `#${overlay.bgColor}`,
                  fontFamily: overlay.fontFamily,
                  fontSize: overlay.fontSize,
                  fontWeight: overlay.fontWeight,
                  padding: '4px 12px',
                }}
              >
                {overlay.text}
              </motion.span>
            ) : overlay.mode === 'image' && overlay.imageId ? (
              <motion.div
                key={overlay.imageId}
                className='relative w-32 h-32 overflow-hidden rounded-lg shadow-md'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
              >
                <Image
                  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${overlay.imageId}.png`}
                  alt='overlay'
                  fill
                  className='object-contain'
                  unoptimized
                />
              </motion.div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
