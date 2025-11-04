import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dispatch, SetStateAction } from 'react';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import CalendarView from '@/components/Calendar/CalendarView';
import MonthView from '@/components/Calendar/MonthView';
import WeekView from '@/components/Calendar/WeekView';
import { Event } from '@/types';

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
  title: '캘린더/일정 보기',
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
  argTypes: {
    view: {
      control: 'select',
      options: ['week', 'month'],
      description: '캘린더 뷰 타입',
    },
    setView: {
      action: 'setView',
      description: '뷰 타입 변경 함수',
    },
    navigate: {
      action: 'navigate',
      description: '날짜 이동 함수',
    },
    weekView: {
      control: false,
      description: '주간 뷰 컴포넌트',
    },
    monthView: {
      control: false,
      description: '월간 뷰 컴포넌트',
    },
  },
  render: function Render(args) {
    const [{ view }, updateArgs] = useArgs();

    const setView = (newView: 'week' | 'month') => {
      updateArgs({ view: newView });
    };

    return (
      <CalendarView
        {...args}
        view={view}
        setView={setView as Dispatch<SetStateAction<'week' | 'month'>>}
      />
    );
  },
} satisfies Meta<typeof CalendarView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Month: Story = {
  name: '월간 뷰',
  args: { view: 'month' },
};

export const Week: Story = {
  name: '주간 뷰',
  args: { view: 'week' },
};
