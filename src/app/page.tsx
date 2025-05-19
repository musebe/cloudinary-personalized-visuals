// src/app/page.tsx

import Uploader from '@/components/Uploader';
import TransformGallery from '@/components/TransformGallery';
import { readAll } from '@/lib/db';
import { TransformRecord } from '@/lib/types';

export default async function Home() {
  const all: TransformRecord[] = await readAll();

  return (
    <main className='container mx-auto px-4 sm:px-8 py-20 space-y-20'>
      {/* Hero */}
      <section className='flex flex-col items-center text-center gap-6'>
        <h1 className='text-4xl sm:text-5xl font-bold tracking-tight'>
          Personalize E-commerce & Marketing Visuals
        </h1>
        <p className='max-w-xl text-muted-foreground text-sm sm:text-base'>
          Use Cloudinary Generative Replace and Overlays with Next.js,
          shadcn/ui, and Motion.
        </p>
      </section>

      {/* Three-column Uploader */}
      <section className='w-full'>
        <Uploader />
      </section>

      {/* Recent transforms gallery */}
      <TransformGallery initial={all} />
    </main>
  );
}
