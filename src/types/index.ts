

export interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  clientId: string; // Added
  clientName: string; 
  projectId: string; // Added
  service?: string;
  title?: string; 
}

export interface TimeSlot {
  time: Date; 
  isBooked: boolean;
  isBuffer: boolean;
  bookingDetails?: Booking;
}

export interface DayWithSlots {
  date: Date;
  slots: TimeSlot[]; 
}

export interface ClientMonthlyMetrics {
  totalHours: number;
  pricePerHour: number; 
  totalAmount: number;  
}

export type MonthlyRecipe = Record<string, ClientMonthlyMetrics>; // Key is clientName for display

export interface ProjectCostMetrics {
  totalHours: number;
  pricePerHour: number;
  totalAmount: number;
}
