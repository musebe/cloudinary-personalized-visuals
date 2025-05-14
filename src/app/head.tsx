// src/app/head.tsx
import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personalize E-commerce & Marketing Visuals',
  description:
    'Use Cloudinary Generative Replace and Overlays to customize product imagery with Next.js, Shadcn, and Motion.',
};

export default function Head() {
  return (
    <>
      {/* Load the Cloudinary Upload Widget before any client code runs */}
      <Script
        src='https://upload-widget.cloudinary.com/global/all.js'
        strategy='beforeInteractive'
        async
      />
    </>
  );
}
