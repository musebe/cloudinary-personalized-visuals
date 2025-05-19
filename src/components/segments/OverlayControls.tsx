'use client';

import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { CldUploadWidget } from 'next-cloudinary';

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

type OverlayMode = 'text' | 'image';

export type ColorOption = { name: string; hex: string; bgClass: string };
const COLORS: ColorOption[] = [
  { name: 'Black', hex: '000000', bgClass: 'bg-black/70 text-white' },
  { name: 'White', hex: 'FFFFFF', bgClass: 'bg-white/70 text-black' },
  { name: 'Red', hex: 'FF0000', bgClass: 'bg-red-500 text-white' },
  { name: 'Blue', hex: '0000FF', bgClass: 'bg-blue-500 text-white' },
  { name: 'Green', hex: '00FF00', bgClass: 'bg-green-500 text-white' },
];

const FONTS = [
  'Arial',
  'Helvetica',
  'Georgia',
  'Times',
  'Courier',
  'Comic Sans MS',
];

interface OverlayControlsProps {
  enabled: boolean;
  mode: OverlayMode;
  text: string;
  imgId: string;
  color: ColorOption;
  bgColor: ColorOption;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  x: number;
  y: number;
  setEnabled: (v: boolean) => void;
  setMode: (m: OverlayMode) => void;
  setText: (t: string) => void;
  setImgId: (i: string) => void;
  setColor: (c: ColorOption) => void;
  setBgColor: (c: ColorOption) => void;
  setFontFamily: (f: string) => void;
  setFontSize: (n: number) => void;
  setFontWeight: (w: 'normal' | 'bold') => void;
  setX: (n: number) => void;
  setY: (n: number) => void;
}

export function OverlayControls(props: OverlayControlsProps) {
  const {
    enabled,
    mode,
    text,
    imgId,
    color,
    bgColor,
    fontFamily,
    fontSize,
    fontWeight,
    x,
    y,
    setEnabled,
    setMode,
    setText,
    setImgId,
    setColor,
    setBgColor,
    setFontFamily,
    setFontSize,
    setFontWeight,
    setX,
    setY,
  } = props;

  const buildUrl = (id: string) =>
    `https://res.cloudinary.com/${CLOUD}/image/upload/${id}.png`;

  return (
    <div className='space-y-5'>
      {/* enable switch */}
      <div className='flex items-center gap-2'>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
        <label className='text-sm'>Enable overlay</label>
      </div>

      {/* mode toggle */}
      <div className='flex gap-3'>
        {(['text', 'image'] as const).map((m) => (
          <Button
            key={m}
            size='sm'
            variant={mode === m ? 'default' : 'outline'}
            onClick={() => setMode(m)}
          >
            {m.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* TEXT overlay ------------------------------------------------------ */}
      {mode === 'text' && (
        <>
          <Input
            placeholder='e.g. CLEARANCE'
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!enabled}
          />

          {/* colour pickers */}
          <div className='flex flex-col gap-3'>
            {/* text colour */}
            <div className='space-y-1'>
              <p className='text-xs'>Text colour</p>
              <div className='flex items-center gap-3'>
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setColor(c)}
                    className={`
                      ${c.bgClass} w-6 h-6 rounded-full shadow transition
                      ${
                        c.hex === color.hex
                          ? 'ring-2 ring-offset-1 ring-zinc-900'
                          : ''
                      }
                    `}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>

            {/* background colour */}
            <div className='space-y-1'>
              <p className='text-xs'>Background colour</p>
              <div className='flex items-center gap-3'>
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setBgColor(c)}
                    className={`
                      ${c.bgClass} w-6 h-6 rounded-full shadow transition
                      ${
                        c.hex === bgColor.hex
                          ? 'ring-2 ring-offset-1 ring-zinc-900'
                          : ''
                      }
                    `}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* font controls */}
          <div className='grid grid-cols-3 gap-3'>
            <Select
              value={fontFamily}
              onValueChange={setFontFamily}
              disabled={!enabled}
            >
              <SelectTrigger>
                <SelectValue placeholder='Font' />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={fontWeight}
              onValueChange={(v) => setFontWeight(v as 'normal' | 'bold')}
              disabled={!enabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='normal'>Regular</SelectItem>
                <SelectItem value='bold'>Bold</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type='number'
              min={10}
              max={120}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              disabled={!enabled}
            />
          </div>
        </>
      )}

      {/* IMAGE overlay ----------------------------------------------------- */}
      {mode === 'image' && (
        <>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
            onSuccess={(res) => {
              if (res.info && typeof res.info !== 'string') {
                setImgId(res.info.public_id);
              }
            }}
          >
            {({ open }) => (
              <Button
                size='sm'
                onClick={() => open()}
                disabled={!enabled}
                className='w-full'
              >
                Upload overlay image
              </Button>
            )}
          </CldUploadWidget>

          {imgId && enabled && (
            <div className='mt-2 w-24 h-24 relative rounded-lg overflow-hidden ring-1 ring-inset ring-zinc-200'>
              <Image
                src={buildUrl(imgId)}
                alt='overlay'
                fill
                className='object-contain'
                unoptimized
              />
            </div>
          )}
        </>
      )}

      {/* placement sliders */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-1'>
          <label className='text-xs'>Offset X (px)</label>
          <Slider
            min={-200}
            max={200}
            step={1}
            defaultValue={[x]}
            onValueChange={([v]) => setX(v)}
          />
        </div>
        <div className='space-y-1'>
          <label className='text-xs'>Offset Y (px)</label>
          <Slider
            min={-200}
            max={200}
            step={1}
            defaultValue={[y]}
            onValueChange={([v]) => setY(v)}
          />
        </div>
      </div>
    </div>
  );
}
