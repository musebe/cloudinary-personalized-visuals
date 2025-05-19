// src/components/TransformGallery.tsx
'use client';

import Comparison from './ImageComparison';
import { TransformRecord } from '@/lib/types';

export default function TransformGallery({
  initial,
}: {
  initial: TransformRecord[];
}) {
  if (!initial.length) return null;

  const BASE = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const genFill = 'c_pad,b_gen_fill,w_800,h_400';

  return (
    <section className='mt-20 space-y-8'>
      <h2 className='text-center text-4xl'>✨ Transformations</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {initial.slice(0, 3).map((t) => {
          // BEFORE: pad + gen-fill on the original
          const beforeUrl = `${BASE}/${genFill}/${t.publicId}.png`;

          // AFTER: inject genFill right after /upload/, preserve ?v=
          const [path, qs] = t.transformedUrl.split('?');
          const injected = path.replace('/upload/', `/upload/${genFill}/`);
          const afterUrl = qs ? `${injected}?${qs}` : injected;

          return (
            <div
              key={t.id}
              className='bg-white rounded-lg shadow-md overflow-hidden'
            >
              <Comparison before={beforeUrl} after={afterUrl} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
