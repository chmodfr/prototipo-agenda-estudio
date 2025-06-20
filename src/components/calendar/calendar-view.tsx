
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { format, addHours } from 'date-fns';
import { ChevronLeft, ChevronRight, BookMarked } from 'lucide-react';
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
import type { Booking, TimeSlot as TimeSlotType } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface DisplayTimeSlot extends TimeSlotType {
  isSelected: boolean;
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<Date[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const newWeekDates = getWeekDates(currentDate);
    setWeekDates(newWeekDates);
    setBookings(getMockBookings(newWeekDates));
  }, [currentDate]);

  const calendarData = useMemo((): { date: Date; slots: DisplayTimeSlot[] }[] => {
    return weekDates.map(date => {
      const daySlots: DisplayTimeSlot[] = generateTimeSlots(date).map(slotTime => {
        const availability = checkSlotAvailability(slotTime, bookings);
        const isSelected = selectedSlots.some(s => s.getTime() === slotTime.getTime());
        return {
          time: slotTime,
          isBooked: availability.isBooked,
          isBuffer: availability.isBuffer,
          bookingDetails: availability.bookingDetails,
          isSelected,
        };
      });
      return { date, slots: daySlots };
    });
  }, [weekDates, bookings, selectedSlots]);

  const timeLabels = useMemo(() => {
    if (calendarData.length === 0 || calendarData[0].slots.length === 0) return [];
    return calendarData[0].slots.map(slot => format(slot.time, 'HH:mm'));
  }, [calendarData]);

  const handlePrevWeek = () => {
    setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 7)));
    setSelectedSlots([]); 
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 7)));
    setSelectedSlots([]); 
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedSlots([]); 
  };

  const handleSlotClick = (slotTime: Date) => {
    const { isBooked, isBuffer } = checkSlotAvailability(slotTime, bookings);
    
    if (isBooked || isBuffer) {
        setSelectedSlots(prevSelected => prevSelected.filter(s => s.getTime() !== slotTime.getTime()));
        return;
    }

    setSelectedSlots(prevSelected => {
      const index = prevSelected.findIndex(s => s.getTime() === slotTime.getTime());
      if (index > -1) {
        return prevSelected.filter(s => s.getTime() !== slotTime.getTime()); 
      } else {
        return [...prevSelected, slotTime]; 
      }
    });
  };

  const handleConfirmBooking = () => {
    if (selectedSlots.length === 0) {
      toast({
        title: 'No Slots Selected',
        description: 'Please select one or more available slots to book.',
        variant: 'destructive',
      });
      return;
    }

    const clientName = window.prompt("Enter client name:", "New Client");
    if (!clientName) {
      toast({ title: "Booking Cancelled", description: "Client name is required.", variant: "destructive" });
      setSelectedSlots([]); // Clear selection if booking is cancelled
      return;
    }

    const serviceDetails = window.prompt("Enter service details (e.g., Vocal Recording, Mixing):", "Session");
    if (!serviceDetails) {
      toast({ title: "Booking Cancelled", description: "Service details are required.", variant: "destructive" });
      setSelectedSlots([]); // Clear selection
      return;
    }

    const priceInput = window.prompt("Enter price for the session(s):", "50");
    let price = 0;
    if (priceInput !== null) {
        price = parseFloat(priceInput);
        if (isNaN(price)) {
            toast({ title: "Invalid Price", description: "Price was not a valid number. Defaulting to 0.", variant: "destructive" });
            price = 0;
        }
    } else { // User cancelled the price prompt
        toast({ title: "Booking Cancelled", description: "Price input was cancelled.", variant: "destructive" });
        setSelectedSlots([]); // Clear selection
        return;
    }


    const newBookings: Booking[] = selectedSlots.map(slotTimeToBook => ({
      id: `booking-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      startTime: slotTimeToBook,
      endTime: addHours(slotTimeToBook, 1), // Assuming 1-hour slots for now
      clientName: clientName,
      service: serviceDetails,
      title: `${clientName} - ${serviceDetails}`,
      price: price,
    }));

    setBookings(prevBookings => [...prevBookings, ...newBookings]);
    setSelectedSlots([]); 
    toast({
      title: 'Booking Confirmed!',
      description: `${newBookings.length} slot(s) booked for ${clientName}. Buffers will now reflect these bookings.`,
    });
  };

  if (calendarData.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">Loading calendar...</div>;
  }

  return (
    <div id="calendar-table-export-area" className="p-4 md:p-6 bg-card rounded-lg shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrevWeek} aria-label="Previous week">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" onClick={handleNextWeek} aria-label="Next week">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-primary-foreground">
            {weekDates.length > 0 ?
             `${format(weekDates[0], 'MMM d')} - ${format(weekDates[weekDates.length - 1], 'MMM d, yyyy')}` :
             'Loading...'}
          </h2>
          <Button variant="link" onClick={handleToday} className="text-sm text-accent p-0 h-auto">Go to Today</Button>
        </div>
        <Button 
          onClick={handleConfirmBooking} 
          disabled={selectedSlots.length === 0}
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[180px]"
          aria-label="Confirm booking for selected slots"
        >
          <BookMarked className="mr-2 h-4 w-4" />
          Book Selected ({selectedSlots.length})
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
                      onSlotClick={handleSlotClick}
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
