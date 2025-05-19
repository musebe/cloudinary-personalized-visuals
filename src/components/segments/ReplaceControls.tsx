// src/components/segments/ReplaceControls.tsx
'use client';

import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

interface ReplaceControlsProps {
  enabled: boolean;
  from: string;
  to: string;
  setEnabled: (v: boolean) => void;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
}

export function ReplaceControls({
  enabled,
  from,
  to,
  setEnabled,
  setFrom,
  setTo,
}: ReplaceControlsProps) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
        <label className='text-sm'>Enable Generative Replace</label>
      </div>
      {enabled && (
        <div className='flex gap-2'>
          <Input
            placeholder='Replace…'
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <Input
            placeholder='with…'
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
