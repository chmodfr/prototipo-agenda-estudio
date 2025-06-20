
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { format } from 'date-fns';
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
import { sampleClients, sampleProjects, sampleBookings } from '@/lib/sample-firestore-data';
import type { ClientDocument, ProjectDocument, BookingDocument } from '@/types/firestore';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';

export default function ManageProjectsClientsPage() {
  // For now, we'll use the sample data directly.
  // In a real app, this would come from Firestore.
  const clients: ClientDocument[] = sampleClients;
  const projects: ProjectDocument[] = sampleProjects;
  const bookings: BookingDocument[] = sampleBookings;

  const handleEditClient = (clientId: string) => {
    alert(`Edit functionality for client ID: ${clientId} is not yet implemented.`);
  };

  const handleAddProject = (clientId: string) => {
    alert(`Add project functionality for client ID: ${clientId} is not yet implemented.`);
  };

  const handleEditProject = (projectId: string) => {
    alert(`Edit functionality for project ID: ${projectId} is not yet implemented.`);
  };

  const handleDeleteClient = (clientId: string) => {
    alert(`Delete functionality for client ID: ${clientId} is not yet implemented.`);
  };

  const handleDeleteProject = (projectId: string) => {
    alert(`Delete functionality for project ID: ${projectId} is not yet implemented.`);
  };


  return (
    <Suspense fallback={<div className="p-8">Loading management page...</div>}>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-primary-foreground">Manage Clients & Projects</h2>
            <Button onClick={() => alert('Add new client functionality not yet implemented.')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Client
            </Button>
          </div>

          {clients.length === 0 && <p className="text-muted-foreground">No clients found. Start by adding one!</p>}

          {clients.map(client => (
            <Card key={client.id} className="mb-8 shadow-lg">
              <CardHeader className="bg-card/50 rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-primary">{client.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{client.phone}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEditClient(client.id)} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <Pencil className="mr-1 h-4 w-4" /> Edit Client
                    </Button>
                     <Button onClick={() => handleDeleteClient(client.id)} variant="destructive" size="sm">
                      <Trash2 className="mr-1 h-4 w-4" /> Delete Client
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-primary-foreground">Projects</h3>
                  <Button onClick={() => handleAddProject(client.id)} variant="default" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Project for {client.name.split(' ')[0]}
                  </Button>
                </div>

                {projects.filter(p => p.clientId === client.id).length === 0 && (
                  <p className="text-muted-foreground">No projects for this client yet.</p>
                )}

                {projects
                  .filter(p => p.clientId === client.id)
                  .map(project => (
                    <Accordion type="single" collapsible className="w-full mb-4 border border-border rounded-md" key={project.id}>
                      <AccordionItem value={project.id} className="border-b-0">
                        <AccordionTrigger className="hover:no-underline bg-secondary/30 hover:bg-secondary/50 px-4 py-3 rounded-t-md">
                          <div className="flex justify-between w-full items-center">
                            <span className="font-medium text-lg text-primary-foreground">{project.name}</span>
                            <span className="text-xs text-muted-foreground pr-2">
                              Created: {format(new Date(project.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4 bg-card rounded-b-md">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                                <p className="text-sm"><strong className="text-muted-foreground">Billing Type:</strong> <span className="font-medium">{project.billingType}</span></p>
                                {project.billingType === 'pacote' && project.pacoteSelecionado && (
                                <p className="text-sm"><strong className="text-muted-foreground">Package:</strong> <span className="font-medium">{project.pacoteSelecionado}</span></p>
                                )}
                                {project.billingType === 'personalizado' && typeof project.customRate === 'number' && (
                                <p className="text-sm"><strong className="text-muted-foreground">Custom Rate:</strong> <span className="font-medium">R${project.customRate.toFixed(2)}/hr</span></p>
                                )}
                            </div>
                            <div className="flex md:justify-end items-start gap-2">
                                <Button onClick={() => handleEditProject(project.id)} variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                                <Pencil className="mr-1 h-4 w-4" /> Edit Project
                                </Button>
                                <Button onClick={() => handleDeleteProject(project.id)} variant="destructive" size="sm" className="bg-destructive/80 hover:bg-destructive">
                                <Trash2 className="mr-1 h-4 w-4" /> Delete Project
                                </Button>
                            </div>
                          </div>
                          
                          <h4 className="text-md font-semibold mt-6 mb-2 text-primary-foreground">Bookings for this project:</h4>
                          {bookings.filter(b => b.projectId === project.id).length > 0 ? (
                            <div className="overflow-x-auto rounded-md border border-border">
                              <Table>
                                <TableHeader className="bg-muted/30">
                                  <TableRow>
                                    <TableHead className="text-foreground">Start Time</TableHead>
                                    <TableHead className="text-foreground">End Time</TableHead>
                                    <TableHead className="text-foreground text-right">Duration (hrs)</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {bookings
                                    .filter(b => b.projectId === project.id)
                                    .sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                    .map(booking => (
                                      <TableRow key={booking.id} className="hover:bg-muted/10">
                                        <TableCell>{format(new Date(booking.startTime), 'MMM d, yyyy HH:mm')}</TableCell>
                                        <TableCell>{format(new Date(booking.endTime), 'MMM d, yyyy HH:mm')}</TableCell>
                                        <TableCell className="text-right">{booking.duration.toFixed(2)}</TableCell>
                                      </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No bookings for this project yet.</p>
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
