'use server';

import { saveTransform } from '@/lib/db';

export async function registerTransform(data: {
    publicId: string;
    from: string;
    to: string;
    overlay?: string;
    pos?: { x: number; y: number };
}) {
    await saveTransform({ id: crypto.randomUUID(), ...data, createdAt: Date.now() });
}
