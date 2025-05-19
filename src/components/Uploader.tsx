'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Repeat, Image as ImageIcon } from 'lucide-react';

import { UploadButton } from './segments/UploadButton';
import { ReplaceControls } from './segments/ReplaceControls';
import { OverlayControls, ColorOption } from './segments/OverlayControls';
import { PositionSelector, Gravity } from './PositionSelector';
import { LivePreview } from './LivePreview';
import { SaveButton } from './SaveButton';

import { buildTransform } from '@/lib/transform';
import { addTransform } from '@/app/actions/transforms';

/* debounce helper (350 ms) */
function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function Uploader() {
  const router = useRouter();

  /* base image */
  const [publicId, setPublicId] = useState('');
  const [active, setActive] = useState<'replace' | 'overlay'>('replace');

  /* generative replace */
  const [repEnabled, setRepEnabled] = useState(true);
  const [repFrom, setRepFrom] = useState('');
  const [repTo, setRepTo] = useState('');

  /* overlay */
  const [ovEnabled, setOvEnabled] = useState(true);
  const [ovMode, setOvMode] = useState<'text' | 'image'>('text');
  const [ovText, setOvText] = useState('');
  const [ovImg, setOvImg] = useState('');

  const [ovColor, setOvColor] = useState<ColorOption>({
    hex: '000000',
    bgClass: 'bg-black/70 text-white',
    name: 'Black',
  });
  const [ovBg, setOvBg] = useState<ColorOption>({
    hex: 'FFFFFF',
    bgClass: 'bg-white/70 text-black',
    name: 'White',
  });

  const [ovFontFamily, setOvFontFamily] = useState('Arial');
  const [ovFontSize, setOvFontSize] = useState(40);
  const [ovFontWeight, setOvFontWeight] = useState<'normal' | 'bold'>('bold');

  const [gravity, setGravity] = useState<Gravity>('north_west');
  const [ovX, setOvX] = useState(0);
  const [ovY, setOvY] = useState(0);

  /* ── build base image URL (replace only) ───────────────────────────── */
  const baseSegment = buildTransform({
    from: repEnabled ? repFrom || undefined : undefined,
    to: repEnabled ? repTo || undefined : undefined,
  });

  const baseUrl = publicId
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${baseSegment}${publicId}.png`
    : '';

  const debouncedBaseUrl = useDebouncedValue(baseUrl);

  /* overlay object for in-browser preview */
  const overlayPreview = ovEnabled
    ? {
        mode: ovMode,
        text: ovMode === 'text' ? ovText : undefined,
        imageId: ovMode === 'image' ? ovImg : undefined,
        textColor: ovColor.hex,
        bgColor: ovBg.hex,
        fontFamily: ovFontFamily,
        fontSize: ovFontSize,
        fontWeight: ovFontWeight,
        gravity,
        x: ovX,
        y: ovY,
      }
    : undefined;

  /* ── form submit → server action ───────────────────────────────────── */
  const handleSave = async () => {
    if (!publicId) return;

    const form = new FormData();
    form.set('publicId', publicId);

    form.set('from', repEnabled ? repFrom : '');
    form.set('to', repEnabled ? repTo : '');

    form.set('overlay', ovEnabled ? (ovMode === 'text' ? ovText : ovImg) : '');
    form.set('overlayMode', ovMode);
    form.set('overlayColor', ovColor.hex);
    form.set('overlayBg', ovBg.hex);

    form.set('fontFamily', ovFontFamily);
    form.set('fontSize', String(ovFontSize));
    form.set('fontWeight', ovFontWeight);

    form.set('gravity', gravity);
    form.set('x', String(ovX));
    form.set('y', String(ovY));

    await addTransform(null, form);
    router.refresh();
  };

  /* ── UI ─────────────────────────────────────────────────────────────── */
  return (
    <div className='flex flex-col md:flex-row gap-8 p-4'>
      {/* column 1 – mode buttons */}
      <div className='flex-shrink-0 flex flex-col items-center space-y-4 md:w-16'>
        <button
          onClick={() => setActive('replace')}
          title='Generative replace'
          className={`p-2 rounded ${
            active === 'replace' ? 'bg-slate-200' : 'hover:bg-slate-100'
          }`}
        >
          <Repeat className='w-6 h-6' />
        </button>
        <button
          onClick={() => setActive('overlay')}
          title='Overlay'
          className={`p-2 rounded ${
            active === 'overlay' ? 'bg-slate-200' : 'hover:bg-slate-100'
          }`}
        >
          <ImageIcon className='w-6 h-6' />
        </button>
      </div>

      {/* column 2 – controls */}
      <div className='space-y-6 md:w-1/3'>
        <UploadButton onUpload={setPublicId} />

        {active === 'replace' ? (
          <ReplaceControls
            enabled={repEnabled}
            from={repFrom}
            to={repTo}
            setEnabled={setRepEnabled}
            setFrom={setRepFrom}
            setTo={setRepTo}
          />
        ) : (
          <OverlayControls
            enabled={ovEnabled}
            mode={ovMode}
            text={ovText}
            imgId={ovImg}
            color={ovColor}
            bgColor={ovBg}
            fontFamily={ovFontFamily}
            fontSize={ovFontSize}
            fontWeight={ovFontWeight}
            x={ovX}
            y={ovY}
            setEnabled={setOvEnabled}
            setMode={setOvMode}
            setText={setOvText}
            setImgId={setOvImg}
            setColor={setOvColor}
            setBgColor={setOvBg}
            setFontFamily={setOvFontFamily}
            setFontSize={setOvFontSize}
            setFontWeight={setOvFontWeight}
            setX={setOvX}
            setY={setOvY}
          />
        )}

        {active === 'overlay' && (
          <PositionSelector selected={gravity} onSelect={setGravity} />
        )}
      </div>

      {/* column 3 – preview + save */}
      <div className='flex-1 flex flex-col space-y-4'>
        <LivePreview baseUrl={debouncedBaseUrl} overlay={overlayPreview} />
        <SaveButton onSave={handleSave} disabled={!publicId} />
      </div>
    </div>
  );
}
