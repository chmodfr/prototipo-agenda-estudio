
import type { ClientDocument, ProjectDocument, BookingDocument, PacoteType, BillingType } from '@/types/firestore';

// Função auxiliar para calcular a duração em horas
const calculateDuration = (start: Date, end: Date): number => {
  const diffMilliseconds = end.getTime() - start.getTime();
  return parseFloat((diffMilliseconds / (1000 * 60 * 60)).toFixed(2));
};

// Clientes de Amostra
export const sampleClients: ClientDocument[] = [
  { id: 'client_001', name: 'Estúdio Som & Arte', phone: '+55 11 98888-1111' },
  { id: 'client_002', name: 'Rádio Onda Sonora', phone: '+55 21 97777-2222' },
  { id: 'client_003', name: 'Produtora Visão Digital', phone: '+55 31 96666-3333' },
  { id: 'client_internal_000', name: 'Studio Internal', phone: '+55 00 00000-0000'}
];

// Projetos de Amostra
export const sampleProjects: ProjectDocument[] = [
  {
    id: 'project_general_calendar',
    clientId: 'client_internal_000', // Vinculado ao cliente Interno do Estúdio
    name: 'General Calendar Bookings',
    billingType: 'personalizado', // Ou um pacote padrão, depende do tratamento desejado
    customRate: 0, // Este projeto pode não ter cobrança direta, ou usar um padrão
    createdAt: new Date('2023-01-01T00:00:00Z'),
  },
  {
    id: 'project_alpha_001',
    clientId: 'client_001', // Estúdio Som & Arte
    name: 'Gravação Álbum "Harmonias Urbanas"',
    billingType: 'pacote',
    pacoteSelecionado: 'Pacote 40h',
    createdAt: new Date('2023-09-10T10:00:00Z'),
  },
  {
    id: 'project_beta_002',
    clientId: 'client_002', // Rádio Onda Sonora
    name: 'Produção Spots Publicitários Outubro',
    billingType: 'personalizado',
    customRate: 380, // R$380/hora
    createdAt: new Date('2023-09-25T11:30:00Z'),
  },
  {
    id: 'project_gamma_003',
    clientId: 'client_001', // Estúdio Som & Arte
    name: 'Mixagem EP "Noite Adentro"',
    billingType: 'pacote',
    pacoteSelecionado: 'Pacote 20h',
    createdAt: new Date('2023-11-05T09:00:00Z'),
  },
  {
    id: 'project_delta_004',
    clientId: 'client_003', // Produtora Visão Digital
    name: 'Trilha Sonora Documentário "Amazônia Viva"',
    billingType: 'personalizado',
    customRate: 300, // R$300/hora
    createdAt: new Date('2024-01-15T14:00:00Z'),
  },
  {
    id: 'project_epsilon_005',
    clientId: 'client_002', // Rádio Onda Sonora
    name: 'Locução Vinhetas Institucionais',
    billingType: 'pacote',
    pacoteSelecionado: 'Pacote 10h',
    createdAt: new Date('2024-02-01T16:00:00Z'),
  },
];

// Agendamentos de Amostra
// Garanta que todos os agendamentos tenham um clientId e projectId válidos
export const sampleBookings: BookingDocument[] = [
  {
    id: 'booking_sg001',
    clientId: 'client_001',
    projectId: 'project_alpha_001',
    startTime: new Date('2023-09-12T10:00:00Z'),
    endTime: new Date('2023-09-12T15:00:00Z'), // 5 horas
    duration: calculateDuration(new Date('2023-09-12T10:00:00Z'), new Date('2023-09-12T15:00:00Z')),
  },
  {
    id: 'booking_sg002',
    clientId: 'client_001',
    projectId: 'project_alpha_001',
    startTime: new Date('2023-09-13T10:00:00Z'),
    endTime: new Date('2023-09-13T18:00:00Z'), // 8 horas
    duration: calculateDuration(new Date('2023-09-13T10:00:00Z'), new Date('2023-09-13T18:00:00Z')),
  },
  {
    id: 'booking_rs001',
    clientId: 'client_002',
    projectId: 'project_beta_002',
    startTime: new Date('2023-10-02T09:00:00Z'),
    endTime: new Date('2023-10-02T12:00:00Z'), // 3 horas
    duration: calculateDuration(new Date('2023-10-02T09:00:00Z'), new Date('2023-10-02T12:00:00Z')),
  },
  {
    id: 'booking_rs002',
    clientId: 'client_002',
    projectId: 'project_beta_002',
    startTime: new Date('2023-10-03T14:00:00Z'),
    endTime: new Date('2023-10-03T17:00:00Z'), // 3 horas
    duration: calculateDuration(new Date('2023-10-03T14:00:00Z'), new Date('2023-10-03T17:00:00Z')),
  },
  {
    id: 'booking_mx001',
    clientId: 'client_001',
    projectId: 'project_gamma_003',
    startTime: new Date('2023-11-10T13:00:00Z'),
    endTime: new Date('2023-11-10T18:00:00Z'), // 5 horas
    duration: calculateDuration(new Date('2023-11-10T13:00:00Z'), new Date('2023-11-10T18:00:00Z')),
  },
  {
    id: 'booking_td001',
    clientId: 'client_003',
    projectId: 'project_delta_004',
    startTime: new Date('2024-01-20T10:00:00Z'),
    endTime: new Date('2024-01-20T14:00:00Z'), // 4 horas
    duration: calculateDuration(new Date('2024-01-20T10:00:00Z'), new Date('2024-01-20T14:00:00Z')),
  },
  {
    id: 'booking_lv001',
    clientId: 'client_002',
    projectId: 'project_epsilon_005',
    startTime: new Date('2024-02-05T09:00:00Z'),
    endTime: new Date('2024-02-05T11:00:00Z'), // 2 horas
    duration: calculateDuration(new Date('2024-02-05T09:00:00Z'), new Date('2024-02-05T11:00:00Z')),
  },
  // Adicione alguns agendamentos para project_general_calendar para testar o carregamento inicial da página do calendário
  {
    id: 'booking_cal001',
    clientId: 'client_001', // Exemplo: Alice agenda um horário geral
    projectId: 'project_general_calendar',
    startTime: new Date(new Date().setDate(new Date().getDate() + 1)), // Amanhã 10h
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(11,0,0,0)), // Amanhã 11h
    duration: 1,
  },
   {
    id: 'booking_cal002',
    clientId: 'client_002', // Exemplo: Bob agenda um horário geral
    projectId: 'project_general_calendar',
    startTime: new Date(new Date().setDate(new Date().getDate() + 2)), // Depois de amanhã 14h
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(16,0,0,0)), // Depois de amanhã 16h
    duration: 2,
  },
];
