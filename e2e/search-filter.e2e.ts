import { expect, test } from '@playwright/test';

import { getOtherWeekInMonth, getTodayDate } from '../src/utils/dateUtils';

test.describe('검색 및 필터링', () => {
  test.beforeEach(async ({ page }) => {
    const res = await page.request.post('/api/test/reset', {
      headers: { 'x-worker-id': process.env.TEST_PARALLEL_INDEX || '0' },
    });
    expect(res.ok()).toBeTruthy();

    await page.goto('/');
  });

  test('검색 기능', async ({ page }) => {
    // 첫 번째 일정 생성
    await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
    await page.fill('input[placeholder="날짜"]', getTodayDate());
    await page.fill('input[placeholder="시작 시간"]', '09:00');
    await page.fill('input[placeholder="종료 시간"]', '10:00');
    await page.fill('input[placeholder="설명"]', '과제 패스 가즈아~~!');
    await page.click('button:has-text("일정 추가")');
    await page.waitForTimeout(300);

    // 두 번째 일정 생성
    await page.fill('input[placeholder="제목"]', '2팀 테오 멘토링');
    await page.fill('input[placeholder="날짜"]', getTodayDate());
    await page.fill('input[placeholder="시작 시간"]', '22:00');
    await page.fill('input[placeholder="종료 시간"]', '23:00');
    await page.fill('input[placeholder="위치"]', 'ZEP');
    await page.click('button:has-text("일정 추가")');
    await page.waitForTimeout(300);

    const eventList = page.locator('[data-testid="event-list"]');

    // 검색 전: 두 일정 모두 표시
    await expect(eventList.locator('text=항해 과제 제출하기')).toBeVisible();
    await expect(eventList.locator('text=2팀 테오 멘토링')).toBeVisible();

    // 검색어 입력
    await page.fill('input[placeholder="검색어를 입력하세요"]', '항해');
    await page.waitForTimeout(300);

    // 검색 후: '항해' 포함된 일정만 표시
    await expect(eventList.locator('text=항해 과제 제출하기')).toBeVisible();
    await expect(eventList.locator('text=2팀 테오 멘토링')).not.toBeVisible();

    // 검색어 변경
    await page.fill('input[placeholder="검색어를 입력하세요"]', 'ZEP');
    await page.waitForTimeout(300);

    // 위치에 'ZEP' 포함된 일정만 표시
    await expect(eventList.locator('text=항해 과제 제출하기')).not.toBeVisible();
    await expect(eventList.locator('text=2팀 테오 멘토링')).toBeVisible();

    // 검색어 삭제
    await page.fill('input[placeholder="검색어를 입력하세요"]', '');
    await page.waitForTimeout(300);

    // 모든 일정 다시 표시
    await expect(eventList.locator('text=항해 과제 제출하기')).toBeVisible();
    await expect(eventList.locator('text=2팀 테오 멘토링')).toBeVisible();
  });

  test('뷰 전환 시 검색 필터링', async ({ page }) => {
    // 오늘 일정 생성
    await page.fill('input[placeholder="제목"]', '오늘 일정');
    await page.fill('input[placeholder="날짜"]', getTodayDate());
    await page.fill('input[placeholder="시작 시간"]', '09:00');
    await page.fill('input[placeholder="종료 시간"]', '10:00');
    await page.click('button:has-text("일정 추가")');
    await page.waitForTimeout(300);

    // 이번 달이지만 이번 주가 아닌 날 일정 생성
    const targetDateStr = getOtherWeekInMonth();
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const isNextMonth = nextWeek.getMonth() !== today.getMonth();
    const targetTitle = isNextMonth ? '지난주 일정' : '다음주 일정';

    await page.fill('input[placeholder="제목"]', targetTitle);
    await page.fill('input[placeholder="날짜"]', targetDateStr);
    await page.fill('input[placeholder="시작 시간"]', '14:00');
    await page.fill('input[placeholder="종료 시간"]', '15:00');
    await page.click('button:has-text("일정 추가")');
    await page.waitForTimeout(300);

    // 월간 뷰에서 검색
    await page.fill('input[placeholder="검색어를 입력하세요"]', '일정');
    await page.waitForTimeout(300);

    const eventList = page.locator('[data-testid="event-list"]');

    // 월간 뷰: 이번 달 일정 모두 표시
    await expect(eventList.locator('text=오늘 일정')).toBeVisible();
    await expect(eventList.locator(`text=${targetTitle}`)).toBeVisible();

    // 주간 뷰로 전환
    const viewSelector = page.locator('[aria-label="뷰 타입 선택"]');
    await viewSelector.click();
    await page.click('[aria-label="week-option"]');
    await page.waitForTimeout(300);

    // 주간 뷰: 이번 주 일정만 표시
    await expect(eventList.locator('text=오늘 일정')).toBeVisible();
    await expect(eventList.locator(`text=${targetTitle}`)).not.toBeVisible();
  });
});
