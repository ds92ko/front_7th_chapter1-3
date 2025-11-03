import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import CalendarView from './CalendarView';
import MonthView from './MonthView';
import WeekView from './WeekView';
import { Event } from '../../types';

const mockEvents: Event[] = [
  {
    id: '1',
    title: '팀 미팅',
    date: '2024-11-04',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '점심 약속',
    date: '2024-11-05',
    startTime: '12:00',
    endTime: '13:00',
    description: '친구와 점심',
    location: '레스토랑',
    category: '개인',
    repeat: { type: 'weekly', interval: 1, endDate: '2025-11-26', id: 'repeat-1' },
    notificationTime: 60,
  },
];

const meta = {
  title: 'Components/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    setView: fn(),
    navigate: fn(),
    weekView: (
      <WeekView
        currentDate={new Date('2024-11-04')}
        setDate={fn()}
        filteredEvents={mockEvents}
        notifiedEvents={[]}
      />
    ),
    monthView: (
      <MonthView
        currentDate={new Date('2024-11-04')}
        holidays={{}}
        setDate={fn()}
        filteredEvents={mockEvents}
        notifiedEvents={[]}
      />
    ),
  },
} satisfies Meta<typeof CalendarView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Week: Story = {
  args: {
    view: 'week',
  },
};

export const Month: Story = {
  args: {
    view: 'month',
  },
};
