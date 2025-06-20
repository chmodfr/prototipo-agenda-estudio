
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// Import sample data directly
import { sampleClients, sampleProjects, sampleBookings } from '@/lib/sample-firestore-data';
import type { ClientDocument, ProjectDocument, BookingDocument } from '@/types/firestore';
import { Pencil, PlusCircle, Trash2, ArrowLeft } from 'lucide-react';

export default function ManageProjectsClientsPage() {
  // Use sample data directly
  const clients: ClientDocument[] = sampleClients;
  const projects: ProjectDocument[] = sampleProjects;
  const bookings: BookingDocument[] = sampleBookings;

  const handleEditClient = (clientId: string) => {
    alert(`A funcionalidade de edição para o cliente ID: ${clientId} ainda não foi implementada.`);
  };

  const handleAddProject = (clientId: string) => {
    alert(`A funcionalidade de adicionar projeto para o cliente ID: ${clientId} ainda não foi implementada.`);
  };

  const handleEditProject = (projectId: string) => {
    alert(`A funcionalidade de edição para o projeto ID: ${projectId} ainda não foi implementada.`);
  };

  const handleDeleteClient = (clientId: string) => {
    alert(`A funcionalidade de exclusão para o cliente ID: ${clientId} ainda não foi implementada.`);
  };

  const handleDeleteProject = (projectId: string) => {
    alert(`A funcionalidade de exclusão para o projeto ID: ${projectId} ainda não foi implementada.`);
  };


  return (
    <Suspense fallback={<div className="p-8">Carregando página de gerenciamento...</div>}>
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
            <h2 className="text-3xl font-bold text-primary-foreground">Gerenciar Clientes e Projetos</h2>
            <Button onClick={() => alert('A funcionalidade de adicionar novo cliente ainda não foi implementada.')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Novo Cliente
            </Button>
          </div>

          {clients.filter(c => c.id !== 'client_internal_000').length === 0 && <p className="text-muted-foreground">Nenhum cliente encontrado. Comece adicionando um!</p>}

          {clients.filter(c => c.id !== 'client_internal_000').map(client => ( // Exclude internal client from display
            <Card key={client.id} className="mb-8 shadow-lg">
              <CardHeader className="bg-card/50 rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-primary">{client.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{client.phone}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEditClient(client.id)} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <Pencil className="mr-1 h-4 w-4" /> Editar Cliente
                    </Button>
                     <Button onClick={() => handleDeleteClient(client.id)} variant="destructive" size="sm">
                      <Trash2 className="mr-1 h-4 w-4" /> Excluir Cliente
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-primary-foreground">Projetos</h3>
                  <Button onClick={() => handleAddProject(client.id)} variant="default" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Projeto para {client.name.split(' ')[0]}
                  </Button>
                </div>

                {projects.filter(p => p.clientId === client.id && p.id !== 'project_general_calendar').length === 0 && ( // Exclude general project
                  <p className="text-muted-foreground">Nenhum projeto para este cliente ainda.</p>
                )}

                {projects
                  .filter(p => p.clientId === client.id && p.id !== 'project_general_calendar') // Exclude general project
                  .map(project => (
                    <Accordion type="single" collapsible className="w-full mb-4 border border-border rounded-md" key={project.id}>
                      <AccordionItem value={project.id} className="border-b-0">
                        <AccordionTrigger className="hover:no-underline bg-secondary/30 hover:bg-secondary/50 px-4 py-3 rounded-t-md">
                          <div className="flex justify-between w-full items-center">
                            <span className="font-medium text-lg text-primary-foreground">{project.name}</span>
                            <span className="text-xs text-muted-foreground pr-2">
                              Criado: {format(new Date(project.createdAt), 'd MMM, yyyy', { locale: ptBR })}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4 bg-card rounded-b-md">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                                <p className="text-sm"><strong className="text-muted-foreground">Tipo de Cobrança:</strong> <span className="font-medium">{project.billingType}</span></p>
                                {project.billingType === 'pacote' && project.pacoteSelecionado && (
                                <p className="text-sm"><strong className="text-muted-foreground">Pacote:</strong> <span className="font-medium">{project.pacoteSelecionado}</span></p>
                                )}
                                {project.billingType === 'personalizado' && typeof project.customRate === 'number' && (
                                <p className="text-sm"><strong className="text-muted-foreground">Valor Personalizado:</strong> <span className="font-medium">R${project.customRate.toFixed(2)}/hora</span></p>
                                )}
                            </div>
                            <div className="flex md:justify-end items-start gap-2">
                                <Button onClick={() => handleEditProject(project.id)} variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                                <Pencil className="mr-1 h-4 w-4" /> Editar Projeto
                                </Button>
                                <Button onClick={() => handleDeleteProject(project.id)} variant="destructive" size="sm" className="bg-destructive/80 hover:bg-destructive">
                                <Trash2 className="mr-1 h-4 w-4" /> Excluir Projeto
                                </Button>
                            </div>
                          </div>
                          
                          <h4 className="text-md font-semibold mt-6 mb-2 text-primary-foreground">Agendamentos para este projeto:</h4>
                          {bookings.filter(b => b.projectId === project.id).length > 0 ? (
                            <div className="overflow-x-auto rounded-md border border-border">
                              <Table>
                                <TableHeader className="bg-muted/30">
                                  <TableRow>
                                    <TableHead className="text-foreground">Horário de Início</TableHead>
                                    <TableHead className="text-foreground">Horário de Fim</TableHead>
                                    <TableHead className="text-foreground text-right">Duração (hrs)</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {bookings
                                    .filter(b => b.projectId === project.id)
                                    .sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                    .map(booking => (
                                      <TableRow key={booking.id} className="hover:bg-muted/10">
                                        <TableCell>{format(new Date(booking.startTime), 'd MMM, yyyy HH:mm', { locale: ptBR })}</TableCell>
                                        <TableCell>{format(new Date(booking.endTime), 'd MMM, yyyy HH:mm', { locale: ptBR })}</TableCell>
                                        <TableCell className="text-right">{booking.duration.toFixed(2)}</TableCell>
                                      </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">Nenhum agendamento para este projeto ainda.</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                ))}
              </CardContent>
            </Card>
          ))}
        </main>
      </div>
    </Suspense>
  );
}
