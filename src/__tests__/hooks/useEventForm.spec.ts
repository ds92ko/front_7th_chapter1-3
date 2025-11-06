import { act, renderHook } from '@testing-library/react';
import { ChangeEvent } from 'react';

import { useEventForm } from '@/hooks/useEventForm';
import { Event } from '@/types';

// NOTE: 심화 과제 추가 테스트
describe('초기 상태', () => {
  // NOTE: 심화 과제 추가 테스트
  it('initialEvent가 없을 때 모든 필드가 기본값으로 초기화되어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    expect(result.current.data).toEqual({
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
    });

    expect(result.current.errors).toEqual({
      startTime: null,
      endTime: null,
    });

    expect(result.current.editingEvent).toBeNull();
  });

  // NOTE: 심화 과제 추가 테스트
  it('initialEvent가 주어졌을 때 해당 이벤트 값으로 초기화되어야 한다', () => {
    const initialEvent: Event = {
      id: '1',
      title: '기존 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 A',
      category: '개인',
      repeat: { type: 'daily', interval: 2, endDate: '2025-10-20' },
      notificationTime: 5,
    };

    const { result } = renderHook(() => useEventForm(initialEvent));

    expect(result.current.data).toEqual({
      title: '기존 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 A',
      category: '개인',
      isRepeating: true,
      repeat: {
        type: 'daily',
        interval: 2,
        endDate: '2025-10-20',
      },
      notificationTime: 5,
    });
  });

  // NOTE: 심화 과제 추가 테스트
  it('initialEvent의 repeat.type이 "none"일 때 isRepeating이 false여야 한다', () => {
    const initialEvent: Event = {
      id: '1',
      title: '일반 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '일반 회의',
      location: '회의실',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    const { result } = renderHook(() => useEventForm(initialEvent));

    expect(result.current.data.isRepeating).toBe(false);
  });
});

// NOTE: 심화 과제 추가 테스트
describe('필드 업데이트', () => {
  // NOTE: 심화 과제 추가 테스트
  it('setData.title으로 제목을 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setData.title('새 회의');
    });

    expect(result.current.data.title).toBe('새 회의');
  });

  // NOTE: 심화 과제 추가 테스트
  it('setData.date로 날짜를 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setData.date('2025-10-20');
    });

    expect(result.current.data.date).toBe('2025-10-20');
  });

  // NOTE: 심화 과제 추가 테스트
  it('setData.startTime으로 시작 시간을 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    const event = { target: { value: '14:00' } } as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.setData.startTime(event);
    });

    expect(result.current.data.startTime).toBe('14:00');
  });

  // NOTE: 심화 과제 추가 테스트
  it('setData.endTime으로 종료 시간을 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    const event = { target: { value: '15:00' } } as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.setData.endTime(event);
    });

    expect(result.current.data.endTime).toBe('15:00');
  });

  // NOTE: 심화 과제 추가 테스트
  it('setData.description으로 설명을 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setData.description('프로젝트 진행 상황 논의');
    });

    expect(result.current.data.description).toBe('프로젝트 진행 상황 논의');
  });

  // NOTE: 심화 과제 추가 테스트
  it('setData.location으로 위치를 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setData.location('회의실 B');
    });

    expect(result.current.data.location).toBe('회의실 B');
  });

  // NOTE: 심화 과제 추가 테스트
  it('setData.category로 카테고리를 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setData.category('개인');
    });

    expect(result.current.data.category).toBe('개인');
  });

  // NOTE: 심화 과제 추가 테스트
  it('setData.isRepeating으로 반복 일정 여부를 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setData.isRepeating(true);
    });

    expect(result.current.data.isRepeating).toBe(true);
  });

  // NOTE: 심화 과제 추가 테스트
  it('setData.repeat.type으로 반복 유형을 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setData.repeat.type('weekly');
    });

    expect(result.current.data.repeat.type).toBe('weekly');
  });

  // NOTE: 심화 과제 추가 테스트
  it('setData.repeat.interval으로 반복 간격을 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setData.repeat.interval(3);
    });

    expect(result.current.data.repeat.interval).toBe(3);
  });

  // NOTE: 심화 과제 추가 테스트
  it('setData.repeat.endDate로 반복 종료일을 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setData.repeat.endDate('2025-12-31');
    });

    expect(result.current.data.repeat.endDate).toBe('2025-12-31');
  });

  // NOTE: 심화 과제 추가 테스트
  it('setData.notificationTime으로 알림 시간을 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setData.notificationTime(30);
    });

    expect(result.current.data.notificationTime).toBe(30);
  });
});

