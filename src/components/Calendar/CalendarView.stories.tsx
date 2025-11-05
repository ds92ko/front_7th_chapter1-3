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
    title: '항해 오프라인',
    date: '2025-11-01',
    startTime: '12:00',
    endTime: '18:00',
    description: '항해 7기 발제 오프라인',
    location: '아이콘역삼빌딩',
    category: '개인',
    repeat: { type: 'weekly', interval: 1, endDate: '2025-12-20', id: 'repeat-1' },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '항해 오프라인',
    date: '2025-11-08',
    startTime: '12:00',
    endTime: '18:00',
    description: '항해 7기 발제 오프라인',
    location: '아이콘역삼빌딩',
    category: '개인',
    repeat: { type: 'weekly', interval: 1, endDate: '2025-12-20', id: 'repeat-1' },
    notificationTime: 10,
  },
  {
    id: '3',
    title: '항해 오프라인',
    date: '2025-11-15',
    startTime: '12:00',
    endTime: '18:00',
    description: '항해 7기 발제 오프라인',
    location: '아이콘역삼빌딩',
    category: '개인',
    repeat: { type: 'weekly', interval: 1, endDate: '2025-12-20', id: 'repeat-1' },
    notificationTime: 10,
  },
  {
    id: '4',
    title: '항해 오프라인',
    date: '2025-11-22',
    startTime: '12:00',
    endTime: '18:00',
    description: '항해 7기 발제 오프라인',
    location: '아이콘역삼빌딩',
    category: '개인',
    repeat: { type: 'weekly', interval: 1, endDate: '2025-12-20', id: 'repeat-1' },
    notificationTime: 10,
  },
  {
    id: '5',
    title: '항해 오프라인',
    date: '2025-11-29',
    startTime: '12:00',
    endTime: '18:00',
    description: '항해 7기 발제 오프라인',
    location: '아이콘역삼빌딩',
    category: '개인',
    repeat: { type: 'weekly', interval: 1, endDate: '2025-12-20', id: 'repeat-1' },
    notificationTime: 10,
  },
  {
    id: '6',
    title: '중간 네트워킹',
    date: '2025-11-15',
    startTime: '18:00',
    endTime: '22:00',
    description: '항해 7기 중간 네트워킹 이벤트',
    location: '회의실 A',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
];

const mockHolidays = {
  '2025-11-07': '입동',
  '2025-11-11': '빼빼로데이',
  '2025-11-22': '소설',
};

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
    onEventDrop: fn(),
    notifiedEvents: [],
    weekView: (
      <WeekView
        currentDate={new Date('2025-11-15')}
        setDate={fn()}
        filteredEvents={[]}
        notifiedEvents={[]}
      />
    ),
    monthView: (
      <MonthView
        currentDate={new Date('2025-11-15')}
        holidays={{}}
        setDate={fn()}
        filteredEvents={[]}
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
    onEventDrop: {
      action: 'onEventDrop',
      description: '이벤트 드롭 함수',
    },
    notifiedEvents: {
      control: 'object',
      description: '알림 이벤트 목록',
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

export const Week: Story = {
  name: '주간 뷰',
  args: { view: 'week' },
};

export const WeekWithEvents: Story = {
  name: '주간 뷰 - 일정 포함',
  args: {
    view: 'week',
    weekView: (
      <WeekView
        currentDate={new Date('2025-11-15')}
        setDate={fn()}
        filteredEvents={mockEvents}
        notifiedEvents={['3']}
      />
    ),
    monthView: (
      <MonthView
        currentDate={new Date('2025-11-15')}
        holidays={{}}
        setDate={fn()}
        filteredEvents={mockEvents}
        notifiedEvents={['3']}
      />
    ),
    notifiedEvents: ['3'],
  },
};

export const Month: Story = {
  name: '월간 뷰',
  args: { view: 'month' },
};

export const MonthWithEvents: Story = {
  name: '월간 뷰 - 일정 포함',
  args: {
    view: 'month',
    weekView: (
      <WeekView
        currentDate={new Date('2025-11-15')}
        setDate={fn()}
        filteredEvents={mockEvents}
        notifiedEvents={['3']}
      />
    ),
    monthView: (
      <MonthView
        currentDate={new Date('2025-11-15')}
        holidays={{}}
        setDate={fn()}
        filteredEvents={mockEvents}
        notifiedEvents={['3']}
      />
    ),
    notifiedEvents: ['3'],
  },
};

export const MonthWithHolidays: Story = {
  name: '월간 뷰 - 공휴일 포함',
  args: {
    view: 'month',
    monthView: (
      <MonthView
        currentDate={new Date('2025-11-15')}
        holidays={mockHolidays}
        setDate={fn()}
        filteredEvents={[]}
        notifiedEvents={[]}
      />
    ),
  },
};

export const MonthWithHolidaysAndEvents: Story = {
  name: '월간 뷰 - 공휴일, 일정 포함',
  args: {
    view: 'month',
    weekView: (
      <WeekView
        currentDate={new Date('2025-11-15')}
        setDate={fn()}
        filteredEvents={mockEvents}
        notifiedEvents={['3']}
      />
    ),
    monthView: (
      <MonthView
        currentDate={new Date('2025-11-15')}
        holidays={mockHolidays}
        setDate={fn()}
        filteredEvents={mockEvents}
        notifiedEvents={['3']}
      />
    ),
    notifiedEvents: ['3'],
  },
};
