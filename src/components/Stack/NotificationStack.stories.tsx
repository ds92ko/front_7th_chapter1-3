import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import NotificationStack from '@/components/Stack/NotificationStack';

const mockNotifications = [
  {
    id: '1',
    message: '1분 후 항해 오프라인 일정이 시작됩니다.',
  },
  {
    id: '2',
    message: '10분 후 중간 네트워킹 일정이 시작됩니다.',
  },
  {
    id: '3',
    message: '60분 후 2팀 코어타임 일정이 시작됩니다.',
  },
  {
    id: '4',
    message: '120분 후 과제 제출 마감 일정이 시작됩니다.',
  },
  {
    id: '5',
    message: '1440분 후 테오 멘토링 일정이 시작됩니다.',
  },
];

const meta = {
  title: '스택/알림',
  component: NotificationStack,
  parameters: {
    layout: 'padded',
    chromatic: {
      delay: 300,
    },
    docs: {
      story: {
        inline: false,
        iframeHeight: 100,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onClose: fn(),
  },
  argTypes: {
    notifications: {
      control: 'object',
      description: '알림 목록',
    },
    onClose: {
      action: 'onClose',
      description: '알림 닫기 함수 (index: number)',
    },
  },
} satisfies Meta<typeof NotificationStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  name: '단일 알림',
  args: {
    notifications: [mockNotifications[0]],
  },
};

export const Multiple: Story = {
  name: '복수 알림',
  args: {
    notifications: mockNotifications,
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
  },
};
