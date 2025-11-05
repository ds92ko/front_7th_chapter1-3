import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import OverlapEventDialog from '@/components/Dialog/OverlapEventDialog';
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
  date: '2025-11-15',
  startTime: '12:00',
  endTime: '18:00',
  description: '항해 7기 발제 오프라인',
  location: '아이콘역삼빌딩',
  category: '개인',
  repeat: { type: 'weekly', interval: 1, endDate: '2025-12-20', id: 'repeat-1' },
  notificationTime: 10,
};

const meta = {
  title: '다이얼로그/일정 겹침 경고',
  component: OverlapEventDialog,
  parameters: {
    layout: 'centered',
    chromatic: {
      delay: 300,
    },
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    open: true,
    onClose: fn(),
    onConfirm: fn(),
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: '다이얼로그 열림 여부',
    },
    onClose: {
      action: 'onClose',
      description: '다이얼로그 닫기 함수',
    },
    onConfirm: {
      action: 'onConfirm',
      description: '계속 진행 버튼 클릭 함수',
    },
    events: {
      control: 'object',
      description: '중복 일정 목록',
    },
  },
} satisfies Meta<typeof OverlapEventDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  name: '단일 일정 겹침',
  args: {
    events: [defaultEvent],
  },
};

export const Multiple: Story = {
  name: '복수 일정 겹침',
  args: {
    events: [defaultEvent, repeatEvent],
  },
};
