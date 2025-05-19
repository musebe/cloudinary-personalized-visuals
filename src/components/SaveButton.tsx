// src/components/SaveButton.tsx
'use client';

import { Button } from '@/components/ui/button';

interface SaveButtonProps {
  onSave: () => Promise<void>;
  disabled: boolean;
}

export function SaveButton({ onSave, disabled }: SaveButtonProps) {
  return (
    <Button onClick={onSave} disabled={disabled} className='w-full'>
      Save
    </Button>
  );
}
