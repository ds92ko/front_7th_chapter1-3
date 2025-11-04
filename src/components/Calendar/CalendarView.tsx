import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import EventCard from '@/components/Calendar/EventCard';
import { CalendarViewProps } from '@/components/Calendar/types';
import { Event } from '@/types';

const CalendarView = ({
  view,
  setView,
  navigate,
  notifiedEvents,
  weekView,
  monthView,
  onEventDrop,
}: CalendarViewProps) => {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [dropAnimation, setDropAnimation] = useState(true);

  const handleDragStart = (event: DragStartEvent) => {
    setDropAnimation(true);
    setActiveEvent(event.active.data.current?.event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveEvent(null);
    setDropAnimation(!event.over?.id);
    if (event.over && activeEvent && onEventDrop) {
      const date = event.over.data.current?.dateString;

      if (date && date !== activeEvent.date)
        onEventDrop({ ...activeEvent, date, repeat: { type: 'none', interval: 0 } });
    }
  };

  return (
    <Stack flex={1} spacing={5}>
      <Typography variant="h4">일정 보기</Typography>

      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <IconButton aria-label="Previous" onClick={() => navigate('prev')}>
          <ChevronLeft />
        </IconButton>
        <Select
          size="small"
          aria-label="뷰 타입 선택"
          value={view}
          onChange={(e) => setView(e.target.value as 'week' | 'month')}
        >
          <MenuItem value="week" aria-label="week-option">
            Week
          </MenuItem>
          <MenuItem value="month" aria-label="month-option">
            Month
          </MenuItem>
        </Select>
        <IconButton aria-label="Next" onClick={() => navigate('next')}>
          <ChevronRight />
        </IconButton>
      </Stack>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {view === 'week' && weekView}
        {view === 'month' && monthView}
        {createPortal(
          <DragOverlay
            dropAnimation={
              dropAnimation
                ? {
                    duration: 250,
                    easing: 'ease-in-out',
                  }
                : null
            }
          >
            {activeEvent && (
              <EventCard
                event={activeEvent}
                isNotified={notifiedEvents.includes(activeEvent.id)}
                isRepeating={activeEvent.repeat.type !== 'none'}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </Stack>
  );
};

export default CalendarView;
