import { ChakraProvider } from '@chakra-ui/react';
import type { Metadata, ResolvingMetadata } from 'next';
import { Inter } from 'next/font/google';

import { Footer } from './components/footer';
import { Header } from './components/header';
import LanguageProvider from '../../components/language-provider';
import * as m from '../../src/paraglide/messages';
import { availableLanguageTags, languageTag } from '../../src/paraglide/runtime';

import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export async function generateStaticParams() {
  return availableLanguageTags.map((lang) => ({ lang }));
}

export async function generateMetadata(
  { params }: { params: { lang: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: m.title(),
    description: m.description(),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang={languageTag()}>
        <body className={`${inter.className} dark:bg-slate-900`}>
          <ChakraProvider>
            <Header />
            {children}
            <Footer />
          </ChakraProvider>
        </body>
      </html>
    </LanguageProvider>
  );
}
