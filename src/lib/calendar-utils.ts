
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
  isSameMonth,
  isSameDay,
  startOfDay,
  endOfDay
} from 'date-fns';
import type { Booking, TimeSlot, MonthlyRecipe, ClientMonthlyMetrics, ProjectCostMetrics } from '@/types';
import type { ProjectDocument, BookingDocument, ClientDocument, PacoteType } from '@/types/firestore';

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
  const startCalDay = setHours(setMinutes(setSeconds(date, 0), 0), CALENDAR_START_HOUR);
  const endCalDay = setHours(setMinutes(setSeconds(date, 0), 0), CALENDAR_END_HOUR -1); 
  
  return eachHourOfInterval({
    start: startCalDay,
    end: endCalDay,
  });
}

export function checkSlotAvailability(
  slotTime: Date, 
  bookings: Booking[] // These are UI-facing Booking objects
): { isBooked: boolean; isBuffer: boolean; bookingDetails?: Booking } {
  const slotEndTime = addHours(slotTime, 1);

  for (const booking of bookings) {
    const bookingStartTime = new Date(booking.startTime); // Ensure Date objects
    const bookingEndTime = new Date(booking.endTime);   // Ensure Date objects

    if (
      (slotTime >= bookingStartTime && slotTime < bookingEndTime) ||
      (slotEndTime > bookingStartTime && slotEndTime <= bookingEndTime) ||
      (bookingStartTime >= slotTime && bookingEndTime <= slotEndTime)
    ) {
      return { isBooked: true, isBuffer: false, bookingDetails: booking };
    }
  }

  for (const booking of bookings) {
    const bookingStartTime = new Date(booking.startTime);
    const bookingEndTime = new Date(booking.endTime);

    let isDirectlyBooked = false;
    if (
      (slotTime >= bookingStartTime && slotTime < bookingEndTime) ||
      (slotEndTime > bookingStartTime && slotEndTime <= bookingEndTime) ||
      (bookingStartTime >= slotTime && bookingEndTime <= slotEndTime)
    ) {
      isDirectlyBooked = true;
    }
    if (isDirectlyBooked) continue; 

    const bufferBeforeStart = subHours(bookingStartTime, BUFFER_HOURS);
    const bufferAfterEnd = addHours(bookingEndTime, BUFFER_HOURS);

    if (slotTime >= bufferBeforeStart && slotTime < bookingStartTime) {
      return { isBooked: false, isBuffer: true, bookingDetails: booking };
    }
    if (slotTime >= bookingEndTime && slotTime < bufferAfterEnd) {
      return { isBooked: false, isBuffer: true, bookingDetails: booking };
    }
  }

  return { isBooked: false, isBuffer: false };
}

export function getBookingsForWeek(
  weekDates: Date[],
  allBookingDocuments: BookingDocument[],
  allClients: ClientDocument[]
): Booking[] {
  if (weekDates.length === 0) return [];

  const firstDayOfWeek = startOfDay(weekDates[0]);
  const lastDayOfWeek = endOfDay(weekDates[weekDates.length - 1]);

  return allBookingDocuments
    .filter(doc => {
      const bookingStartTime = new Date(doc.startTime);
      return bookingStartTime >= firstDayOfWeek && bookingStartTime <= lastDayOfWeek;
    })
    .map(doc => {
      const client = allClients.find(c => c.id === doc.clientId);
      return {
        id: doc.id,
        startTime: new Date(doc.startTime),
        endTime: new Date(doc.endTime),
        clientId: doc.clientId,
        clientName: client ? client.name : 'Unknown Client',
        projectId: doc.projectId,
        service: `Service for project ${doc.projectId}`, // Placeholder, can be improved
        title: `${client ? client.name : 'Unknown'} - Project ${doc.projectId.slice(-4)}`, // Placeholder
      };
    });
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
  allBookings: Booking[], // UI-facing Booking type, should now have clientId
  targetDateForMonth: Date,
  allClients: ClientDocument[] // Pass all clients to look up names
): MonthlyRecipe {
  const clientBookingsData: Record<string, { durations: number[], clientName: string }> = {};

  allBookings.forEach(booking => {
    if (isSameMonth(new Date(booking.startTime), targetDateForMonth) && booking.clientId) {
      if (!clientBookingsData[booking.clientId]) {
        const client = allClients.find(c => c.id === booking.clientId);
        clientBookingsData[booking.clientId] = {
          durations: [],
          clientName: client ? client.name : `Client ID: ${booking.clientId}` // Fallback name
        };
      }
      const duration = calculateBookingDurationInHours(booking);
      clientBookingsData[booking.clientId].durations.push(duration);
    }
  });

  const monthlyRecipe: MonthlyRecipe = {};
  for (const clientId in clientBookingsData) {
    const data = clientBookingsData[clientId];
    if (data.durations.length > 0) {
        monthlyRecipe[data.clientName] = calculateClientMonthlyInvoice(data.durations);
    } else {
        // This case should ideally not happen if clientBookingsData is populated correctly
        monthlyRecipe[data.clientName] = { totalHours: 0, pricePerHour: getTieredPricePerHour(0), totalAmount: 0 };
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
    totalHours += booking.duration; 
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
