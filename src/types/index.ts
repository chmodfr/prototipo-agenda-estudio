

export interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  clientName: string; 
  service?: string;
  title?: string; 
  // price field is removed; pricing is now tiered based on monthly client hours or project-specific rates
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

export type MonthlyRecipe = Record<string, ClientMonthlyMetrics>;

export interface ProjectCostMetrics {
  totalHours: number;
  pricePerHour: number;
  totalAmount: number;
}
