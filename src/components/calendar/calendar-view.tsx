
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { format, addHours } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarSlot } from './calendar-slot';
import { 
  getWeekDates, 
  generateTimeSlots, 
  checkSlotAvailability, 
  getMockBookings,
  CALENDAR_START_HOUR,
  CALENDAR_END_HOUR 
} from '@/lib/calendar-utils';
import type { Booking, TimeSlot as TimeSlotType, DayWithSlots } from '@/types';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    const newWeekDates = getWeekDates(currentDate);
    setWeekDates(newWeekDates);
    setBookings(getMockBookings(newWeekDates));
  }, [currentDate]);

  const calendarData = useMemo(() => {
    return weekDates.map(date => {
      const daySlots: TimeSlotType[] = generateTimeSlots(date).map(slotTime => {
        const availability = checkSlotAvailability(slotTime, bookings);
        return {
          time: slotTime,
          isBooked: availability.isBooked,
          isBuffer: availability.isBuffer,
          bookingDetails: availability.bookingDetails,
        };
      });
      return { date, slots: daySlots };
    });
  }, [weekDates, bookings]);

  const timeLabels = useMemo(() => {
    if (calendarData.length === 0 || calendarData[0].slots.length === 0) return [];
    return calendarData[0].slots.map(slot => format(slot.time, 'HH:mm'));
  }, [calendarData]);

  const handlePrevWeek = () => {
    setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 7)));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleBookSlot = (slotTimeToBook: Date) => {
    const newBooking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substring(7)}`, // Added random string for better unique ID
      startTime: slotTimeToBook,
      endTime: addHours(slotTimeToBook, 1), // Assuming 1-hour slots for new bookings
      clientName: 'Test Client',
      service: 'Walk-in Session',
      title: 'Walk-in Session (Test)',
      price: 75, // Default price for new bookings
    };
    setBookings(prevBookings => [...prevBookings, newBooking]);
  };

  if (calendarData.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">Loading calendar...</div>;
  }

  return (
    <div id="calendar-table-export-area" className="p-4 md:p-6 bg-card rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={handlePrevWeek} aria-label="Previous week">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-primary-foreground">
            {weekDates.length > 0 ? 
             `${format(weekDates[0], 'MMM d')} - ${format(weekDates[weekDates.length - 1], 'MMM d, yyyy')}` : 
             'Loading...'}
          </h2>
          <Button variant="link" onClick={handleToday} className="text-sm text-accent p-0 h-auto">Go to Today</Button>
        </div>
        <Button variant="outline" onClick={handleNextWeek} aria-label="Next week">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-border/50">
          <thead className="bg-secondary/50">
            <tr>
              <th scope="col" className="sticky left-0 z-10 bg-secondary/50 p-3 text-xs md:text-sm font-medium text-secondary-foreground border-b border-r border-border/50 w-24">
                Time
              </th>
              {weekDates.map(date => (
                <th scope="col" key={date.toISOString()} className="p-3 text-xs md:text-sm font-medium text-secondary-foreground border-b border-r border-border/50 min-w-[100px] md:min-w-[120px]">
                  <div>{format(date, 'EEE')}</div>
                  <div className="text-xs text-muted-foreground">{format(date, 'dd/MM')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeLabels.map((timeLabel, rowIndex) => (
              <tr key={timeLabel}>
                <td className="sticky left-0 z-10 bg-card p-3 text-xs md:text-sm font-medium text-muted-foreground border-b border-r border-border/50 align-top h-16 w-24">
                  {timeLabel}
                </td>
                {calendarData.map(day => (
                  <td key={`${day.date.toISOString()}-${timeLabel}`} className="p-0 align-top h-16">
                    <CalendarSlot 
                      slot={day.slots[rowIndex]} 
                      onSlotBook={handleBookSlot} 
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
