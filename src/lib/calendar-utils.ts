
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
  isMonday,
  startOfMonth,
  endOfMonth,
  isSameMonth
} from 'date-fns';
import type { Booking, TimeSlot, MonthlyRecipe, ClientMonthlyMetrics, ProjectCostMetrics } from '@/types';
import type { ProjectDocument, BookingDocument, PacoteType } from '@/types/firestore';

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
  slotTime: Date, 
  bookings: Booking[]
): { isBooked: boolean; isBuffer: boolean; bookingDetails?: Booking } {
  const slotEndTime = addHours(slotTime, 1);

  for (const booking of bookings) {
    const bookingStartTime = booking.startTime;
    const bookingEndTime = booking.endTime;

    // Check if the slot is directly booked
    if (
      (slotTime >= bookingStartTime && slotTime < bookingEndTime) ||
      (slotEndTime > bookingStartTime && slotEndTime <= bookingEndTime) ||
      (bookingStartTime >= slotTime && bookingEndTime <= slotEndTime)
    ) {
      return { isBooked: true, isBuffer: false, bookingDetails: booking };
    }
  }

  // Check if the slot is a buffer for another booking
  for (const booking of bookings) {
    const bookingStartTime = booking.startTime;
    const bookingEndTime = booking.endTime;

    // Check if this booking itself is creating the conflict (already handled above)
    let isDirectlyBooked = false;
    if (
      (slotTime >= bookingStartTime && slotTime < bookingEndTime) ||
      (slotEndTime > bookingStartTime && slotEndTime <= bookingEndTime) ||
      (bookingStartTime >= slotTime && bookingEndTime <= slotEndTime)
    ) {
      isDirectlyBooked = true;
    }
    if (isDirectlyBooked) continue; // Skip buffer check if it's the booking itself


    const bufferBeforeStart = subHours(bookingStartTime, BUFFER_HOURS);
    const bufferAfterEnd = addHours(bookingEndTime, BUFFER_HOURS);

    // Is the slot within the buffer period before the booking?
    if (slotTime >= bufferBeforeStart && slotTime < bookingStartTime) {
      return { isBooked: false, isBuffer: true, bookingDetails: booking };
    }
    // Is the slot within the buffer period after the booking?
    if (slotTime >= bookingEndTime && slotTime < bufferAfterEnd) {
      return { isBooked: false, isBuffer: true, bookingDetails: booking };
    }
  }

  return { isBooked: false, isBuffer: false };
}

export function getMockBookings(weekDates: Date[]): Booking[] {
  const bookings: Booking[] = [];
  if (weekDates.length === 0) return bookings;

  const monday = weekDates[0];
  const tuesday = weekDates[1];
  const thursday = weekDates[3];

  bookings.push({
    id: '1',
    startTime: setHours(setMinutes(monday,0), 10), 
    endTime: setHours(setMinutes(monday,0), 11),   
    clientName: 'Alice Wonderland',
    service: 'Vocal Recording',
    title: 'Alice - Vocals',
  });
  bookings.push({
    id: '2',
    startTime: setHours(setMinutes(tuesday,0), 14), 
    endTime: setHours(setMinutes(tuesday,0), 16),   
    clientName: 'Bob The Builder',
    service: 'Mixing Session',
    title: 'Bob - Mix',
  });
   bookings.push({
    id: '3',
    startTime: setHours(setMinutes(thursday,0), 17), 
    endTime: setHours(setMinutes(thursday,0), 18),   
    clientName: 'Charlie Chaplin',
    service: 'Podcast Production',
    title: 'Charlie - Podcast',
  });
   bookings.push({
    id: '4',
    startTime: setHours(setMinutes(thursday,0), 9), 
    endTime: setHours(setMinutes(thursday,0), 11),   
    clientName: 'Diana Prince',
    service: 'Mastering',
    title: 'Diana - Master',
  });
  bookings.push({ 
    id: '5',
    startTime: setHours(setMinutes(tuesday,0), 10), 
    endTime: setHours(setMinutes(tuesday,0), 12),   
    clientName: 'Alice Wonderland',
    service: 'ADR Session',
    title: 'Alice - ADR',
  });

  return bookings;
}

