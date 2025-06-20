import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SessionSnap',
  description: 'Calendário de Disponibilidade Semanal para Estúdios de Gravação',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark`}>
      <head />
      <body className="font-body antialiased">
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Carregando...</div>}>
          {children}
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
