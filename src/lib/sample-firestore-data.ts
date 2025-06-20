
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
    billingType: 'personalizado',
    customRate: 0,
    targetHours: 1,
    createdAt: new Date('2023-01-01T00:00:00Z'),
  },
  {
    id: 'project_alpha_001',
    clientId: 'client_001', // Estúdio Som & Arte
    name: 'Gravação Álbum "Harmonias Urbanas"',
    billingType: 'pacote',
    pacoteSelecionado: 'Pacote 40h',
    targetHours: 40,
    createdAt: new Date('2023-09-10T10:00:00Z'),
  },
  {
    id: 'project_beta_002',
    clientId: 'client_002', // Rádio Onda Sonora
    name: 'Produção Spots Publicitários Outubro',
    billingType: 'personalizado',
    customRate: 380, // R$380/hora
    targetHours: 8,
    createdAt: new Date('2023-09-25T11:30:00Z'),
  },
  {
    id: 'project_gamma_003',
    clientId: 'client_001', // Estúdio Som & Arte
    name: 'Mixagem EP "Noite Adentro"',
    billingType: 'pacote',
    pacoteSelecionado: 'Pacote 20h',
    targetHours: 20,
    createdAt: new Date('2023-11-05T09:00:00Z'),
  },
  {
    id: 'project_delta_004',
    clientId: 'client_003', // Produtora Visão Digital
    name: 'Trilha Sonora Documentário "Amazônia Viva"',
    billingType: 'personalizado',
    customRate: 300, // R$300/hora
    targetHours: 15,
    createdAt: new Date('2024-01-15T14:00:00Z'),
  },
  {
    id: 'project_epsilon_005',
    clientId: 'client_002', // Rádio Onda Sonora
    name: 'Locução Vinhetas Institucionais',
    billingType: 'pacote',
    pacoteSelecionado: 'Pacote 10h',
    targetHours: 10,
    createdAt: new Date('2024-02-01T16:00:00Z'),
  },
];

// Agendamentos de Amostra
// Garanta que todos os agendamentos tenham um clientId e projectId válidos
export const sampleBookings: BookingDocument[] = [
  // Bookings para project_beta_002 (total 6h de 8h) -> Em Execução
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
  // Bookings para project_gamma_003 (total 5h de 20h) -> Em Execução
  {
    id: 'booking_mx001',
    clientId: 'client_001',
    projectId: 'project_gamma_003',
    startTime: new Date('2023-11-10T13:00:00Z'),
    endTime: new Date('2023-11-10T18:00:00Z'), // 5 horas
    duration: calculateDuration(new Date('2023-11-10T13:00:00Z'), new Date('2023-11-10T18:00:00Z')),
  },
  // Bookings para project_epsilon_005 (total 10h de 10h) -> Completo
   {
    id: 'booking_lv001',
    clientId: 'client_002',
    projectId: 'project_epsilon_005',
    startTime: new Date('2024-02-05T09:00:00Z'),
    endTime: new Date('2024-02-05T13:00:00Z'), // 4 horas
    duration: 4,
  },
  {
    id: 'booking_lv002',
    clientId: 'client_002',
    projectId: 'project_epsilon_005',
    startTime: new Date('2024-02-06T10:00:00Z'),
    endTime: new Date('2024-02-06T14:00:00Z'), // 4 horas
    duration: 4,
  },
  {
    id: 'booking_lv003',
    clientId: 'client_002',
    projectId: 'project_epsilon_005',
    startTime: new Date('2024-02-06T14:00:00Z'), // contínuo com o anterior
    endTime: new Date('2024-02-06T16:00:00Z'), // 2 horas
    duration: 2,
  },
  // Outros bookings
  {
    id: 'booking_sg001',
    clientId: 'client_001',
    projectId: 'project_alpha_001',
    startTime: new Date('2023-09-12T10:00:00Z'),
    endTime: new Date('2023-09-12T15:00:00Z'), // 5 horas
    duration: 5,
  },
  {
    id: 'booking_sg002',
    clientId: 'client_001',
    projectId: 'project_alpha_001',
    startTime: new Date('2023-09-13T10:00:00Z'),
    endTime: new Date('2023-09-13T18:00:00Z'), // 8 horas
    duration: 8,
  },
  {
    id: 'booking_td001',
    clientId: 'client_003',
    projectId: 'project_delta_004',
    startTime: new Date('2024-01-20T10:00:00Z'),
    endTime: new Date('2024-01-20T14:00:00Z'), // 4 horas
    duration: 4,
  },
  {
    id: 'booking_cal001',
    clientId: 'client_001',
    projectId: 'project_general_calendar',
    startTime: new Date(new Date().setDate(new Date().getDate() + 1)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(11,0,0,0)),
    duration: 1,
  },
   {
    id: 'booking_cal002',
    clientId: 'client_002',
    projectId: 'project_general_calendar',
    startTime: new Date(new Date().setDate(new Date().getDate() + 2)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(16,0,0,0)),
    duration: 2,
  },
];
