// src/components/ImageComparison.tsx
'use client';

import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from '@/components/ui/image-comparison';

export default function ImageComparisonCustom({
  before,
  after,
  altLeft = 'before',
  altRight = 'after',
}: {
  before: string;
  after: string;
  altLeft?: string;
  altRight?: string;
}) {
  return (
    <ImageComparison
      // ① fixed 3:2 aspect ratio so the container keeps height
      className='w-full aspect-[3/2] rounded-lg border border-zinc-200 dark:border-zinc-800'
    >
      {/* ② Before image */}
      <ImageComparisonImage
        src={before}
        alt={altLeft}
        position='left'
        className='object-contain w-full h-full'
      />

      {/* ③ After image */}
      <ImageComparisonImage
        src={after}
        alt={altRight}
        position='right'
        className='object-contain w-full h-full'
      />

      {/* ④ Slider handle */}
      <ImageComparisonSlider className='w-2 bg-white/50 backdrop-blur-xs transition-colors hover:bg-white/80'>
        <div className='absolute left-1/2 top-1/2 h-8 w-6 -translate-x-1/2 -translate-y-1/2 rounded-[4px] bg-white' />
      </ImageComparisonSlider>
    </ImageComparison>
  );
}
