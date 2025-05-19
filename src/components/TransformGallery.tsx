'use client';

import Comparison from './ImageComparison';
import { TransformRecord } from '@/lib/types';

/**
 * 3-up gallery with Generative Fill so every card is edge-to-edge.
 * We use 800 px width to match the card’s max-width in the layout.
 */
export default function TransformGallery({
  initial,
}: {
  initial: TransformRecord[];
}) {
  if (!initial.length) return null;

  const BASE = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

  return (
    <section className='mt-20 space-y-8'>
      <h2 className='text-center text-4xl font-script italic'>
        Transformations
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {initial.slice(0, 3).map((t) => {
          const genFill = 'c_pad,b_gen_fill,w_800,h_400';

          const beforeUrl = `${BASE}/${genFill}/${t.publicId}.png`;
          const afterUrl = t.transformedUrl.replace(
            '/upload/',
            `/upload/${genFill}/`
          );

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
