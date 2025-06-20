
'use client';

import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import type { TimeSlot as TimeSlotType } from '@/types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CalendarSlotProps {
  slot: TimeSlotType;
  onSlotBook?: (slotTime: Date) => void; // Callback to handle booking
}

export function CalendarSlot({ slot, onSlotBook }: CalendarSlotProps) {
  const { isBooked, isBuffer, bookingDetails } = slot;
  const isAvailable = !isBooked && !isBuffer;

  let IconComponent;
  let iconColorClass = '';
  let slotBgClass = 'bg-card hover:bg-card/80';
  let tooltipMessage = 'Available';

  if (isBooked) {
    IconComponent = XCircle;
    iconColorClass = 'text-destructive';
    slotBgClass = 'bg-destructive/20 hover:bg-destructive/30';
    tooltipMessage = `Booked: ${bookingDetails?.title || bookingDetails?.service || 'Event'}`;
    if (bookingDetails?.clientName) {
      tooltipMessage += ` by ${bookingDetails.clientName}`;
    }
    if (bookingDetails?.price !== undefined) {
      tooltipMessage += ` - Price: $${bookingDetails.price}`;
    }
  } else if (isBuffer) {
    IconComponent = MinusCircle;
    iconColorClass = 'text-yellow-500'; 
    slotBgClass = 'bg-yellow-500/10 hover:bg-yellow-500/20';
    tooltipMessage = `Buffer time (related to: ${bookingDetails?.title || bookingDetails?.service || 'Event'})`;
     if (bookingDetails?.price !== undefined) {
      tooltipMessage += ` - Price: $${bookingDetails.price}`;
    }
  } else {
    IconComponent = CheckCircle;
    iconColorClass = 'text-green-500';
    tooltipMessage = 'Available - Click to book';
  }

  const handleClick = () => {
    if (isAvailable && onSlotBook) {
      onSlotBook(slot.time);
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'h-16 w-full flex items-center justify-center p-2 border-r border-b border-border/50 transition-colors',
              slotBgClass,
              isAvailable && onSlotBook ? 'cursor-pointer' : 'cursor-not-allowed'
            )}
            aria-label={`${slot.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${tooltipMessage}`}
            role="button"
            tabIndex={0}
            onClick={handleClick}
          >
            <IconComponent className={cn('h-6 w-6', iconColorClass)} />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-popover text-popover-foreground p-2 rounded-md shadow-lg">
          <p className="text-sm">{tooltipMessage}</p>
          <p className="text-xs text-muted-foreground">{slot.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.time.getTime() + 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