export function calculateBookingDurationInHours(booking: Booking | BookingDocument): number {
  if (!booking.startTime || !booking.endTime) return 0;
  const durationMillis = new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime();
  return durationMillis / (1000 * 60 * 60);
}

function getTieredPricePerHour(totalHours: number): number {
  if (totalHours >= 40) return 160;
  if (totalHours >= 20) return 230; 
  if (totalHours >= 10) return 260; 
  return 350; 
}

export function calculateClientMonthlyInvoice(bookingDurations: number[]): ClientMonthlyMetrics {
  const totalHours = bookingDurations.reduce((sum, duration) => sum + duration, 0);
  const pricePerHour = getTieredPricePerHour(totalHours);
  const totalAmount = totalHours * pricePerHour;
  return { totalHours, pricePerHour, totalAmount };
}

export function calculateMonthlyClientMetrics(
  bookings: Booking[], // Uses the simplified Booking type for UI display needs
  targetDateForMonth: Date
): MonthlyRecipe {
  const clientBookingsForMonth: Record<string, number[]> = {};

  bookings.forEach(booking => {
    if (isSameMonth(booking.startTime, targetDateForMonth) && booking.clientName) {
      if (!clientBookingsForMonth[booking.clientName]) {
        clientBookingsForMonth[booking.clientName] = [];
      }
      const duration = calculateBookingDurationInHours(booking);
      clientBookingsForMonth[booking.clientName].push(duration);
    }
  });

  const monthlyRecipe: MonthlyRecipe = {};
  for (const clientName in clientBookingsForMonth) {
    const durations = clientBookingsForMonth[clientName];
    if (durations && durations.length > 0) {
        monthlyRecipe[clientName] = calculateClientMonthlyInvoice(durations);
    } else {
        monthlyRecipe[clientName] = { totalHours: 0, pricePerHour: getTieredPricePerHour(0), totalAmount: 0 };
    }
  }
  return monthlyRecipe;
}

export function calculateProjectCost(
  projectId: string,
  allBookings: BookingDocument[],
  allProjects: ProjectDocument[]
): ProjectCostMetrics | null {
  const project = allProjects.find(p => p.id === projectId);

  if (!project) {
    console.error(`Project with ID ${projectId} not found.`);
    return null;
  }

  const projectBookings = allBookings.filter(b => b.projectId === projectId);
  
  let totalHours = 0;
  for (const booking of projectBookings) {
    totalHours += booking.duration; // Using pre-calculated duration from BookingDocument
  }

  let pricePerHour: number;

  if (project.billingType === 'personalizado') {
    if (typeof project.customRate !== 'number') {
      console.error(`Project ${projectId} has billingType "personalizado" but customRate is missing or invalid.`);
      return null;
    }
    pricePerHour = project.customRate;
  } else if (project.billingType === 'pacote') {
    if (!project.pacoteSelecionado) {
      console.error(`Project ${projectId} has billingType "pacote" but pacoteSelecionado is missing.`);
      return null;
    }
    switch (project.pacoteSelecionado) {
      case 'Avulso':
        pricePerHour = 350;
        break;
      case 'Pacote 10h':
        pricePerHour = 260;
        break;
      case 'Pacote 20h':
        pricePerHour = 230;
        break;
      case 'Pacote 40h':
        pricePerHour = 160;
        break;
      default:
        console.error(`Project ${projectId} has unknown pacoteSelecionado: ${project.pacoteSelecionado}`);
        return null;
    }
  } else {
    console.error(`Project ${projectId} has an unknown billingType: ${project.billingType}`);
    return null;
  }

  const totalAmount = totalHours * pricePerHour;

  return {
    totalHours,
    pricePerHour,
    totalAmount,
  };
}
