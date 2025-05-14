'use client';

import { useOptimistic } from 'react';
import Comparison from './ImageComparison';
import { TransformRecord } from '@/lib/types';

export default function TransformGallery({
  initial,
}: {
  initial: TransformRecord[];
}) {
  // ① optimistic state – start with initial records supplied by the server
  //    (see https://react.dev/reference/react/useOptimistic)
  const [transforms] = useOptimistic<TransformRecord[], TransformRecord>(
    initial,
    (state, newRecord) => [newRecord, ...state]
  );

  // ② when the Uploader’s server action resolves, call addOptimistic(newRecord)
  //    to prepend the new record (you’ll wire that via useActionState in Uploader)

  if (!transforms.length) return null;

  return (
    <section className='mt-20 space-y-8'>
      <h2 className='text-center text-4xl font-script italic'>
        Transformations
      </h2>
      <div className='grid md:grid-cols-3 gap-6'>
        {transforms.slice(0, 3).map((t) => (
          <Comparison
            key={t.id}
            before={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${t.publicId}.png`}
            after={t.transformedUrl}
          />
        ))}
      </div>
    </section>
  );
}
