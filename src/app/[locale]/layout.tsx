import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import '../globals.css';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://contentforge.app';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const isTR = locale === 'tr';

  return {
    title: {
      default: isTR
        ? 'ContentForge — Bir İçerik, Her Platform'
        : 'ContentForge — One Content, Every Platform',
      template: '%s | ContentForge',
    },
    description: isTR
      ? 'Blog yazılarınızı, YouTube videolarınızı ve podcast\'lerinizi saniyeler içinde LinkedIn, Twitter, Newsletter ve daha fazlasına dönüştürün. GPT-4o destekli.'
      : 'Transform your blog posts, YouTube videos, and podcasts into LinkedIn posts, Twitter threads, newsletters and more in seconds. Powered by GPT-4o.',
    keywords: isTR
      ? ['içerik dönüştürme', 'yapay zeka içerik', 'LinkedIn gönderi', 'Twitter thread', 'newsletter', 'ContentForge']
      : ['content repurposing', 'AI content', 'LinkedIn post', 'Twitter thread', 'newsletter', 'ContentForge'],
    authors: [{ name: 'ContentForge' }],
    creator: 'ContentForge',
    metadataBase: new URL(APP_URL),
    alternates: {
      canonical: `${APP_URL}/${locale}`,
      languages: {
        'tr': `${APP_URL}/tr`,
        'en': `${APP_URL}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: isTR ? 'tr_TR' : 'en_US',
      alternateLocale: isTR ? 'en_US' : 'tr_TR',
      siteName: 'ContentForge',
      url: `${APP_URL}/${locale}`,
      title: isTR
        ? 'ContentForge — Bir İçerik, Her Platform'
        : 'ContentForge — One Content, Every Platform',
      description: isTR
        ? 'Blog, YouTube veya podcast\'inizi 6 farklı formata dönüştürün. GPT-4o ile güçlü.'
        : 'Repurpose your content into 6 formats instantly. Powered by GPT-4o.',
      images: [
        {
          url: `${APP_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'ContentForge',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isTR
        ? 'ContentForge — Bir İçerik, Her Platform'
        : 'ContentForge — One Content, Every Platform',
      description: isTR
        ? 'Blog, YouTube veya podcast\'inizi saniyeler içinde tüm platformlara dönüştürün.'
        : 'Transform your content into every platform format in seconds.',
      images: [`${APP_URL}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#09090b" />
      </head>
      <body className="min-h-full antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
