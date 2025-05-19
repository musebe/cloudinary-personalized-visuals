// src/app/actions/transforms.ts

'use server';

import crypto from 'node:crypto';
import { write, readAll } from '@/lib/db';
import { buildTransform } from '@/lib/transform';
import { TransformRecord } from '@/lib/types';

export async function addTransform(
    _prev: TransformRecord | null,
    data: FormData
): Promise<TransformRecord> {
    /* ── basic fields ────────────────────────────────────────────────── */
    const publicId = data.get('publicId') as string;
    const from = (data.get('from') as string) || undefined;
    const to = (data.get('to') as string) || undefined;
    const version = Number(data.get('version') ?? 0);

    /* ── overlay + style ─────────────────────────────────────────────── */
    const overlay = (data.get('overlay') as string) || undefined;
    const overlayMode =
        (data.get('overlayMode') as string) === 'image' ? 'image' : 'text';

    const gravity = (data.get('gravity') as string) ?? 'north_west';
    const x = Number(data.get('x') ?? 0);
    const y = Number(data.get('y') ?? 0);

    const textColor = (data.get('overlayColor') as string) ?? '000000';
    const bgColor = (data.get('overlayBg') as string) || undefined;

    const fontFamily = (data.get('fontFamily') as string) ?? 'Arial';
    const fontSize = Number(data.get('fontSize') ?? 40);
    const fontWeight =
        (data.get('fontWeight') as string) === 'normal' ? 'normal' : 'bold';

    /* ── build Cloudinary transformation segment ────────────────────── */
    const segment = buildTransform({
        from,
        to,
        overlay,
        overlayMode,
        gravity,
        x,
        y,
        textColor,
        bgColor,
        fontFamily,
        fontSize,
        fontWeight,
    });

    /* ── final URL; append `?v=` so it matches the preview exactly ───── */
    const transformedUrl =
        `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}` +
        `/image/upload/${segment}${publicId}.png` +
        (version ? `?v=${version}` : '');

    /* ── persist & return ───────────────────────────────────────────── */
    const record: TransformRecord = {
        id: crypto.randomUUID(),
        publicId,
        transformedUrl,
        from,
        to,
        overlay,
        overlayMode,
        pos: { x, y },
        createdAt: Date.now(),
    };

    await write(record);
    return record;
}

export async function getTransforms(limit = 20) {
    return (await readAll()).slice(0, limit);
}
