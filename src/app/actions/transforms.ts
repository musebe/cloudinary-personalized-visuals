'use server';

import crypto from 'node:crypto';
import { write, readAll } from '@/lib/db';
import { buildTransform } from '@/lib/transform';
import { TransformRecord } from '@/lib/types';

/** same addTransform, now returns the full record */
export async function addTransform(
    prev: TransformRecord | null,
    data: FormData,
): Promise<TransformRecord> {
    const publicId = data.get('publicId') as string;
    const from = data.get('from') as string | null;
    const to = data.get('to') as string | null;
    const overlay = data.get('overlay') as string | null;
    const overlayMode = data.get('overlayMode') as 'text' | 'image';
    const x = Number(data.get('x') ?? 0);
    const y = Number(data.get('y') ?? 0);

    const transformedUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${buildTransform({
        from: from || undefined,
        to: to || undefined,
        overlay: overlay || undefined,
        overlayMode,
        x,
        y,
    })}${publicId}.png`;

    const record: TransformRecord = {
        id: crypto.randomUUID(),
        publicId,
        transformedUrl,
        from: from || undefined,
        to: to || undefined,
        overlay: overlay || undefined,
        overlayMode,
        pos: { x, y },
        createdAt: Date.now(),
    };

    await write(record);
    return record;
}

/** unchanged */
export async function getTransforms(limit = 20) {
    const all = await readAll();
    return all.slice(0, limit);
}
