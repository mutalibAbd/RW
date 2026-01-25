import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zero-Cost Gallery | WebAR Experience',
  description: 'Explore 3D products in augmented reality. Built with Next.js and optimized for free-tier hosting.',
  keywords: ['WebAR', '3D', 'gallery', 'augmented reality', 'products'],
  authors: [{ name: 'Zero-Cost Gallery' }],
  openGraph: {
    title: 'Zero-Cost Gallery',
    description: 'Explore 3D products in augmented reality',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen antialiased">
        {/* Main Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
