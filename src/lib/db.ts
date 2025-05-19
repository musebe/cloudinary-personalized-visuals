//src/lib/db.ts

import fs from 'node:fs/promises';
import path from 'node:path';
import { TransformRecord } from './types';

const DB_PATH = path.join(process.cwd(), 'transforms.json');

/** Read all saved transforms (most-recent first). */
export async function readAll(): Promise<TransformRecord[]> {
    try {
        return JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
    } catch {
        return [];
    }
}

/** Append a new record to the JSON file. */
export async function write(record: TransformRecord) {
    const data = await readAll();
    data.unshift(record);
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}
