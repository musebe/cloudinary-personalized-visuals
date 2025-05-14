import fs from 'node:fs/promises';
import path from 'node:path';

const DB = path.join(process.cwd(), 'transforms.json');

export async function allTransforms() {
    try { return JSON.parse(await fs.readFile(DB, 'utf-8')); }
    catch { return []; }
}

export async function saveTransform(record: unknown) {
    const list = await allTransforms();
    list.unshift(record);
    await fs.writeFile(DB, JSON.stringify(list, null, 2));
}
