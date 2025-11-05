import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import RecurringEventDialog from '@/components/Dialog/RecurringEventDialog';

const meta = {
  title: '다이얼로그/반복 일정 작업',
  component: RecurringEventDialog,
  parameters: {
    layout: 'centered',
    chromatic: {
      delay: 300,
    },
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    open: true,
    onClose: fn(),
    onConfirm: fn(),
    event: null,
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
      description: '예/아니오 버튼 클릭 함수 (editSingleOnly: boolean)',
    },
    event: {
      control: 'object',
      description: '작업 대상 이벤트',
    },
    mode: {
      control: 'select',
      options: ['edit', 'delete'],
      description: '다이얼로그 모드 (수정/삭제)',
    },
  },
} satisfies Meta<typeof RecurringEventDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Edit: Story = {
  name: '반복 일정 수정',
  args: {
    mode: 'edit',
  },
};

export const Delete: Story = {
  name: '반복 일정 삭제',
  args: {
    mode: 'delete',
  },
};
