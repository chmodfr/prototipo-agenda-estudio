'use client'; // Top-level client component because of state for dialog

import React, { useState } from 'react';
import { AppHeader } from '@/components/layout/header';
import { CalendarView } from '@/components/calendar/calendar-view';
import { Button } from '@/components/ui/button';
import { ShareDialog } from '@/components/share/share-dialog';
import { exportCalendarAsImage, exportCalendarAsPdf } from '@/lib/export';
import { Download, Share2, Image as ImageIcon, FileText } from 'lucide-react';

export default function HomePage() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const calendarExportId = "calendar-table-export-area"; // Ensure CalendarView's main div has this ID

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto py-8 px-4 md:px-0">
        <div className="mb-8 p-6 bg-card rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-2 text-primary-foreground font-headline">Weekly Availability</h2>
          <p className="text-muted-foreground mb-6">
            View your studio's schedule for the week. Green (✅) slots are free, yellow (🔶) are buffer times, and red (❌) are booked.
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
        
        <CalendarView />
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/50">
        © {new Date().getFullYear()} SessionSnap. All rights reserved.
      </footer>

      <ShareDialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen} />
    </div>
  );
}
