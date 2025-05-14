'use client';

import { motion } from 'motion/react';

/* eslint-disable @next/next/no-img-element */

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className='mt-auto bg-gray-50 text-gray-600 py-6'
    >
      <div className='mx-auto max-w-7xl flex flex-col items-center gap-4 px-4 text-center'>
        {/* tagline */}
        <p className='text-sm font-medium'>
          Personalize E-commerce & Marketing Visuals — powered by Next.js,
          Cloudinary & AI overlays
        </p>

        {/* tech badges */}
        <div className='flex flex-wrap justify-center gap-3 text-xs'>
          <a
            href='https://nextjs.org/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src='https://img.shields.io/badge/Next.js-15-blue?logo=next.js'
              alt='Next.js badge'
              width={130}
              height={24}
            />
          </a>
          <a
            href='https://cloudinary.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src='https://img.shields.io/badge/Cloudinary-Generative_Replace-lightblue?logo=cloudinary'
              alt='Cloudinary badge'
              width={200}
              height={24}
            />
          </a>
          <a
            href='https://tailwindcss.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src='https://img.shields.io/badge/TailwindCSS-4.0-38BDF8?logo=tailwindcss'
              alt='Tailwind CSS badge'
              width={160}
              height={24}
            />
          </a>
          <a
            href='https://ui.shadcn.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src='https://img.shields.io/badge/shadcn.ui-Tailwind_Components-pink?logo=tailwindcss'
              alt='shadcn/ui badge'
              width={180}
              height={24}
            />
          </a>
          <a
            href='https://motion.dev/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src='https://img.shields.io/badge/Motion.dev-Animations-orange?logo=framer'
              alt='Motion.dev badge'
              width={170}
              height={24}
            />
          </a>
        </div>

        {/* credits */}
        <p className='text-xs text-gray-500'>
          Built by{' '}
          <a
            href='https://github.com/musebe'
            target='_blank'
            rel='noopener noreferrer'
            className='underline hover:text-gray-700'
          >
            Eugine Musebe
          </a>{' '}
          ·{' '}
          <a
            href='https://github.com/musebe/personalize-e-commerce-marketing-visuals'
            target='_blank'
            rel='noopener noreferrer'
            className='underline hover:text-gray-700'
          >
            View source on GitHub
          </a>
        </p>
      </div>
    </motion.footer>
  );
}

/* eslint-enable @next/next/no-img-element */
