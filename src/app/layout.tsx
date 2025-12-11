// src/app/layout.tsx - FIXED
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers'; // Changed to named import

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlowSync Admin',
  description: 'Admin panel for FlowSync Mobile App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}