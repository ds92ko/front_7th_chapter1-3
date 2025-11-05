import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import EventForm from './EventForm';

const meta = {
  title: '폼/일정 추가 및 수정',
  component: EventForm,
  parameters: {
    layout: 'padded',
    chromatic: {
      delay: 300,
    },
  },
  tags: ['autodocs'],
  args: {
    setData: {
      title: fn(),
      date: fn(),
      startTime: fn(),
      endTime: fn(),
      description: fn(),
      location: fn(),
      category: fn(),
      isRepeating: fn(),
      repeat: {
        type: fn(),
        interval: fn(),
        endDate: fn(),
      },
      notificationTime: fn(),
    },
    addOrUpdateEvent: fn(),
  },
  argTypes: {
    data: {
      control: 'object',
      description: '폼 데이터',
    },
    setData: {
      action: 'setData',
      description: '폼 데이터 업데이트 함수',
    },
    errors: {
      control: 'object',
      description: '폼 에러 메시지',
    },
    editingEvent: {
      control: 'object',
      description: '수정 중인 이벤트',
    },
    addOrUpdateEvent: {
      action: 'addOrUpdateEvent',
      description: '일정 추가/수정 함수',
    },
  },
} satisfies Meta<typeof EventForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AddEmpty: Story = {
  name: '일정 추가 - 입력 없음',
  args: {
    data: {
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      location: '',
      category: '업무',
      isRepeating: false,
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '',
      },
      notificationTime: 10,
    },
    errors: {
      startTime: null,
      endTime: null,
    },
    editingEvent: null,
  },
};

export const AddSingleFilled: Story = {
  name: '일정 추가 - 단일 일정 입력',
  args: {
    data: {
      title: '항해 오프라인',
      date: '2025-11-08',
      startTime: '12:00',
      endTime: '18:00',
      description: '항해 7기 발제 오프라인',
      location: '아이콘역삼빌딩',
      category: '개인',
      isRepeating: false,
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '',
      },
      notificationTime: 10,
    },
    errors: {
      startTime: null,
      endTime: null,
    },
    editingEvent: null,
  },
};

export const AddRepeatingFilled: Story = {
  name: '일정 추가 - 반복 일정 입력',
  args: {
    data: {
      title: '항해 오프라인',
      date: '2025-11-08',
      startTime: '12:00',
      endTime: '18:00',
      description: '항해 7기 발제 오프라인',
      location: '아이콘역삼빌딩',
      category: '개인',
      isRepeating: true,
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-12-20',
      },
      notificationTime: 120,
    },
    errors: {
      startTime: null,
      endTime: null,
    },
    editingEvent: null,
  },
};

export const AddSingleTimeError: Story = {
  name: '일정 추가 - 단일 일정 시간 에러',
  args: {
    data: {
      title: '항해 오프라인',
      date: '2025-11-08',
      startTime: '18:00',
      endTime: '12:00',
      description: '항해 7기 발제 오프라인',
      location: '아이콘역삼빌딩',
      category: '개인',
      isRepeating: false,
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '',
      },
      notificationTime: 10,
    },
    errors: {
      startTime: '시작 시간은 종료 시간보다 빨라야 합니다.',
      endTime: '종료 시간은 시작 시간보다 늦어야 합니다.',
    },
    editingEvent: null,
  },
};

export const AddRepeatingTimeError: Story = {
  name: '일정 추가 - 반복 일정 시간 에러',
  args: {
    data: {
      title: '항해 오프라인',
      date: '2025-11-08',
      startTime: '18:00',
      endTime: '12:00',
      description: '항해 7기 발제 오프라인',
      location: '아이콘역삼빌딩',
      category: '개인',
      isRepeating: true,
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-12-20',
      },
      notificationTime: 120,
    },
    errors: {
      startTime: '시작 시간은 종료 시간보다 빨라야 합니다.',
      endTime: '종료 시간은 시작 시간보다 늦어야 합니다.',
    },
    editingEvent: null,
  },
};

export const EditFilled: Story = {
  name: '일정 수정 - 일정 입력',
  args: {
    data: {
      title: '항해 오프라인',
      date: '2025-11-08',
      startTime: '12:00',
      endTime: '18:00',
      description: '항해 7기 발제 오프라인',
      location: '아이콘역삼빌딩',
      category: '개인',
      isRepeating: true,
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-12-20',
      },
      notificationTime: 120,
    },
    errors: {
      startTime: null,
      endTime: null,
    },
    editingEvent: {
      id: '1',
      title: '항해 오프라인',
      date: '2025-11-08',
      startTime: '12:00',
      endTime: '18:00',
      description: '항해 7기 발제 오프라인',
      location: '아이콘역삼빌딩',
      category: '개인',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-12-20',
      },
      notificationTime: 120,
    },
  },
};

export const EditTimeError: Story = {
  name: '일정 수정 - 일정 시간 에러',
  args: {
    data: {
      title: '항해 오프라인',
      date: '2025-11-08',
      startTime: '18:00',
      endTime: '12:00',
      description: '항해 7기 발제 오프라인',
      location: '아이콘역삼빌딩',
      category: '개인',
      isRepeating: true,
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-12-20',
      },
      notificationTime: 120,
    },
    errors: {
      startTime: '시작 시간은 종료 시간보다 빨라야 합니다.',
      endTime: '종료 시간은 시작 시간보다 늦어야 합니다.',
    },
    editingEvent: {
      id: '1',
      title: '항해 오프라인',
      date: '2025-11-08',
      startTime: '12:00',
      endTime: '18:00',
      description: '항해 7기 발제 오프라인',
      location: '아이콘역삼빌딩',
      category: '개인',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-12-20',
      },
      notificationTime: 120,
    },
  },
};
