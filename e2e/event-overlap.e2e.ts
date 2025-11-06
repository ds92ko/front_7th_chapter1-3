import { expect, test } from '@playwright/test';

import { getTodayDate } from '../src/utils/dateUtils';

test.describe('일정 겹침 처리', () => {
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

  test('일정 겹침 경고: 취소', async ({ page }) => {
    // 첫 번째 일정 생성
    await page.fill('input[placeholder="제목"]', '첫 번째 일정');
    await page.fill('input[placeholder="날짜"]', getTodayDate());
    await page.fill('input[placeholder="시작 시간"]', '09:00');
    await page.fill('input[placeholder="종료 시간"]', '10:00');

    // 일정 추가 버튼 클릭
    await page.click('button:has-text("일정 추가")');

    // 두 번째 일정 생성
    await page.fill('input[placeholder="제목"]', '두 번째 일정');
    await page.fill('input[placeholder="날짜"]', getTodayDate());
    await page.fill('input[placeholder="시작 시간"]', '09:00');
    await page.fill('input[placeholder="종료 시간"]', '10:00');

    // 일정 추가 버튼 클릭
    await page.click('button:has-text("일정 추가")');
    await page.waitForTimeout(300);

    // 일정 겹침 경고 다이얼로그 확인
    const overlapDialog = page.locator('text=일정 겹침 경고');
    await expect(overlapDialog).toBeVisible();

    // 취소 버튼 클릭
    await page.click('button:has-text("취소")');

    // 일정 목록에서 두 번째 일정이 추가되지 않았는지 확인
    const eventList = page.locator('[data-testid="event-list"]');
    await expect(eventList.locator('text=두 번째 일정')).not.toBeVisible();
  });

  test('일정 겹침 경고: 계속 진행', async ({ page }) => {
    // 첫 번째 일정 생성
    await page.fill('input[placeholder="제목"]', '첫 번째 일정');
    await page.fill('input[placeholder="날짜"]', getTodayDate());
    await page.fill('input[placeholder="시작 시간"]', '09:00');
    await page.fill('input[placeholder="종료 시간"]', '10:00');

    // 일정 추가 버튼 클릭
    await page.click('button:has-text("일정 추가")');
    await page.waitForTimeout(300);

    // 두 번째 일정 생성
    await page.fill('input[placeholder="제목"]', '두 번째 일정');
    await page.fill('input[placeholder="날짜"]', getTodayDate());
    await page.fill('input[placeholder="시작 시간"]', '09:00');
    await page.fill('input[placeholder="종료 시간"]', '10:00');

    // 일정 추가 버튼 클릭
    await page.click('button:has-text("일정 추가")');

    // 일정 겹침 경고 다이얼로그 확인
    const overlapDialog = page.locator('text=일정 겹침 경고');
    await expect(overlapDialog).toBeVisible();

    // 계속 진행 버튼 클릭
    await page.click('button:has-text("계속 진행")');

    // 일정 추가 성공 알림 확인
    const successSnackbar = page.locator('text=일정이 추가되었습니다');
    await expect(successSnackbar).toBeVisible();

    // 일정 목록에서 두 번째 일정이 추가되었는지 확인
    const eventList = page.locator('[data-testid="event-list"]');
    await expect(eventList.locator('text=두 번째 일정')).toBeVisible();
  });
});
