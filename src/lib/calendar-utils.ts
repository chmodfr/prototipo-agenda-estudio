
import {
  addDays,
  startOfWeek,
  setHours,
  setMinutes,
  setSeconds,
  isWithinInterval,
  addHours,
  subHours,
  eachHourOfInterval,
  isSameHour,
  format,
  isSaturday,
  isSunday,
  nextMonday,
  isMonday
} from 'date-fns';
import type { Booking, TimeSlot } from '@/types';

const BUFFER_HOURS = 1;
export const CALENDAR_START_HOUR = 9;
export const CALENDAR_END_HOUR = 19; // Display up to 18:00-19:00 slot

export function getWeekDates(currentDate: Date = new Date()): Date[] {
  let monday = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1 for Monday
  const weekDates: Date[] = [];
  for (let i = 0; i < 6; i++) { // Monday to Saturday
    weekDates.push(addDays(monday, i));
  }
  return weekDates;
}

export function generateTimeSlots(date: Date): Date[] {
  const startOfDay = setHours(setMinutes(setSeconds(date, 0), 0), CALENDAR_START_HOUR);
  const endOfDay = setHours(setMinutes(setSeconds(date, 0), 0), CALENDAR_END_HOUR -1); // up to 18:00 start slot for 18-19
  
  return eachHourOfInterval({
    start: startOfDay,
    end: endOfDay,
  });
}

export function checkSlotAvailability(
  slotTime: Date, // Start time of the 1-hour slot
  bookings: Booking[]
): { isBooked: boolean; isBuffer: boolean; bookingDetails?: Booking } {
  const slotEndTime = addHours(slotTime, 1);

  // Phase 1: Check for direct booking
  // A slot is directly booked if its time range overlaps with any booking's time range.
  for (const booking of bookings) {
    const bookingStartTime = booking.startTime;
    const bookingEndTime = booking.endTime;

    // Direct overlap conditions:
    // 1. Slot starts during the booking.
    // 2. Slot ends during the booking.
    // 3. Booking is entirely contained within the slot.
    if (
      (slotTime >= bookingStartTime && slotTime < bookingEndTime) ||
      (slotEndTime > bookingStartTime && slotEndTime <= bookingEndTime) ||
      (bookingStartTime >= slotTime && bookingEndTime <= slotEndTime)
    ) {
      return { isBooked: true, isBuffer: false, bookingDetails: booking };
    }
  }

  // Phase 2: Check for buffer zone, only if not directly booked
  // A slot is a buffer if it's adjacent (within BUFFER_HOURS) to a booking,
  // but not overlapping the booking itself.
  for (const booking of bookings) {
    const bookingStartTime = booking.startTime;
    const bookingEndTime = booking.endTime;

    const bufferBeforeStart = subHours(bookingStartTime, BUFFER_HOURS);
    const bufferAfterEnd = addHours(bookingEndTime, BUFFER_HOURS);

    // Check if the slot falls into the buffer period BEFORE the booking
    if (slotTime >= bufferBeforeStart && slotTime < bookingStartTime) {
      return { isBooked: false, isBuffer: true, bookingDetails: booking };
    }
    // Check if the slot falls into the buffer period AFTER the booking
    if (slotTime >= bookingEndTime && slotTime < bufferAfterEnd) {
      return { isBooked: false, isBuffer: true, bookingDetails: booking };
    }
  }

  return { isBooked: false, isBuffer: false };
}

// Mock bookings for demonstration
export function getMockBookings(weekDates: Date[]): Booking[] {
  const bookings: Booking[] = [];
  if (weekDates.length === 0) return bookings;

  const monday = weekDates[0];
  const tuesday = weekDates[1];
  const thursday = weekDates[3];

  bookings.push({
    id: '1',
    startTime: setHours(setMinutes(monday,0), 10), // Monday 10:00
    endTime: setHours(setMinutes(monday,0), 11),   // Monday 11:00
    clientName: 'Alice Wonderland',
    service: 'Vocal Recording',
    title: 'Alice - Vocals',
    price: 100
  });
  bookings.push({
    id: '2',
    startTime: setHours(setMinutes(tuesday,0), 14), // Tuesday 14:00
    endTime: setHours(setMinutes(tuesday,0), 16),   // Tuesday 16:00 (2 hour session)
    clientName: 'Bob The Builder',
    service: 'Mixing Session',
    title: 'Bob - Mix',
    price: 150
  });
   bookings.push({
    id: '3',
    startTime: setHours(setMinutes(thursday,0), 17), // Thursday 17:00
    endTime: setHours(setMinutes(thursday,0), 18),   // Thursday 18:00
    clientName: 'Charlie Chaplin',
    service: 'Podcast Production',
    title: 'Charlie - Podcast',
    price: 80
  });
   bookings.push({
    id: '4',
    startTime: setHours(setMinutes(thursday,0), 9), // Thursday 9:00
    endTime: setHours(setMinutes(thursday,0), 11),   // Thursday 11:00 (2 hour session)
    clientName: 'Diana Prince',
    service: 'Mastering',
    title: 'Diana - Master',
    price: 200
  });

  return bookings;
}
