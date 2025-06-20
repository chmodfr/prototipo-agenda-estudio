
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
    const bookingStartTime = new Date(booking.startTime); 
    const bookingEndTime = new Date(booking.endTime);   

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
  allClients: ClientDocument[],
  allProjects: ProjectDocument[]
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
      const project = allProjects.find(p => p.id === doc.projectId);
      const clientName = client ? client.name : 'Unknown Client';
      const projectName = project ? project.name : "Unknown Project";
      // Assuming a default service or deriving from project if needed
      const service = `Session for ${projectName}`; 
      const bookingPrice = project ? calculateProjectCost([doc], [project])?.totalAmount : 0;


      return {
        id: doc.id,
        startTime: new Date(doc.startTime),
        endTime: new Date(doc.endTime),
        clientId: doc.clientId,
        clientName: clientName,
        projectId: doc.projectId,
        service: service, 
        title: `${clientName} / ${projectName} - ${service.substring(0,20)}`,
        price: bookingPrice // This will be per-booking price based on project's rate for its duration
      };
    });
}


export function calculateBookingDurationInHours(booking: Booking | BookingDocument): number {
  if (!booking.startTime || !booking.endTime) return 0;
  const durationMillis = new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime();
  return durationMillis / (1000 * 60 * 60);
}

// Tiered pricing for client monthly invoices (NOT directly for project cost)
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
  uiBookings: Booking[], 
  targetDateForMonth: Date,
  allClients: ClientDocument[]
): MonthlyRecipe {
  const clientBookingsData: Record<string, { durations: number[], clientName: string, totalDirectPrice: number }> = {};

  uiBookings.forEach(booking => {
    if (isSameMonth(new Date(booking.startTime), targetDateForMonth) && booking.clientId) {
      const client = allClients.find(c => c.id === booking.clientId);
      const clientNameForRecipe = client ? client.name : `Client ID: ${booking.clientId}`;

      if (!clientBookingsData[clientNameForRecipe]) {
        clientBookingsData[clientNameForRecipe] = {
          durations: [],
          clientName: clientNameForRecipe,
          totalDirectPrice: 0,
        };
      }
      const duration = calculateBookingDurationInHours(booking);
      clientBookingsData[clientNameForRecipe].durations.push(duration);
      // Summing up the 'price' from each UI booking, which is already calculated based on project rates
      clientBookingsData[clientNameForRecipe].totalDirectPrice += booking.price || 0; 
    }
  });

  const monthlyRecipe: MonthlyRecipe = {};
  for (const clientNameKey in clientBookingsData) {
    const data = clientBookingsData[clientNameKey];
    const totalHours = data.durations.reduce((sum, duration) => sum + duration, 0);
    
    // The pricePerHour here is an *average* if rates varied, or the consistent rate if not.
    // The totalAmount is the sum of pre-calculated booking prices.
    const effectivePricePerHour = totalHours > 0 ? data.totalDirectPrice / totalHours : 0;

    monthlyRecipe[data.clientName] = { 
        totalHours, 
        pricePerHour: effectivePricePerHour, 
        totalAmount: data.totalDirectPrice
    };
  }
  return monthlyRecipe;
}


export function calculateProjectCost(
  projectBookings: BookingDocument[], // Pass only bookings for this project
  projectDetailsArray: ProjectDocument[] // Should be an array with one project, or find it
): ProjectCostMetrics | null {

  if (!projectDetailsArray || projectDetailsArray.length === 0) {
     console.error(`Project details not provided.`);
    return null;
  }
  const project = projectDetailsArray[0]; // Assuming the correct project is passed

  if (!project) {
    console.error(`Project not found in provided details.`);
    return null;
  }
  
  let totalHours = 0;
  for (const booking of projectBookings) {
    totalHours += booking.duration; 
  }

  let pricePerHour: number;

  if (project.billingType === 'personalizado') {
    if (typeof project.customRate !== 'number') {
      console.warn(`Project ${project.id} has billingType "personalizado" but customRate is missing or invalid. Defaulting to 0.`);
      pricePerHour = 0; // Default or handle as error
    } else {
      pricePerHour = project.customRate;
    }
  } else if (project.billingType === 'pacote') {
    if (!project.pacoteSelecionado) {
      console.warn(`Project ${project.id} has billingType "pacote" but pacoteSelecionado is missing. Defaulting to Avulso rate.`);
      pricePerHour = 350; // Default to Avulso or handle as error
    } else {
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
          console.warn(`Project ${project.id} has unknown pacoteSelecionado: ${project.pacoteSelecionado}. Defaulting to Avulso rate.`);
          pricePerHour = 350; // Default or handle as error
          break;
      }
    }
  } else {
    console.error(`Project ${project.id} has an unknown billingType: ${project.billingType}`);
    return null;
  }

  const totalAmount = totalHours * pricePerHour;

  return {
    totalHours,
    pricePerHour,
    totalAmount,
  };
}
