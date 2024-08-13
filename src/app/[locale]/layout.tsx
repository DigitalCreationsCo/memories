import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AllLocales } from "@/lib/App";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export default function RootLayout( props: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {

    // Validate that the incoming `locale` parameter is valid
    if (!AllLocales.includes(props.params.locale)) notFound();

    // Using internationalization in Client Components
    const messages = useMessages();
    
  return (
    <html lang={props.params.locale}>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
          <NextIntlClientProvider
            locale={props.params.locale}
            messages={messages}
          >
           {props.children}
          </NextIntlClientProvider>
        </body>
    </html>
  );
}

// Enable edge runtime
export const runtime = 'edge';