

export interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  clientName: string; // Made mandatory for recipe calculation
  service?: string;
  title?: string; // Generic title for the booking event
  price?: number; 
}

export interface TimeSlot {
  time: Date; // Start time of the slot
  isBooked: boolean;
  isBuffer: boolean;
  bookingDetails?: Booking;
  // isSelected will be handled by an extended type in CalendarView (DisplayTimeSlot)
}

export interface DayWithSlots {
  date: Date;
  slots: TimeSlot[]; 
}

// For the monthly recipe display
export interface ClientMonthlyMetrics {
  totalHours: number;
  totalPrice: number;
}

export type MonthlyRecipe = Record<string, ClientMonthlyMetrics>;
