import { ChangeEvent } from 'react';

import { Event, RepeatType } from '@/types';

export interface EventFormProps {
  data: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    description: string;
    location: string;
    category: string;
    isRepeating: boolean;
    repeat: {
      type: RepeatType;
      interval: number;
      endDate: string;
    };
    notificationTime: number;
  };
  setData: {
    title: (_value: string) => void;
    date: (_value: string) => void;
    startTime: (_e: ChangeEvent<HTMLInputElement>) => void;
    endTime: (_e: ChangeEvent<HTMLInputElement>) => void;
    description: (_value: string) => void;
    location: (_value: string) => void;
    category: (_value: string) => void;
    isRepeating: (_value: boolean) => void;
    repeat: {
      type: (_value: RepeatType) => void;
      interval: (_value: number) => void;
      endDate: (_value: string) => void;
    };
    notificationTime: (_value: number) => void;
  };
  errors: {
    startTime: string | null;
    endTime: string | null;
  };
  editingEvent: Event | null;
  addOrUpdateEvent: () => void;
}
