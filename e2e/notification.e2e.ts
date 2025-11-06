import { expect, test } from '@playwright/test';

import { getTodayDate } from '../src/utils/dateUtils';

// 현재 시간 기준 N분 후의 시작/종료 시간을 HH:MM 형식으로 반환
const getTimeAfterMinutes = (minutes: number) => {
  const now = new Date();
  const startTime = new Date(now.getTime() + minutes * 60 * 1000);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

  const startTimeStr = `${String(startTime.getHours()).padStart(2, '0')}:${String(
    startTime.getMinutes()
  ).padStart(2, '0')}`;
  const endTimeStr = `${String(endTime.getHours()).padStart(2, '0')}:${String(
    endTime.getMinutes()
  ).padStart(2, '0')}`;

  return { startTimeStr, endTimeStr };
};

test.describe('알림 시스템', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 데이터 초기화
    await page.request.post('/api/test/reset', {
      headers: {
        'x-worker-id': process.env.TEST_PARALLEL_INDEX || '0',
      },
    });
    // 개발 서버로 이동
    await page.goto('/');
    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');
  });

  test('알림 노출 및 닫기', async ({ page }) => {
    const { startTimeStr, endTimeStr } = getTimeAfterMinutes(10);

    // 일정 생성
    await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
    await page.fill('input[placeholder="날짜"]', getTodayDate());
    await page.fill('input[placeholder="시작 시간"]', startTimeStr);
    await page.fill('input[placeholder="종료 시간"]', endTimeStr);
    await page.click('[aria-label="알림 설정"]');
    await page.click('li[data-value="10"]');
    await page.click('button:has-text("일정 추가")');
    await page.waitForTimeout(300);

    // 알림이 표시될 때까지 대기
    const notification = page.locator('text=10분 후 항해 과제 제출하기 일정이 시작됩니다.');
    await expect(notification).toBeVisible({ timeout: 2000 });

    // 알림 닫기 버튼 클릭
    const closeButton = page
      .locator('button:has(svg)')
      .filter({ has: page.locator('svg') })
      .last();
    await closeButton.click();

    // 알림이 사라졌는지 확인
    await expect(notification).not.toBeVisible();
  });

  test('알림 아이콘 표시', async ({ page }) => {
    const { startTimeStr, endTimeStr } = getTimeAfterMinutes(10);

    // 알림이 설정된 일정 생성
    await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
    await page.fill('input[placeholder="날짜"]', getTodayDate());
    await page.fill('input[placeholder="시작 시간"]', startTimeStr);
    await page.fill('input[placeholder="종료 시간"]', endTimeStr);
    await page.click('[aria-label="알림 설정"]');
    await page.click('li[data-value="10"]');
    await page.click('button:has-text("일정 추가")');
    await page.waitForTimeout(300);

    // 월간 뷰에서 알림 아이콘 확인
    const monthView = page.locator('[data-testid="month-view"]');
    const eventCard = monthView.locator('text=항해 과제 제출하기').locator('..');
    const monthViewIcon = eventCard.locator('svg[data-testid="NotificationsIcon"]');
    await expect(monthViewIcon).toBeVisible();

    // 이벤트 목록에서 알림 아이콘 확인
    const eventList = page.locator('[data-testid="event-list"]');
    const eventItem = eventList.locator('text=항해 과제 제출하기').locator('..');
    const eventListIcon = eventItem.locator('svg[data-testid="NotificationsIcon"]');
    await expect(eventListIcon).toBeVisible();
  });
});
