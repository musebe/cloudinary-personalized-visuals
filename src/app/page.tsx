import Uploader from '@/components/Uploader';
import ImageComparisonCustom from '@/components/ImageComparison';
import TransformGallery from '@/components/TransformGallery';
import { readAll } from '@/lib/db';
import { TransformRecord } from '@/lib/types';

export default async function Home() {
  // Server-only: read transforms.json
  const all: TransformRecord[] = await readAll();
  const latest = all[0];

  return (
    <main className='container mx-auto px-4 sm:px-8 py-20 space-y-20'>
      {/* Hero / Branding */}
      <section className='flex flex-col items-center text-center gap-6'>
        <h1 className='text-4xl sm:text-5xl font-bold tracking-tight'>
          Personalize E-commerce & Marketing Visuals
        </h1>
        <p className='max-w-xl text-muted-foreground text-sm sm:text-base'>
          Use Cloudinary Generative Replace and Overlays to customize product
          imagery with Next.js, Shadcn, and Motion.
        </p>
      </section>

      {/* Uploader + Live Preview */}
      <section className='md:flex gap-10'>
        <div className='md:w-1/2'>
          <Uploader />
        </div>
        <div className='md:w-1/2 hidden md:block'>
          {latest && (
            <ImageComparisonCustom
              before={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${latest.publicId}.png`}
              after={latest.transformedUrl}
            />
          )}
        </div>
      </section>

      {/* Recent Transforms (client-only) */}
      <TransformGallery initial={all} />
    </main>
  );
}
