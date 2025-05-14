import Uploader from '@/components/Uploader';
import ImageComparison from '@/components/ImageComparison';
import TransformGallery from '@/components/TransformGallery';

export default function Home() {
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
          {/* Optional: show latest transformation result */}
          <ImageComparison />
        </div>
      </section>

      {/* Recent Transforms */}
      <TransformGallery />
    </main>
  );
}
