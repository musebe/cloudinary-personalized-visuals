// src/app/layout.tsx

import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import type { ReactNode } from 'react';


const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cloudinary AI Video Preview',
  description:
    'Generate automatic video previews with Cloudinary AI in a Next.js 15 app.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang='en'
      className={`${spaceGrotesk.className} ${jetbrainsMono.className}`}
    >
      <body className='antialiased flex flex-col min-h-screen'>
        <Navbar />
        <main className='flex-grow pt-16 px-4 sm:px-6 lg:px-8'>{children}</main>
        <Footer />
        <Toaster position='bottom-right' />
      </body>
    </html>
  );
}
