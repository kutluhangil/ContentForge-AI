import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import '../globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ContentForge — One Content, Every Platform',
    template: '%s | ContentForge',
  },
  description:
    'Transform your blog posts, YouTube videos, and podcasts into platform-ready content in seconds. Powered by GPT-4o.',
  keywords: ['content repurposing', 'AI content', 'LinkedIn', 'Twitter', 'newsletter', 'ContentForge'],
  authors: [{ name: 'ContentForge' }],
  creator: 'ContentForge',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://contentforge.app'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: 'en_US',
    siteName: 'ContentForge',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@contentforge',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as 'tr' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-full antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
