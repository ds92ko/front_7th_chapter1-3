import { expect, test } from '@playwright/test';

import { getFirstAndThirdWeekDate, getMondayAndFriday } from '../src/utils/dateUtils';

test.describe('반복 일정 관리 워크플로우', () => {
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

  test.describe('CREATE', () => {
    test('일정 생성', async ({ page }) => {
      const [firstWeekDate, thirdWeekDate] = getFirstAndThirdWeekDate();

      // 일정 추가 전 개수 확인
      const eventList = page.locator('[data-testid="event-list"]');
      const initialEventCount = await eventList.locator('text=항해 과제 제출하기').count();

      // 폼 데이터 입력
      await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
      await page.fill('input[placeholder="날짜"]', firstWeekDate);
      await page.fill('input[placeholder="시작 시간"]', '09:00');
      await page.fill('input[placeholder="종료 시간"]', '10:00');
      await page.fill('input[placeholder="설명"]', '과제 패스 가즈아~~!');
      await page.fill('input[placeholder="위치"]', '집');
      await page.click('[aria-label="카테고리"]');
      await page.click('li[data-value="개인"]');
      await page.locator('text=반복 일정').click();
      await page.click('[aria-label="반복 유형"]');
      await page.click('li[aria-label="weekly-option"]');
      await page.fill('input[placeholder="반복 종료일"]', thirdWeekDate);
      await page.click('[aria-label="알림 설정"]');
      await page.click('li[data-value="60"]');

      // 일정 추가 버튼 클릭
      await page.click('button:has-text("일정 추가")');

      // 일정 추가 성공 알림 확인
      const successSnackbar = page.locator('text=일정이 추가되었습니다');
      await expect(successSnackbar).toBeVisible();

      // 일정 추가 후 개수 확인
      const afterEventCount = await eventList.locator('text=항해 과제 제출하기').count();
      expect(afterEventCount).toBe(initialEventCount + 3);
    });
  });

  test.describe('READ', () => {
    test('일정 조회: 월간 뷰', async ({ page }) => {
      const [firstWeekDate, thirdWeekDate] = getFirstAndThirdWeekDate();

      // 월간 뷰 전환
      const viewSelector = page.locator('[aria-label="뷰 타입 선택"]');
      await viewSelector.click();
      await page.click('[aria-label="month-option"]');

      // 일정 추가 전 개수 확인
      const monthView = page.locator('[data-testid="month-view"]');
      const initialEventCount = await monthView.locator('text=항해 과제 제출하기').count();

      // 일정 생성
      await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
      await page.fill('input[placeholder="날짜"]', firstWeekDate);
      await page.fill('input[placeholder="시작 시간"]', '09:00');
      await page.fill('input[placeholder="종료 시간"]', '10:00');
      await page.locator('text=반복 일정').click();
      await page.click('[aria-label="반복 유형"]');
      await page.click('li[aria-label="weekly-option"]');
      await page.fill('input[placeholder="반복 종료일"]', thirdWeekDate);

      // 일정 추가 버튼 클릭
      await page.click('button:has-text("일정 추가")');
      await page.waitForTimeout(300);

      // 일정 추가 후 개수 확인
      const afterEventCount = await monthView.locator('text=항해 과제 제출하기').count();
      expect(afterEventCount).toBe(initialEventCount + 3);
    });

    test('일정 조회: 주간 뷰', async ({ page }) => {
      const [monday, friday] = getMondayAndFriday();

      // 주간 뷰 전환
      const viewSelector = page.locator('[aria-label="뷰 타입 선택"]');
      await viewSelector.click();
      await page.click('[aria-label="week-option"]');

      // 일정 추가 전 개수 확인
      const weekView = page.locator('[data-testid="week-view"]');
      const initialEventCount = await weekView.locator('text=항해 과제 제출하기').count();

      // 일정 생성
      await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
      await page.fill('input[placeholder="날짜"]', monday);
      await page.fill('input[placeholder="시작 시간"]', '09:00');
      await page.fill('input[placeholder="종료 시간"]', '10:00');
      await page.locator('text=반복 일정').click();
      await page.click('[aria-label="반복 유형"]');
      await page.click('li[aria-label="daily-option"]');
      await page.fill('input[placeholder="반복 종료일"]', friday);

      // 일정 추가 버튼 클릭
      await page.click('button:has-text("일정 추가")');
      await page.waitForTimeout(300);

      // 일정 추가 후 개수 확인
      const afterEventCount = await weekView.locator('text=항해 과제 제출하기').count();
      expect(afterEventCount).toBe(initialEventCount + 5);
    });
  });

  test.describe('UPDATE', () => {
    test('일정 수정: 단일', async ({ page }) => {
      const [firstWeekDate, thirdWeekDate] = getFirstAndThirdWeekDate();

      // 일정 생성
      await page.fill('input[placeholder="제목"]', '수정 전 일정');
      await page.fill('input[placeholder="날짜"]', firstWeekDate);
      await page.fill('input[placeholder="시작 시간"]', '10:00');
      await page.fill('input[placeholder="종료 시간"]', '11:00');
      await page.fill('input[placeholder="설명"]', '수정 전 설명');
      await page.fill('input[placeholder="위치"]', '수정 전 위치');
      await page.click('[aria-label="카테고리"]');
      await page.click('li[data-value="개인"]');
      await page.locator('text=반복 일정').click();
      await page.click('[aria-label="반복 유형"]');
      await page.click('li[aria-label="weekly-option"]');
      await page.fill('input[placeholder="반복 종료일"]', thirdWeekDate);
      await page.click('[aria-label="알림 설정"]');
      await page.click('li[data-value="60"]');

      // 일정 추가 버튼 클릭
      await page.click('button:has-text("일정 추가")');

      // 첫 번째 일정 수정 버튼 클릭
      await page.locator('button[aria-label="Edit event"]').first().click();

      // 반복 일정 수정 다이얼로그 확인
      const recurringDialog = page.locator('text=해당 일정만 수정하시겠어요?');
      await expect(recurringDialog).toBeVisible();

      // 예 버튼 클릭
      await page.click('button:has-text("예")');

      // 모든 필드 수정
      await page.fill('input[placeholder="제목"]', '수정 후 일정');
      await page.fill('input[placeholder="시작 시간"]', '12:00');
      await page.fill('input[placeholder="종료 시간"]', '13:00');
      await page.fill('input[placeholder="설명"]', '수정 후 설명');
      await page.fill('input[placeholder="위치"]', '수정 후 위치');
      await page.click('[aria-label="카테고리"]');
      await page.click('li[data-value="기타"]');
      await page.click('[aria-label="알림 설정"]');
      await page.click('li[data-value="120"]');

      // 일정 수정 버튼 클릭
      await page.click('button:has-text("일정 수정")');
      await page.waitForTimeout(300);

      const eventList = page.locator('[data-testid="event-list"]');

      // 수정 후 일정 확인
      await expect(eventList.locator('text=수정 후 일정')).toBeVisible();
      await expect(eventList.locator('text=12:00 - 13:00')).toBeVisible();
      await expect(eventList.locator('text=수정 후 설명')).toBeVisible();
      await expect(eventList.locator('text=수정 후 위치')).toBeVisible();
      await expect(eventList.locator('text=카테고리: 기타')).toBeVisible();
      await expect(eventList.locator('text=알림: 2시간 전')).toBeVisible();
    });

    test('일정 수정: 일괄', async ({ page }) => {
      const [firstWeekDate, thirdWeekDate] = getFirstAndThirdWeekDate();

      // 일정 생성
      await page.fill('input[placeholder="제목"]', '수정 전 일정');
      await page.fill('input[placeholder="날짜"]', firstWeekDate);
      await page.fill('input[placeholder="시작 시간"]', '10:00');
      await page.fill('input[placeholder="종료 시간"]', '11:00');
      await page.fill('input[placeholder="설명"]', '수정 전 설명');
      await page.fill('input[placeholder="위치"]', '수정 전 위치');
      await page.click('[aria-label="카테고리"]');
      await page.click('li[data-value="개인"]');
      await page.locator('text=반복 일정').click();
      await page.click('[aria-label="반복 유형"]');
      await page.click('li[aria-label="weekly-option"]');
      await page.fill('input[placeholder="반복 종료일"]', thirdWeekDate);
      await page.click('[aria-label="알림 설정"]');
      await page.click('li[data-value="60"]');

      // 일정 추가 버튼 클릭
      await page.click('button:has-text("일정 추가")');

      // 첫 번째 일정 수정 버튼 클릭
      await page.locator('button[aria-label="Edit event"]').first().click();

      // 반복 일정 수정 다이얼로그 확인
      const recurringDialog = page.locator('text=해당 일정만 수정하시겠어요?');
      await expect(recurringDialog).toBeVisible();

      // 아니오 버튼 클릭
      await page.click('button:has-text("아니오")');

      // 모든 필드 수정
      await page.fill('input[placeholder="제목"]', '수정 후 일정');
      await page.fill('input[placeholder="시작 시간"]', '12:00');
      await page.fill('input[placeholder="종료 시간"]', '13:00');
      await page.fill('input[placeholder="설명"]', '수정 후 설명');
      await page.fill('input[placeholder="위치"]', '수정 후 위치');
      await page.click('[aria-label="카테고리"]');
      await page.click('li[data-value="기타"]');
      await page.click('[aria-label="알림 설정"]');
      await page.click('li[data-value="120"]');

      // 일정 수정 버튼 클릭
      await page.click('button:has-text("일정 수정")');
      await page.waitForTimeout(300);

      const eventList = page.locator('[data-testid="event-list"]');

      // 수정 후 일정 확인
      expect(await eventList.locator('text=수정 후 일정').count()).toBe(3);
      expect(await eventList.locator('text=12:00 - 13:00').count()).toBe(3);
      expect(await eventList.locator('text=수정 후 설명').count()).toBe(3);
      expect(await eventList.locator('text=수정 후 위치').count()).toBe(3);
      expect(await eventList.locator('text=카테고리: 기타').count()).toBe(3);
      expect(await eventList.locator('text=알림: 2시간 전').count()).toBe(3);
    });
  });

  test.describe('DELETE', () => {
    test('일정 삭제: 단일', async ({ page }) => {
      const [firstWeekDate, thirdWeekDate] = getFirstAndThirdWeekDate();

      // 폼 데이터 입력
      await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
      await page.fill('input[placeholder="날짜"]', firstWeekDate);
      await page.fill('input[placeholder="시작 시간"]', '09:00');
      await page.fill('input[placeholder="종료 시간"]', '10:00');
      await page.fill('input[placeholder="설명"]', '과제 패스 가즈아~~!');
      await page.fill('input[placeholder="위치"]', '집');
      await page.click('[aria-label="카테고리"]');
      await page.click('li[data-value="개인"]');
      await page.locator('text=반복 일정').click();
      await page.click('[aria-label="반복 유형"]');
      await page.click('li[aria-label="weekly-option"]');
      await page.fill('input[placeholder="반복 종료일"]', thirdWeekDate);
      await page.click('[aria-label="알림 설정"]');
      await page.click('li[data-value="60"]');

      // 일정 추가 버튼 클릭
      await page.click('button:has-text("일정 추가")');

      // 첫 번째 일정 삭제 버튼 클릭
      await page.locator('button[aria-label="Delete event"]').first().click();

      // 반복 일정 삭제 다이얼로그 확인
      const recurringDialog = page.locator('text=해당 일정만 삭제하시겠어요?');
      await expect(recurringDialog).toBeVisible();

      // 예 버튼 클릭
      await page.click('button:has-text("예")');

      // 일정 삭제 성공 알림 확인
      const successSnackbar = page.locator('text=일정이 삭제되었습니다');
      await expect(successSnackbar).toBeVisible();

      // 일정 삭제 후 개수 확인
      const eventList = page.locator('[data-testid="event-list"]');
      expect(await eventList.locator('text=항해 과제 제출하기').count()).toBe(2);
    });

    test('일정 삭제: 일괄', async ({ page }) => {
      const [firstWeekDate, thirdWeekDate] = getFirstAndThirdWeekDate();

      // 폼 데이터 입력
      await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
      await page.fill('input[placeholder="날짜"]', firstWeekDate);
      await page.fill('input[placeholder="시작 시간"]', '09:00');
      await page.fill('input[placeholder="종료 시간"]', '10:00');
      await page.fill('input[placeholder="설명"]', '과제 패스 가즈아~~!');
      await page.fill('input[placeholder="위치"]', '집');
      await page.click('[aria-label="카테고리"]');
      await page.click('li[data-value="개인"]');
      await page.locator('text=반복 일정').click();
      await page.click('[aria-label="반복 유형"]');
      await page.click('li[aria-label="weekly-option"]');
      await page.fill('input[placeholder="반복 종료일"]', thirdWeekDate);
      await page.click('[aria-label="알림 설정"]');
      await page.click('li[data-value="60"]');

      // 일정 추가 버튼 클릭
      await page.click('button:has-text("일정 추가")');

      // 첫 번째 일정 삭제 버튼 클릭
      await page.locator('button[aria-label="Delete event"]').first().click();

      // 반복 일정 삭제 다이얼로그 확인
      const recurringDialog = page.locator('text=해당 일정만 삭제하시겠어요?');
      await expect(recurringDialog).toBeVisible();

      // 아니오 버튼 클릭
      await page.click('button:has-text("아니오")');

      // 일정 삭제 성공 알림 확인
      const successSnackbar = page.locator('text=일정이 삭제되었습니다');
      await expect(successSnackbar).toBeVisible();

      // 일정 삭제 후 개수 확인
      const eventList = page.locator('[data-testid="event-list"]');
      await expect(eventList.locator('text=항해 과제 제출하기')).not.toBeVisible();
    });
  });
});
