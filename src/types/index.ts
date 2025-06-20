

export interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  clientId: string; 
  clientName: string; 
  projectId: string; 
  projectName?: string; // Optional: for easier display if needed
  service?: string;
  title?: string; 
  price?: number; // Price for this specific booking slot/duration
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
  pricePerHour: number; // This will now be an effective/average rate if project rates varied
  totalAmount: number;  
}

export type MonthlyRecipe = Record<string, ClientMonthlyMetrics>; // Key is clientName for display

export interface ProjectCostMetrics {
  totalHours: number;
  pricePerHour: number;
  totalAmount: number;
}