describe('시간 검증', () => {
  // NOTE: 심화 과제 추가 테스트
  it('시작 시간이 종료 시간보다 늦을 때 에러가 설정되어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    // 먼저 종료 시간 설정
    act(() => {
      const endTimeEvent = { target: { value: '10:00' } } as ChangeEvent<HTMLInputElement>;
      result.current.setData.endTime(endTimeEvent);
    });

    // 시작 시간을 종료 시간보다 늦게 설정
    act(() => {
      const startTimeEvent = { target: { value: '11:00' } } as ChangeEvent<HTMLInputElement>;
      result.current.setData.startTime(startTimeEvent);
    });

    expect(result.current.errors.startTime).toBe('시작 시간은 종료 시간보다 빨라야 합니다.');
    expect(result.current.errors.endTime).toBe('종료 시간은 시작 시간보다 늦어야 합니다.');
  });

  // NOTE: 심화 과제 추가 테스트
  it('종료 시간이 시작 시간보다 빠를 때 에러가 설정되어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    // 먼저 시작 시간 설정
    act(() => {
      const startTimeEvent = { target: { value: '14:00' } } as ChangeEvent<HTMLInputElement>;
      result.current.setData.startTime(startTimeEvent);
    });

    // 종료 시간을 시작 시간보다 빠르게 설정
    act(() => {
      const endTimeEvent = { target: { value: '13:00' } } as ChangeEvent<HTMLInputElement>;
      result.current.setData.endTime(endTimeEvent);
    });

    expect(result.current.errors.startTime).toBe('시작 시간은 종료 시간보다 빨라야 합니다.');
    expect(result.current.errors.endTime).toBe('종료 시간은 시작 시간보다 늦어야 합니다.');
  });

  // NOTE: 심화 과제 추가 테스트
  it('시작 시간이 종료 시간보다 빠를 때 에러가 없어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      const startTimeEvent = { target: { value: '09:00' } } as ChangeEvent<HTMLInputElement>;
      result.current.setData.startTime(startTimeEvent);
    });

    act(() => {
      const endTimeEvent = { target: { value: '10:00' } } as ChangeEvent<HTMLInputElement>;
      result.current.setData.endTime(endTimeEvent);
    });

    expect(result.current.errors.startTime).toBeNull();
    expect(result.current.errors.endTime).toBeNull();
  });
});

describe('resetForm', () => {
  // NOTE: 심화 과제 추가 테스트
  it('모든 필드를 기본값으로 리셋해야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    // 필드들 업데이트
    act(() => {
      result.current.setData.title('회의');
      result.current.setData.date('2025-10-15');
      result.current.setData.startTime({
        target: { value: '09:00' },
      } as ChangeEvent<HTMLInputElement>);
      result.current.setData.endTime({
        target: { value: '10:00' },
      } as ChangeEvent<HTMLInputElement>);
      result.current.setData.description('설명');
      result.current.setData.location('회의실');
      result.current.setData.category('개인');
      result.current.setData.isRepeating(true);
      result.current.setData.repeat.type('daily');
      result.current.setData.repeat.interval(2);
      result.current.setData.repeat.endDate('2025-12-31');
      result.current.setData.notificationTime(30);
    });

    // 리셋
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.data).toEqual({
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
    });
  });
});

describe('editEvent', () => {
  // NOTE: 심화 과제 추가 테스트
  it('이벤트 정보로 폼을 채워야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    const event: Event = {
      id: '1',
      title: '편집할 회의',
      date: '2025-10-20',
      startTime: '14:00',
      endTime: '15:00',
      description: '편집할 회의 설명',
      location: '회의실 C',
      category: '개인',
      repeat: { type: 'weekly', interval: 1, endDate: '2025-11-30' },
      notificationTime: 15,
    };

    act(() => {
      result.current.editEvent(event);
    });

    expect(result.current.data).toEqual({
      title: '편집할 회의',
      date: '2025-10-20',
      startTime: '14:00',
      endTime: '15:00',
      description: '편집할 회의 설명',
      location: '회의실 C',
      category: '개인',
      isRepeating: true,
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-11-30',
      },
      notificationTime: 15,
    });

    expect(result.current.editingEvent).toEqual(event);
  });

  // NOTE: 심화 과제 추가 테스트
  it('repeat.type이 "none"일 때 isRepeating이 false여야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    const event: Event = {
      id: '1',
      title: '일반 회의',
      date: '2025-10-20',
      startTime: '14:00',
      endTime: '15:00',
      description: '일반 회의',
      location: '회의실',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    act(() => {
      result.current.editEvent(event);
    });

    expect(result.current.data.isRepeating).toBe(false);
  });

  // NOTE: 심화 과제 추가 테스트
  it('repeat.endDate가 없을 때 빈 문자열로 설정되어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    const event: Event = {
      id: '1',
      title: '회의',
      date: '2025-10-20',
      startTime: '14:00',
      endTime: '15:00',
      description: '회의',
      location: '회의실',
      category: '업무',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    };

    act(() => {
      result.current.editEvent(event);
    });

    expect(result.current.data.repeat.endDate).toBe('');
  });
});

describe('setEditingEvent', () => {
  // NOTE: 심화 과제 추가 테스트
  it('editingEvent를 설정할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    const event: Event = {
      id: '1',
      title: '회의',
      date: '2025-10-20',
      startTime: '14:00',
      endTime: '15:00',
      description: '회의',
      location: '회의실',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    act(() => {
      result.current.setEditingEvent(event);
    });

    expect(result.current.editingEvent).toEqual(event);
  });

  // NOTE: 심화 과제 추가 테스트
  it('editingEvent를 null로 설정할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    const event: Event = {
      id: '1',
      title: '회의',
      date: '2025-10-20',
      startTime: '14:00',
      endTime: '15:00',
      description: '회의',
      location: '회의실',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    act(() => {
      result.current.setEditingEvent(event);
      result.current.setEditingEvent(null);
    });

    expect(result.current.editingEvent).toBeNull();
  });
});
