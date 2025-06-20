
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

  for (const booking of bookings) {
    const bookingStartTime = booking.startTime;
    const bookingEndTime = booking.endTime;

    // Check for direct booking overlap
    if (
      (slotTime >= bookingStartTime && slotTime < bookingEndTime) ||
      (slotEndTime > bookingStartTime && slotEndTime <= bookingEndTime) ||
      (bookingStartTime >= slotTime && bookingEndTime <= slotEndTime)
    ) {
      return { isBooked: true, isBuffer: false, bookingDetails: booking };
    }

    // Check for buffer zone overlap
    const bufferBeforeStart = subHours(bookingStartTime, BUFFER_HOURS);
    const bufferAfterEnd = addHours(bookingEndTime, BUFFER_HOURS);

    // Is the slot within buffer before?
    if (slotTime >= bufferBeforeStart && slotTime < bookingStartTime) {
      return { isBooked: false, isBuffer: true, bookingDetails: booking };
    }
    // Is the slot within buffer after?
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
