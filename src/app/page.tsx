
'use client'; 

import React, { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { AppHeader } from '@/components/layout/header';
import { CalendarView } from '@/components/calendar/calendar-view';
import { Button } from '@/components/ui/button';
import { ShareDialog } from '@/components/share/share-dialog';
import { exportCalendarAsImage, exportCalendarAsPdf } from '@/lib/export';
import { getMockBookings, getWeekDates, calculateMonthlyClientMetrics } from '@/lib/calendar-utils';
import type { Booking, MonthlyRecipe } from '@/types';
import { Download, Share2, Image as ImageIcon, FileText, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const calendarExportId = "calendar-table-export-area"; 

  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Initialize mock bookings based on the initial displayedDate's week
    // In a real app, you might fetch bookings for the displayedDate's month/week
    setBookings(getMockBookings(getWeekDates(displayedDate)));
  }, []); // Only on initial mount for mock data

  const handleNewBookings = (newlyConfirmedBookings: Booking[]) => {
    setBookings(prevBookings => [...prevBookings, ...newlyConfirmedBookings]);
  };

  const monthlyRecipe: MonthlyRecipe = useMemo(() => {
    return calculateMonthlyClientMetrics(bookings, displayedDate);
  }, [bookings, displayedDate]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto py-8 px-4 md:px-0">
        <div className="mb-8 p-6 bg-card rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-2 text-primary-foreground font-headline">Weekly Availability</h2>
          <p className="text-muted-foreground mb-6">
            View your studio's schedule for the week. Green (✅) slots are free, yellow (🔶) are buffer times, and red (❌) are booked. Select slots and click 'Book Selected' to make a reservation.
          </p>
          <div className="flex flex-wrap gap-4 mb-6">
            <Button 
              onClick={() => exportCalendarAsImage(calendarExportId)} 
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              aria-label="Export calendar as image"
            >
              <ImageIcon className="mr-2 h-4 w-4" /> Export as Image
            </Button>
            <Button 
              onClick={() => exportCalendarAsPdf(calendarExportId)} 
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              aria-label="Export calendar as PDF"
            >
              <FileText className="mr-2 h-4 w-4" /> Export as PDF
            </Button>
            <Button 
              onClick={() => setIsShareDialogOpen(true)} 
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              aria-label="Share calendar availability"
            >
              <Share2 className="mr-2 h-4 w-4" /> Share Availability
            </Button>
          </div>
        </div>
        
        <CalendarView 
          initialDate={displayedDate}
          onDateChange={setDisplayedDate}
          bookings={bookings}
          onNewBookingsAdd={handleNewBookings}
          calendarId={calendarExportId}
        />

        <div className="mt-12 p-6 bg-card rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-primary-foreground flex items-center">
            <BarChart3 className="mr-2 h-6 w-6 text-primary" />
            Monthly Recipe for {format(displayedDate, 'MMMM yyyy')}
          </h3>
          {Object.keys(monthlyRecipe).length > 0 ? (
            <ul className="space-y-3">
              {Object.entries(monthlyRecipe).map(([clientName, data]) => (
                <li key={clientName} className="p-3 bg-secondary/30 rounded-md shadow">
                  <strong className="text-primary-foreground">{clientName}:</strong> 
                  <span className="ml-2 text-foreground">{data.totalHours.toFixed(1)} hours</span>
                  <span className="ml-2 font-semibold text-accent">${data.totalPrice.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No bookings found for this month to generate a recipe.</p>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/50">
        © {new Date().getFullYear()} SessionSnap. All rights reserved.
      </footer>

      <ShareDialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen} />
    </div>
  );
}
