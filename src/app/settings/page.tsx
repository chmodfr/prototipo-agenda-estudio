'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function SettingsPage() {
  const handleConnectGoogleCalendar = () => {
    alert('A funcionalidade de integração com o Google Calendar ainda não foi implementada.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Calendário
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary-foreground">Configurações</h2>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Integrações</CardTitle>
            <CardDescription>
              Conecte o SessionSnap a outros serviços para automatizar seu fluxo de trabalho.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center p-4 border border-border rounded-lg">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Google Calendar
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Sincronize seus agendamentos do SessionSnap com sua agenda do Google.</p>
                </div>
                <Button onClick={handleConnectGoogleCalendar} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Conectar
                </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
