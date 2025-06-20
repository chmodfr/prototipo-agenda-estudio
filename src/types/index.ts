export interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  clientName?: string;
  service?: string;
  title?: string; // Generic title for the booking event
}

export interface TimeSlot {
  time: Date; // Start time of the slot
  isBooked: boolean;
  isBuffer: boolean;
  bookingDetails?: Booking;
}

export interface DayWithSlots {
  date: Date;
  slots: TimeSlot[];
}
