
// Defines the TypeScript interfaces for the Firestore data model.
// For actual Firestore interactions, Date fields would typically be
// Firestore Timestamps. These definitions use Date for simplicity in sample data.

export interface ClientDocument {
  id: string;
  name: string;
  phone: string;
}

export type BillingType = "pacote" | "personalizado";
export type PacoteType = "Avulso" | "Pacote 10h" | "Pacote 20h" | "Pacote 40h";

export interface ProjectDocument {
  id: string;
  clientId: string; // Reference to /clients collection document ID
  name: string;
  billingType: BillingType;
  pacoteSelecionado?: PacoteType; // Should be present if billingType is "pacote"
  customRate?: number; // Should be present if billingType is "personalizado"
  createdAt: Date; // In Firestore, this will be a server Timestamp
}

export interface BookingDocument {
  id: string;
  clientId: string; // Reference to /clients collection document ID
  projectId: string; // Reference to /projects collection document ID
  startTime: Date; // In Firestore, this will be a Timestamp
  endTime: Date;   // In Firestore, this will be a Timestamp
  duration: number; // Duration in hours, calculated from startTime and endTime
}
