// src/components/segments/UploadButton.tsx
'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';

interface UploadButtonProps {
  onUpload: (publicId: string) => void;
}

export function UploadButton({ onUpload }: UploadButtonProps) {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
      onSuccess={(res) => {
        if (res.info && typeof res.info !== 'string') {
          onUpload(res.info.public_id);
        }
      }}
    >
      {({ open }) => (
        <Button onClick={() => open()} className='w-full'>
          Upload product image
        </Button>
      )}
    </CldUploadWidget>
  );
}
