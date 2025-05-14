'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, PanInfo } from 'motion/react';
import Image from 'next/image';
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from 'next-cloudinary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addTransform } from '@/app/actions/transforms';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

type OverlayMode = 'text' | 'image';

export default function Uploader() {
  const router = useRouter();

  const [publicId, setPublicId] = useState('');
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('text');
  const [overlayText, setOverlayText] = useState('');
  const [overlayImgId, setOverlayImgId] = useState('');
  const [replaceFrom, setReplaceFrom] = useState('');
  const [replaceTo, setReplaceTo] = useState('');
  const [pos, setPos] = useState({ x: 20, y: 20 });

  // Debug logs
  useEffect(() => console.log('publicId →', publicId), [publicId]);
  useEffect(() => console.log('overlayImgId →', overlayImgId), [overlayImgId]);

  const overlayChosen =
    overlayMode === 'text'
      ? overlayText.trim() !== ''
      : overlayImgId.trim() !== '';

  const handleSave = async () => {
    console.log('[Save]', {
      publicId,
      replaceFrom,
      replaceTo,
      overlayMode,
      overlayChosen,
      pos,
    });
    if (!publicId) return;
    const data = new FormData();
    data.set('publicId', publicId);
    data.set('from', replaceFrom);
    data.set('to', replaceTo);
    data.set('overlayMode', overlayMode);
    data.set('overlay', overlayMode === 'text' ? overlayText : overlayImgId);
    data.set('x', String(pos.x));
    data.set('y', String(pos.y));

    await addTransform(null, data);
    router.refresh();
  };

  const buildUrl = (id: string) =>
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${id}.png`;

  return (
    <div className='space-y-6'>
      {/* ① Upload the real image */}
      <CldUploadWidget
        uploadPreset={UPLOAD_PRESET}
        onSuccess={(result: CloudinaryUploadWidgetResults) => {
          console.log('[Uploader] upload result:', result);
          if (result.info && typeof result.info !== 'string') {
            setPublicId(result.info.public_id);
          }
        }}
      >
        {({ open }) => (
          <Button onClick={() => open()} className='w-full'>
            Upload product image
          </Button>
        )}
      </CldUploadWidget>

      {/* ② Overlay choice */}
      <div className='flex gap-2'>
        <Button
          variant={overlayMode === 'text' ? 'default' : 'outline'}
          onClick={() => setOverlayMode('text')}
        >
          Text
        </Button>
        <Button
          variant={overlayMode === 'image' ? 'default' : 'outline'}
          onClick={() => setOverlayMode('image')}
        >
          Image
        </Button>
      </div>

      {/* ③ Overlay input */}
      {overlayMode === 'text' ? (
        <Input
          placeholder='e.g. CLEARANCE'
          value={overlayText}
          onChange={(e) => setOverlayText(e.target.value)}
        />
      ) : (
        <CldUploadWidget
          uploadPreset={UPLOAD_PRESET}
          onSuccess={(result: CloudinaryUploadWidgetResults) => {
            console.log('[Uploader] overlay upload:', result);
            if (result.info && typeof result.info !== 'string') {
              setOverlayImgId(result.info.public_id);
            }
          }}
        >
          {({ open }) => (
            <Button
              variant='secondary'
              onClick={() => open()}
              className='w-full'
            >
              Upload overlay image
            </Button>
          )}
        </CldUploadWidget>
      )}

      {/* ④ Generative Replace fields */}
      <div className='flex gap-2'>
        <Input
          placeholder='Replace…'
          value={replaceFrom}
          onChange={(e) => setReplaceFrom(e.target.value)}
        />
        <Input
          placeholder='with…'
          value={replaceTo}
          onChange={(e) => setReplaceTo(e.target.value)}
        />
      </div>

      {/* ⑤ Drag Area Preview */}
      <div className='relative border rounded overflow-hidden bg-gray-100'>
        {publicId ? (
          <Image
            src={buildUrl(publicId)}
            alt='Preview'
            width={600}
            height={400}
            unoptimized
            className='w-full h-auto select-none pointer-events-none'
          />
        ) : (
          <div className='flex items-center justify-center w-full h-64 text-gray-500'>
            No image uploaded yet
          </div>
        )}

        {publicId && overlayChosen && (
          <motion.div
            drag
            // ② fluid drag: update every frame via delta
            onDrag={(_e, info: PanInfo) =>
              setPos((prev) => ({
                x: Math.round(prev.x + info.delta.x),
                y: Math.round(prev.y + info.delta.y),
              }))
            }
            className='absolute cursor-move'
            style={{ left: pos.x, top: pos.y }}
          >
            {overlayMode === 'text' ? (
              <span className='bg-black/70 text-white px-3 py-1 rounded shadow'>
                {overlayText}
              </span>
            ) : (
              <Image
                src={buildUrl(overlayImgId)}
                alt='Overlay'
                width={140}
                height={140}
                unoptimized
              />
            )}
          </motion.div>
        )}
      </div>

      {/* ⑥ Save */}
      <Button disabled={!publicId} onClick={handleSave} className='w-full'>
        Save
      </Button>
    </div>
  );
}
