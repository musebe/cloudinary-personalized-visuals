// src/components/Uploader.tsx
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
import { Switch } from '@/components/ui/switch';
import { addTransform } from '@/app/actions/transforms';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

type OverlayMode = 'text' | 'image';
type ColorOption = { name: string; hex: string; bgClass: string };

const COLORS: ColorOption[] = [
  { name: 'Black', hex: '000000', bgClass: 'bg-black/70 text-white' },
  { name: 'White', hex: 'FFFFFF', bgClass: 'bg-white/70 text-black' },
  { name: 'Red', hex: 'FF0000', bgClass: 'bg-red-500 text-white' },
  { name: 'Blue', hex: '0000FF', bgClass: 'bg-blue-500 text-white' },
  { name: 'Green', hex: '00FF00', bgClass: 'bg-green-500 text-white' },
];

export default function Uploader() {
  const router = useRouter();

  // ① Core state
  const [publicId, setPublicId] = useState<string>('');
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('text');
  const [overlayText, setOverlayText] = useState<string>('');
  const [overlayImgId, setOverlayImgId] = useState<string>('');
  const [replaceFrom, setReplaceFrom] = useState<string>('');
  const [replaceTo, setReplaceTo] = useState<string>('');
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 20, y: 20 });

  // ⑧ Toggles
  const [enableReplace, setEnableReplace] = useState<boolean>(true);
  const [enableOverlay, setEnableOverlay] = useState<boolean>(true);

  // ⑨ Color picker
  const [overlayColor, setOverlayColor] = useState<ColorOption>(COLORS[0]);

  // Debug logs
  useEffect(() => console.log('publicId →', publicId), [publicId]);
  useEffect(() => console.log('overlayImgId →', overlayImgId), [overlayImgId]);
  useEffect(() => console.log('overlayColor →', overlayColor), [overlayColor]);

  // Only show badge if overlay is enabled and input exists
  const overlayChosen =
    enableOverlay &&
    (overlayMode === 'text'
      ? overlayText.trim() !== ''
      : overlayImgId.trim() !== '');

  const buildUrl = (id: string) =>
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${id}.png`;

  // ⑥ Save handler
  const handleSave = async () => {
    if (!publicId) return;
    console.log('[Save]', {
      publicId,
      replaceFrom,
      replaceTo,
      overlayMode,
      overlayChosen,
      pos,
      enableReplace,
      enableOverlay,
      overlayColor,
    });

    const form = new FormData();
    form.set('publicId', publicId);

    if (enableReplace) {
      form.set('from', replaceFrom);
      form.set('to', replaceTo);
    } else {
      form.set('from', '');
      form.set('to', '');
    }

    form.set('overlayMode', overlayMode);
    if (enableOverlay) {
      form.set('overlay', overlayMode === 'text' ? overlayText : overlayImgId);
      form.set('overlayColor', overlayColor.hex);
    } else {
      form.set('overlay', '');
      form.set('overlayColor', '');
    }

    form.set('x', String(pos.x));
    form.set('y', String(pos.y));

    const rec = await addTransform(null, form);
    console.log('[Transform saved]', rec.transformedUrl);
    router.refresh();
  };

  return (
    <div className='space-y-6'>
      {/* ① Upload real image */}
      <CldUploadWidget
        uploadPreset={UPLOAD_PRESET}
        onSuccess={(res: CloudinaryUploadWidgetResults) => {
          if (res.info && typeof res.info !== 'string') {
            setPublicId(res.info.public_id);
          }
        }}
      >
        {({ open }) => (
          <Button onClick={() => open()} className='w-full'>
            Upload product image
          </Button>
        )}
      </CldUploadWidget>

      {/* ⑧ Enable Generative Replace */}
      <div className='flex items-center gap-2'>
        <Switch
          id='toggle-replace'
          checked={enableReplace}
          onCheckedChange={setEnableReplace}
        />
        <label htmlFor='toggle-replace' className='text-sm'>
          Enable Generative Replace
        </label>
      </div>

      {/* ⑧ Enable Overlay */}
      <div className='flex items-center gap-2'>
        <Switch
          id='toggle-overlay'
          checked={enableOverlay}
          onCheckedChange={setEnableOverlay}
        />
        <label htmlFor='toggle-overlay' className='text-sm'>
          Enable Overlay
        </label>
      </div>

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
          disabled={!enableOverlay}
        />
      ) : (
        <CldUploadWidget
          uploadPreset={UPLOAD_PRESET}
          onSuccess={(res) => {
            if (res.info && typeof res.info !== 'string') {
              setOverlayImgId(res.info.public_id);
            }
          }}
        >
          {({ open }) => (
            <Button
              variant='secondary'
              onClick={() => open()}
              className='w-full'
              disabled={!enableOverlay}
            >
              Upload overlay image
            </Button>
          )}
        </CldUploadWidget>
      )}

      {/* ⑨ Color palette (text only) */}
      {overlayMode === 'text' && enableOverlay && (
        <div className='flex gap-2'>
          {COLORS.map((c) => (
            <div
              key={c.hex}
              onClick={() => setOverlayColor(c)}
              className={`${
                c.bgClass
              } w-6 h-6 rounded-full cursor-pointer shadow ${
                c.hex === overlayColor.hex
                  ? 'ring-2 ring-offset-1 ring-zinc-900'
                  : ''
              }`}
              title={c.name}
            />
          ))}
        </div>
      )}

      {/* ④ Generative Replace fields */}
      {enableReplace && (
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
      )}

      {/* ⑤ Drag Area Preview */}
      <div className='relative border rounded overflow-hidden bg-gray-100'>
        {publicId ? (
          <Image
            src={buildUrl(publicId)}
            alt='Preview'
            width={600}
            height={400}
            unoptimized
            className='w-full h-auto select-none'
          />
        ) : (
          <div className='flex items-center justify-center w-full h-64 text-gray-500'>
            No image uploaded yet
          </div>
        )}

        {publicId && overlayChosen && (
          <motion.div
            drag
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
              <span
                className={`${overlayColor.bgClass} font-extrabold text-base px-4 py-2 rounded shadow`}
              >
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
