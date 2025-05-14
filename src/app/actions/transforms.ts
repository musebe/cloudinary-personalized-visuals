// src/app/actions/transforms.ts
'use server';

import crypto from 'node:crypto';
import { write, readAll } from '@/lib/db';
import { buildTransform } from '@/lib/transform';
import { TransformRecord } from '@/lib/types';

/** Returns the new transform record after persisting it */
export async function addTransform(
    _prev: TransformRecord | null,
    data: FormData
): Promise<TransformRecord> {
    // ① pull form values
    const publicId = data.get('publicId') as string;
    const from = data.get('from') as string | null;
    const to = data.get('to') as string | null;
    const overlay = data.get('overlay') as string | null;
    const overlayMode = data.get('overlayMode') as 'text' | 'image';
    const x = Number(data.get('x') ?? 0);
    const y = Number(data.get('y') ?? 0);
    const textColor = (data.get('overlayColor') as string | null) ?? '000000';

    // ② build transform segment (now including textColor)
    const segment = buildTransform({
        from: from || undefined,
        to: to || undefined,
        overlay: overlay || undefined,
        overlayMode,
        x,
        y,
        textColor,
    });

    // ③ full URL
    const transformedUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${segment}${publicId}.png`;

    // ④ record
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

export async function getTransforms(limit = 20) {
    return (await readAll()).slice(0, limit);
}
