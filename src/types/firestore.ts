
// Define as interfaces TypeScript para o modelo de dados do Firestore.
// Para interações reais com o Firestore, os campos de Data seriam tipicamente
// Timestamps do Firestore. Estas definições usam Date para simplicidade nos dados de amostra.

export interface ClientDocument {
  id: string;
  name: string; // "Razão Social" na UI
  phone: string;
  cnpj: string;
  email?: string;
  whatsapp?: string;
  observacoes?: string;
}

export type BillingType = "pacote" | "personalizado";
export type PacoteType = "Avulso" | "Pacote 10h" | "Pacote 20h" | "Pacote 40h";

export interface ProjectDocument {
  id: string;
  clientId: string; // Referência ao ID do documento da coleção /clients
  name: string;
  billingType: BillingType;
  pacoteSelecionado?: PacoteType; // Deve estar presente se o billingType for "pacote"
  customRate?: number; // Deve estar presente se o billingType for "personalizado"
  targetHours?: number; // Opcional: meta de horas para o projeto
  createdAt: Date; // No Firestore, isso será um Timestamp do servidor
}

export interface BookingDocument {
  id:string;
  clientId: string; // Referência ao ID do documento da coleção /clients
  projectId: string; // Referência ao ID do documento da coleção /projects
  startTime: Date; // No Firestore, isso será um Timestamp
  endTime: Date;   // No Firestore, isso será um Timestamp
  duration: number; // Duração em horas, calculada a partir de startTime e endTime
}
