import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import EventCard from '@/components/Calendar/EventCard';
import { Event } from '@/types';

const defaultEvent: Event = {
  id: '1',
  title: '중간 네트워킹',
  date: '2025-11-15',
  startTime: '18:00',
  endTime: '22:00',
  description: '항해 7기 중간 네트워킹 이벤트',
  location: '회의실 A',
  category: '개인',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 1,
};

const repeatEvent: Event = {
  id: '2',
  title: '항해 오프라인',
  date: '2025-10-18',
  startTime: '12:00',
  endTime: '18:00',
  description: '항해 7기 발제 오프라인',
  location: '아이콘역삼빌딩',
  category: '개인',
  repeat: { type: 'weekly', interval: 1, endDate: '2025-12-20', id: 'repeat-1' },
  notificationTime: 10,
};

const meta = {
  title: '캘린더/일정 카드',
  component: EventCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    event: {
      control: 'object',
      description: '일정 객체',
    },
    isNotified: {
      control: 'boolean',
      description: '일정 알림 여부',
    },
    isRepeating: {
      control: 'boolean',
      description: '일정 반복 여부',
    },
    isOverlay: {
      control: 'boolean',
      description: '드래그 상태 여부',
    },
  },
  decorators: [
    (Story: React.FC) => (
      <div style={{ width: '150px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EventCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본 일정',
  args: {
    event: defaultEvent,
    isNotified: false,
    isRepeating: false,
    isOverlay: false,
  },
};

export const Notified: Story = {
  name: '알림 일정',
  args: {
    event: defaultEvent,
    isNotified: true,
    isRepeating: false,
    isOverlay: false,
  },
};

export const Repeating: Story = {
  name: '반복 일정',
  args: {
    event: repeatEvent,
    isNotified: false,
    isRepeating: true,
    isOverlay: false,
  },
};

export const NotifiedRepeating: Story = {
  name: '반복 알림 일정',
  args: {
    event: repeatEvent,
    isNotified: true,
    isRepeating: true,
    isOverlay: false,
  },
};

export const Overlay: Story = {
  name: '드래그 상태 일정',
  args: {
    event: defaultEvent,
    isNotified: false,
    isRepeating: false,
    isOverlay: true,
  },
};

export const OverlayNotified: Story = {
  name: '드래그 상태 알림 일정',
  args: {
    event: defaultEvent,
    isNotified: true,
    isRepeating: false,
    isOverlay: true,
  },
};

export const OverlayRepeating: Story = {
  name: '드래그 상태 반복 일정',
  args: {
    event: repeatEvent,
    isNotified: false,
    isRepeating: true,
    isOverlay: true,
  },
};

export const OverlayNotifiedRepeating: Story = {
  name: '드래그 상태 반복 알림 일정',
  args: {
    event: repeatEvent,
    isNotified: true,
    isRepeating: true,
    isOverlay: true,
  },
};
