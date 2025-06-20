

export interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  clientName?: string;
  service?: string;
  title?: string; // Generic title for the booking event
  price?: number; // Added price field
}

export interface TimeSlot {
  time: Date; // Start time of the slot
  isBooked: boolean;
  isBuffer: boolean;
  bookingDetails?: Booking;
  // isSelected will be handled by an extended type in CalendarView (DisplayTimeSlot)
  // or added directly to CalendarSlotProps for simplicity if not needed broadly in calendarData structure.
}

export interface DayWithSlots {
  date: Date;
  slots: TimeSlot[]; // This will be array of DisplayTimeSlot in CalendarView's state/memo
}
