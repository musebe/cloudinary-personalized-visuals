// src/components/Uploader.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Repeat, Image as ImageIcon, RefreshCcw, Loader2 } from 'lucide-react';

import { UploadButton } from './segments/UploadButton';
import { ReplaceControls } from './segments/ReplaceControls';
import { OverlayControls, ColorOption } from './segments/OverlayControls';
import { PositionSelector, Gravity } from './PositionSelector';
import { LivePreview } from './LivePreview';
import { SaveButton } from './SaveButton';

import { buildTransform } from '@/lib/transform';
import { addTransform } from '@/app/actions/transforms';

/* debounce helper */
function useDebounced<T>(val: T, ms = 350) {
  const [d, setD] = useState(val);
  useEffect(() => {
    const id = setTimeout(() => setD(val), ms);
    return () => clearTimeout(id);
  }, [val, ms]);
  return d;
}

export default function Uploader() {
  const router = useRouter();

  /* base image + mode */
  const [publicId, setPublicId] = useState<string>('');
  const [active, setActive] = useState<'replace' | 'overlay'>('replace');

  /* generative replace */
  const [repEnabled, setRepEnabled] = useState(true);
  const [repFrom, setRepFrom] = useState('');
  const [repTo, setRepTo] = useState('');
  const fromDeb = useDebounced(repFrom);
  const toDeb = useDebounced(repTo);

  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(false);

  /* overlay & styling */
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

  /* build transform segment (no ?v here) */
  const segment = buildTransform({
    from: repEnabled && fromDeb && toDeb ? fromDeb : undefined,
    to: repEnabled && fromDeb && toDeb ? toDeb : undefined,
    overlay: ovEnabled ? ovText || ovImg : undefined,
    overlayMode: ovMode,
    gravity,
    x: ovX,
    y: ovY,
    textColor: ovColor.hex,
    bgColor: ovBg.hex,
    fontFamily: ovFontFamily,
    fontSize: ovFontSize,
    fontWeight: ovFontWeight,
  });

  /* full base URL includes ?v=version */
  const baseUrl = publicId
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}` +
      `/image/upload/${segment}${publicId}.png?v=${version}`
    : '';

  /* loading spinner while it arrives */
  useEffect(() => {
    if (!publicId) return;
    setLoading(true);
    const img = new Image();
    img.src = baseUrl;
    img.onload = () => setLoading(false);
    img.onerror = () => setLoading(false);
  }, [baseUrl, publicId]);

  /* overlay props for LivePreview */
  const overlayPreview =
    ovEnabled && publicId
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

  /* bump version to re-trigger the same path but cache-busted */
  const regenerate = () => {
    if (!repEnabled || !publicId || !fromDeb || !toDeb) return;
    setVersion((v) => v + 1);
  };

  /* save: include the very same version */
  const handleSave = async () => {
    if (!publicId) return;
    const f = new FormData();
    f.set('publicId', publicId);
    f.set('version', String(version));
    f.set('from', repEnabled ? repFrom : '');
    f.set('to', repEnabled ? repTo : '');
    f.set('overlay', ovEnabled ? (ovMode === 'text' ? ovText : ovImg) : '');
    f.set('overlayMode', ovMode);
    f.set('overlayColor', ovColor.hex);
    f.set('overlayBg', ovBg.hex);
    f.set('fontFamily', ovFontFamily);
    f.set('fontSize', String(ovFontSize));
    f.set('fontWeight', ovFontWeight);
    f.set('gravity', gravity);
    f.set('x', String(ovX));
    f.set('y', String(ovY));
    await addTransform(null, f);
    router.refresh();
  };

  return (
    <div className='flex flex-col md:flex-row gap-8 p-4'>
      {/* icon column */}
      <div className='flex-shrink-0 flex flex-col items-center space-y-4'>
        <button
          onClick={() => setActive('replace')}
          className={`flex flex-col items-center p-2 rounded ${
            active === 'replace' ? 'bg-slate-200' : 'hover:bg-slate-100'
          }`}
        >
          <Repeat className='w-6 h-6' />
          <span className='md:hidden text-[10px] mt-0.5'>🔄 Replace</span>
        </button>
        <button
          onClick={() => setActive('overlay')}
          className={`flex flex-col items-center p-2 rounded ${
            active === 'overlay' ? 'bg-slate-200' : 'hover:bg-slate-100'
          }`}
        >
          <ImageIcon className='w-6 h-6' />
          <span className='md:hidden text-[10px] mt-0.5'>🖼️ Overlay</span>
        </button>
      </div>

      {/* controls */}
      <div className='space-y-6 md:w-1/3'>
        <UploadButton onUpload={setPublicId} />

        {active === 'replace' ? (
          <>
            <ReplaceControls
              enabled={repEnabled}
              from={repFrom}
              to={repTo}
              setEnabled={setRepEnabled}
              setFrom={setRepFrom}
              setTo={setRepTo}
            />
            <button
              onClick={regenerate}
              disabled={!publicId || !repEnabled || !fromDeb || !toDeb}
              className='flex items-center gap-2 text-sm text-blue-600 hover:underline disabled:opacity-40'
            >
              <RefreshCcw className='w-4 h-4' />
              Try a new variation
            </button>
          </>
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

      {/* preview & save */}
      <div className='relative flex-1 flex flex-col space-y-4'>
        {loading && (
          <div className='absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md rounded-lg'>
            <Loader2 className='w-6 h-6 animate-spin mb-2' />
            <span className='text-sm font-medium'>Generating…</span>
          </div>
        )}
        <LivePreview baseUrl={baseUrl} overlay={overlayPreview} />
        <SaveButton onSave={handleSave} disabled={!publicId} />
      </div>
    </div>
  );
}
