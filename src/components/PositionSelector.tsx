// src/components/PositionSelector.tsx
'use client';

import React from 'react';
import clsx from 'clsx';

const GRAVITIES = [
  ['north_west', 'north', 'north_east'],
  ['west', 'center', 'east'],
  ['south_west', 'south', 'south_east'],
] as const;

export type Gravity = (typeof GRAVITIES)[number][number];

interface PositionSelectorProps {
  selected: Gravity;
  onSelect: (g: Gravity) => void;
}

export function PositionSelector({
  selected,
  onSelect,
}: PositionSelectorProps) {
  return (
    <div className='space-y-1'>
      <label className='text-sm'>Placement</label>
      <div className='grid grid-cols-3 gap-4 w-[100px] h-[100px]'>
        {GRAVITIES.flat().map((g) => (
          <button
            key={g}
            onClick={() => onSelect(g)}
            className={clsx(
              'w-6 h-6 rounded-full transition',
              selected === g
                ? 'bg-blue-500 ring-2 ring-offset-1 ring-blue-700'
                : 'bg-gray-300'
            )}
            aria-label={g}
          />
        ))}
      </div>
    </div>
  );
}
