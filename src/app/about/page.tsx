'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const FEATURES = [
  {
    title: 'Generative Replace',
    description:
      'Swap objects in images using natural language — replace a chair with a sofa instantly with Cloudinary AI.',
  },
  {
    title: 'Dynamic Overlays',
    description:
      'Add promo badges, text, or custom visuals over product images and drag to position them freely.',
  },
  {
    title: 'Live Image Comparison',
    description:
      'See original vs. transformed visuals side-by-side with a smooth slider using motion primitives.',
  },
  {
    title: 'Built on Next.js 15',
    description:
      'Enjoy instant loading, optimized assets, and a great developer experience with App Router and Server Actions.',
  },
  {
    title: 'No Backend Needed',
    description:
      'All transformations happen in the cloud — no database or backend setup required. Just upload and go.',
  },
  {
    title: 'Ready for Marketers',
    description:
      'Designed for fast marketing iteration. Preview visuals in seconds without involving a designer.',
  },
];

export default function AboutPage() {
  return (
    <main className='container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20'>
      {/* Hero */}
      <section className='flex flex-col items-center text-center space-y-6 px-2'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 12,
            delay: 0.2,
          }}
          whileHover={{ scale: 1.1 }}
          className='text-6xl'
        >
          🛍️
        </motion.div>
        <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight max-w-3xl'>
          About Personalize Visuals
        </h1>
        <p className='text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed'>
          Personalize product imagery for your store or marketing campaigns in
          seconds. Use Cloudinary AI to swap items, apply dynamic overlays, and
          compare before/after visuals effortlessly.
        </p>
        <Link href='/' className='inline-block'>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size='lg'>Try the Demo</Button>
          </motion.div>
        </Link>
        <div className='w-full max-w-3xl overflow-hidden rounded-2xl shadow-lg mt-8'>
          <Image
            src='/preview.png'
            alt='Personalize Visuals Demo'
            width={1200}
            height={600}
            priority
            className='object-cover w-full'
          />
        </div>
      </section>

      {/* Features */}
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2'>
        {FEATURES.map((feat, idx) => (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Card className='h-full hover:shadow-lg transition-shadow'>
              <CardHeader>
                <CardTitle className='text-lg sm:text-xl'>
                  {feat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='text-sm sm:text-base'>
                  {feat.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Tech Stack */}
      <section className='space-y-4 px-2 text-center'>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='text-2xl sm:text-3xl font-bold'
        >
          Built With
        </motion.h2>
        <div className='flex flex-wrap gap-3 justify-center'>
          <Badge variant='outline'>Next.js 15</Badge>
          <Badge variant='outline'>React 19</Badge>
          <Badge variant='outline'>Tailwind CSS 4</Badge>
          <Badge variant='outline'>shadcn/ui</Badge>
          <Badge variant='outline'>Motion.dev</Badge>
          <Badge variant='outline'>Cloudinary AI</Badge>
        </div>
      </section>
    </main>
  );
}
