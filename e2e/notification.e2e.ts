import { expect, test } from '@playwright/test';

test.describe('알림 시스템', () => {
  test.beforeEach(async ({ page }) => {
    const res = await page.request.post('/api/test/reset', {
      headers: { 'x-worker-id': process.env.TEST_PARALLEL_INDEX || '0' },
    });
    expect(res.ok()).toBeTruthy();

    const fixedTime = new Date('2025-10-15T09:50:00');
    await page.clock.install({ time: fixedTime });
    await page.clock.setFixedTime(fixedTime);

    await page.goto('/');
  });

  test('알림 노출 및 닫기', async ({ page }) => {
    const startTimeStr = '10:00';
    const endTimeStr = '11:00';

    // 일정 생성
    await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
    await page.fill('input[placeholder="날짜"]', '2025-10-15');
    await page.fill('input[placeholder="시작 시간"]', startTimeStr);
    await page.fill('input[placeholder="종료 시간"]', endTimeStr);
    await page.click('[aria-label="알림 설정"]');
    await page.click('li[data-value="10"]');
    await page.click('button:has-text("일정 추가")');

    // 일정이 서버에 저장되고 events가 업데이트될 때까지 대기
    await page.waitForTimeout(500);

    // 알림이 표시될 때까지 대기
    await page.clock.runFor(1000);

    const notification = page.locator('text=10분 후 항해 과제 제출하기 일정이 시작됩니다.');
    await expect(notification).toBeVisible({ timeout: 3000 });

    // 알림 닫기 버튼 클릭
    // notification은 AlertTitle이므로, 부모 Alert 컴포넌트에서 button 찾기
    const alertContainer = notification.locator('..').locator('..'); // AlertTitle -> Alert-content -> Alert
    const closeButton = alertContainer.locator('button').last(); // Alert의 action에 있는 버튼
    await expect(closeButton).toBeVisible({ timeout: 1000 });
    await closeButton.click();

    // 알림이 사라졌는지 확인
    await expect(notification).toBeHidden();
  });

  test('알림 아이콘 표시', async ({ page }) => {
    const startTimeStr = '10:00';
    const endTimeStr = '11:00';

    // 알림이 설정된 일정 생성
    await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
    await page.fill('input[placeholder="날짜"]', '2025-10-15');
    await page.fill('input[placeholder="시작 시간"]', startTimeStr);
    await page.fill('input[placeholder="종료 시간"]', endTimeStr);
    await page.click('[aria-label="알림 설정"]');
    await page.click('li[data-value="10"]');
    await page.click('button:has-text("일정 추가")');

    // 일정이 서버에 저장되고 events가 업데이트될 때까지 대기
    await page.waitForTimeout(500);

    // 알림이 표시될 때까지 대기
    await page.clock.runFor(1000);

    const notification = page.locator('text=10분 후 항해 과제 제출하기 일정이 시작됩니다.');
    await expect(notification).toBeVisible({ timeout: 3000 });

    // 월간 뷰에서 알림 아이콘 확인
    const monthView = page.locator('[data-testid="month-view"]');
    // EventCard 내에서 제목 텍스트가 포함된 요소에서 제목 앞에 있는 svg (Notifications 아이콘) 찾기
    const eventCardWithTitle = monthView.locator('text=항해 과제 제출하기');
    // 제목과 같은 Stack에 있는 svg를 찾기 위해 부모 Stack에서 svg 찾기
    const monthViewIcon = eventCardWithTitle.locator('..').locator('svg').first();
    await expect(monthViewIcon).toBeVisible({ timeout: 2000 });

    // 이벤트 목록에서 알림 아이콘 확인
    const eventList = page.locator('[data-testid="event-list"]');
    // 이벤트 아이템 내에서 제목과 같은 Stack에 있는 svg (Notifications 아이콘) 찾기
    const eventItemWithTitle = eventList.locator('text=항해 과제 제출하기');
    const eventListIcon = eventItemWithTitle.locator('..').locator('svg').first();
    await expect(eventListIcon).toBeVisible({ timeout: 2000 });
  });
});
