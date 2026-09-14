import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Instagram SMM API Console',
  description: 'Professional direct-api SMM developer console for triggering and monitoring Instagram promotions via standard SMM API v2 endpoints.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ru" className={`${inter.variable}`}>
      <body className="font-sans antialiased text-gray-100 bg-slate-950" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

