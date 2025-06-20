
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { suggestShareMessage, type SuggestShareMessageInput } from '@/ai/flows/suggest-share-message';
import { Copy, Share2, Send, MessageSquare } from 'lucide-react';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studioName: string;
  calendarLink: string;
}

export function ShareDialog({ open, onOpenChange, studioName: initialStudioName, calendarLink: initialCalendarLink }: ShareDialogProps) {
  const [studioName, setStudioName] = useState(initialStudioName);
  const [calendarLink, setCalendarLink] = useState(initialCalendarLink);
  const [clientName, setClientName] = useState('');
  const [pastBookingData, setPastBookingData] = useState('');
  const [suggestedMessage, setSuggestedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateMessage = async () => {
    if (!studioName || !calendarLink) {
      toast({
        title: 'Informação Faltando',
        description: 'Nome do Estúdio e Link do Calendário são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSuggestedMessage('');
    try {
      const input: SuggestShareMessageInput = { studioName, calendarLink };
      if (clientName) input.clientName = clientName;
      if (pastBookingData) input.pastBookingData = pastBookingData;
      
      const result = await suggestShareMessage(input);
      setSuggestedMessage(result.message);
    } catch (error) {
      console.error('Error generating message:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar a mensagem. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (suggestedMessage) {
      navigator.clipboard.writeText(suggestedMessage);
      toast({ title: 'Copiado!', description: 'Mensagem copiada para a área de transferência.' });
    }
  };

  const handleShareViaWhatsApp = () => {
    if (suggestedMessage) {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(suggestedMessage)}`;
      window.open(whatsappUrl, '_blank');
    } else {
       toast({ title: 'Nenhuma mensagem', description: 'Gere uma mensagem primeiro.', variant: 'destructive' });
    }
  };

  const handleShareViaEmail = () => {
     if (suggestedMessage) {
      const emailUrl = `mailto:?subject=Disponibilidade do Estúdio - ${studioName}&body=${encodeURIComponent(suggestedMessage)}`;
      window.open(emailUrl, '_blank');
    } else {
       toast({ title: 'Nenhuma mensagem', description: 'Gere uma mensagem primeiro.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Share2 className="h-6 w-6 text-primary" />
            Compartilhar Disponibilidade
          </DialogTitle>
          <DialogDescription>
            Gere uma mensagem personalizada para compartilhar a disponibilidade do seu estúdio.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="studioNameDialog">Nome do Estúdio</Label>
            <Input id="studioNameDialog" value={studioName} onChange={(e) => setStudioName(e.target.value)} className="bg-input"/>
          </div>
          <div>
            <Label htmlFor="calendarLinkDialog">Link do Calendário</Label>
            <Input id="calendarLinkDialog" value={calendarLink} onChange={(e) => setCalendarLink(e.target.value)} className="bg-input"/>
          </div>
          <div>
            <Label htmlFor="clientNameDialog">Nome do Cliente (Opcional)</Label>
            <Input id="clientNameDialog" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="ex: João Silva" className="bg-input"/>
          </div>
          <div>
            <Label htmlFor="pastBookingDataDialog">Informações de Agendamentos Anteriores (Opcional para IA)</Label>
            <Textarea 
              id="pastBookingDataDialog" 
              value={pastBookingData} 
              onChange={(e) => setPastBookingData(e.target.value)} 
              placeholder="ex: Agendou sessões de voz duas vezes no mês passado" 
              className="bg-input"
            />
          </div>
        </div>

        <Button onClick={handleGenerateMessage} disabled={isLoading || !studioName || !calendarLink} className="w-full bg-primary hover:bg-primary/90">
          <MessageSquare className="mr-2 h-4 w-4" />
          {isLoading ? 'Gerando...' : 'Gerar Mensagem Inteligente'}
        </Button>

        {suggestedMessage && (
          <div className="mt-4 p-3 bg-muted rounded-md space-y-2">
            <Label>Mensagem Sugerida:</Label>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestedMessage}</p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                <Copy className="mr-2 h-4 w-4" /> Copiar
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareViaWhatsApp} className="bg-green-500 hover:bg-green-600 text-white">
                <Send className="mr-2 h-4 w-4" /> WhatsApp
              </Button>
               <Button variant="outline" size="sm" onClick={handleShareViaEmail}>
                <Send className="mr-2 h-4 w-4" /> Email
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-start mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
