import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

import App from '@/App';

const theme = createTheme();

const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>{element}</SnackbarProvider>
      </ThemeProvider>
    ),
    user,
  };
};

describe('날짜 셀 클릭', () => {
  // NOTE: 심화 과제 추가 테스트
  it('날짜 셀을 클릭하면 날짜 입력 필드가 채워져야 합니다.', async () => {
    // 시스템 시간을 고정하여 테스트의 일관성 보장
    vi.setSystemTime(new Date('2025-11-15'));
    const { user } = setup(<App />);

    // 일정 로딩 완료 대기
    await screen.findByText('일정 로딩 완료!');

    // 월별 뷰에서 현재 월의 15일 셀 찾기
    const monthView = screen.getByTestId('month-view');
    const day15Cell = within(monthView).getByTestId('day-cell-15');

    // 15일 셀이 표시되어 있는지 확인
    expect(day15Cell).toBeInTheDocument();
    expect(within(day15Cell).getByText('15')).toBeInTheDocument();

    // 15일 셀 클릭
    await user.click(day15Cell);

    // EventForm의 날짜 입력 필드가 클릭한 날짜로 채워졌는지 확인
    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    expect(dateInput.value).toBe('2025-11-15');
  });

  // NOTE: 심화 과제 추가 테스트
  it('날짜가 없는 셀을 클릭하면 날짜 입력 필드가 비워져야 합니다.', async () => {
    // 시스템 시간을 고정하여 테스트의 일관성 보장
    vi.setSystemTime(new Date('2025-11-15'));
    const { user } = setup(<App />);

    // 일정 로딩 완료 대기
    await screen.findByText('일정 로딩 완료!');

    // 월별 뷰에서 날짜가 있는 셀 클릭
    const monthView = screen.getByTestId('month-view');
    const day15Cell = within(monthView).getByTestId('day-cell-15');

    await user.click(day15Cell);

    // 날짜 입력 필드가 클릭한 날짜로 채워졌는지 확인
    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    expect(dateInput.value).toBe('2025-11-15');

    // 빈 셀 클릭
    const emptyCells = within(monthView).getAllByTestId('day-cell-empty');
    await user.click(emptyCells[0]);

    // 날짜 입력 필드가 비워졌는지 확인
    expect(dateInput.value).toBe('');
  });
});
