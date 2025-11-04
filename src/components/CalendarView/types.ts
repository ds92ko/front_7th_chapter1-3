import { Dispatch, ReactNode, SetStateAction } from 'react';

import { Event } from '@/types';

export interface WeekViewProps {
  currentDate: Date;
  setDate: Dispatch<SetStateAction<string>>;
  filteredEvents: Event[];
  notifiedEvents: string[];
}

export interface MonthViewProps extends WeekViewProps {
  holidays: { [key: string]: string };
}

export interface CalendarViewProps {
  view: 'week' | 'month';
  setView: Dispatch<SetStateAction<'week' | 'month'>>;
  navigate: (_direction: 'prev' | 'next') => void;
  weekView: ReactNode;
  monthView: ReactNode;
}
