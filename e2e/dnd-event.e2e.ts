import { expect, test } from '@playwright/test';

import { getOtherDateInWeek, getTodayDate } from '../src/utils/dateUtils';

test.describe('일정 D&D 처리', () => {
  test.beforeEach(async ({ page }) => {
    const res = await page.request.post('/api/test/reset', {
      headers: { 'x-worker-id': process.env.TEST_PARALLEL_INDEX || '0' },
    });
    expect(res.ok()).toBeTruthy();

    await page.goto('/');
  });

  /**
   * NOTE: 심화 과제 추가 테스트
   *
   * 🤝 페어 프로그래밍
   * 드라이버: 고다솜, 양진성
   * 네비게이터: 정나리, 이정민
   */
  test('다른 날짜로 D&D 시 일정 이동 성공', async ({ page }) => {
    // 폼 데이터 입력
    await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
    await page.fill('input[placeholder="날짜"]', getTodayDate());
    await page.fill('input[placeholder="시작 시간"]', '09:00');
    await page.fill('input[placeholder="종료 시간"]', '10:00');

    // 일정 추가 버튼 클릭
    await page.click('button:has-text("일정 추가")');

    // 월간 뷰에서 생성한 일정 찾기
    const monthView = page.locator('[data-testid="month-view"]');
    const eventCard = monthView.locator('text=항해 과제 제출하기');

    await expect(eventCard).toBeVisible();

    // 목표 날짜의 셀 찾기
    const targetCell = monthView.locator(
      `td[data-testid="day-cell-${+getOtherDateInWeek().slice(-2)}"]`
    );

    // 드래그 앤 드롭 수행
    await eventCard.dragTo(targetCell);

    // 목표 셀에 일정이 존재하는지 확인
    const movedEvent = targetCell.locator('text=항해 과제 제출하기');
    await expect(movedEvent).toBeVisible();
  });

  /**
   * NOTE: 심화 과제 추가 테스트
   *
   * 🤝 페어 프로그래밍
   * 드라이버: 고다솜, 양진성
   * 네비게이터: 정나리, 이정민
   */
  test('빈 셀로 D&D 시 일정 이동 실패', async ({ page }) => {
    // 폼 데이터 입력
    await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
    await page.fill('input[placeholder="날짜"]', getTodayDate());
    await page.fill('input[placeholder="시작 시간"]', '09:00');
    await page.fill('input[placeholder="종료 시간"]', '10:00');

    // 일정 추가 버튼 클릭
    await page.click('button:has-text("일정 추가")');

    // 월간 뷰에서 생성한 일정 찾기
    const monthView = page.locator('[data-testid="month-view"]');
    const eventCard = monthView.locator('text=항해 과제 제출하기');

    await expect(eventCard).toBeVisible();

    // 목표 날짜의 셀 찾기
    const targetCell = monthView.locator('td[data-testid="day-cell-empty"]').first();

    // 드래그 앤 드롭 수행
    await eventCard.dragTo(targetCell);

    // 목표 셀에 일정이 존재하지 않는지 확인
    const movedEvent = targetCell.locator('text=항해 과제 제출하기');
    await expect(movedEvent).not.toBeVisible();

    // 일정이 원래 위치에 남아있는지 확인
    const originalCell = monthView.locator(
      `td[data-testid="day-cell-${+getTodayDate().slice(-2)}"]`
    );
    await expect(originalCell).toBeVisible();
  });

  // NOTE: 심화 과제 추가 테스트
  test('반복 일정 D&D 시 기본 일정으로 변경', async ({ page }) => {
    // 폼 데이터 입력
    await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
    await page.fill('input[placeholder="날짜"]', getTodayDate());
    await page.fill('input[placeholder="시작 시간"]', '09:00');
    await page.fill('input[placeholder="종료 시간"]', '10:00');
    await page.locator('text=반복 일정').click();
    await page.click('[aria-label="반복 유형"]');
    await page.click('li[aria-label="monthly-option"]');

    // 일정 추가 버튼 클릭
    await page.click('button:has-text("일정 추가")');

    // 월간 뷰에서 반복 일정 생성 확인
    const monthView = page.locator('[data-testid="month-view"]');
    const originalCell = monthView.locator(
      `td[data-testid="day-cell-${+getTodayDate().slice(-2)}"]`
    );
    const RepeatIcon = originalCell.locator('svg[data-testid="RepeatIcon"]');

    await expect(RepeatIcon).toBeVisible();

    // 목표 날짜의 셀 찾기
    const targetCell = monthView.locator(
      `td[data-testid="day-cell-${+getOtherDateInWeek().slice(-2)}"]`
    );

    // 드래그 앤 드롭 수행
    await RepeatIcon.locator('..').dragTo(targetCell);

    // 기본 일정으로 변경되었는지 확인
    const movedRepeatIcon = targetCell.locator('svg[data-testid="RepeatIcon"]');
    await expect(movedRepeatIcon).not.toBeVisible();
  });
});
