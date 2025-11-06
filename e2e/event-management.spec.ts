import { expect, test } from '@playwright/test';

// 현재 날짜를 YYYY-MM-DD 형식으로 반환
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

test.describe('기본 일정 관리 워크플로우', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 데이터 초기화
    await page.request.post('http://localhost:8080/api/test/reset', {
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
    test('일정 생성 성공', async ({ page }) => {
      // 일정 추가 전 개수 확인
      const eventList = page.locator('[data-testid="event-list"]');
      const initialEventCount = await eventList.locator('text=항해 과제 제출하기').count();

      // 폼 데이터 입력
      await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
      await page.fill('input[placeholder="날짜"]', getTodayDate());
      await page.fill('input[placeholder="시작 시간"]', '09:00');
      await page.fill('input[placeholder="종료 시간"]', '10:00');
      await page.fill('input[placeholder="설명"]', '과제 패스 가즈아~~!');
      await page.fill('input[placeholder="위치"]', '집');
      await page.click('[aria-label="카테고리"]');
      await page.click('li[data-value="개인"]');
      await page.click('[aria-label="알림 설정"]');
      await page.click('li[data-value="60"]');

      // 일정 추가 버튼 클릭
      await page.click('button:has-text("일정 추가")');

      // 일정 겹침 경고 다이얼로그 노출 시 계속 진행 버튼 클릭
      const overlapDialog = page.locator('text=일정 겹침 경고');
      if (await overlapDialog.isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.click('button:has-text("계속 진행")');
      }

      // 일정 추가 성공 알림 확인
      const successSnackbar = page.locator('text=일정이 추가되었습니다');
      await expect(successSnackbar).toBeVisible();

      // 일정 추가 후 개수 확인
      const afterEventCount = await eventList.locator('text=항해 과제 제출하기').count();
      expect(afterEventCount).toBe(initialEventCount + 1);
    });

    test('일정 생성 실패: 필수 필드 누락', async ({ page }) => {
      // 제목만 입력
      await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');

      // 일정 추가 버튼 클릭
      await page.click('button:has-text("일정 추가")');

      // 에러 메시지 확인
      const errorSnackbar = page.locator('text=필수 정보를 모두 입력해주세요');
      await expect(errorSnackbar).toBeVisible();
    });

    test('일정 생성 실패: 시간 유효성 에러', async ({ page }) => {
      // 폼 데이터 입력
      await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
      await page.fill('input[placeholder="날짜"]', getTodayDate());
      await page.fill('input[placeholder="시작 시간"]', '10:00');
      await page.fill('input[placeholder="종료 시간"]', '09:00');

      // 시작 시간 유효성 에러 메시지 확인
      const startTimeError = page.locator('text=시작 시간은 종료 시간보다 빨라야 합니다.');
      await expect(startTimeError).toBeVisible();

      // 종료 시간 유효성 에러 메시지 확인
      const endTimeError = page.locator('text=종료 시간은 시작 시간보다 늦어야 합니다.');
      await expect(endTimeError).toBeVisible();
    });
  });

  test.describe('READ', () => {
    test('일정 조회: 월간 뷰', async ({ page }) => {
      // 월간 뷰 전환
      const viewSelector = page.locator('[aria-label="뷰 타입 선택"]');
      await viewSelector.click();
      await page.click('[aria-label="month-option"]');

      // 일정 추가 전 개수 확인
      const monthView = page.locator('[data-testid="month-view"]');
      const initialEventCount = await monthView.locator('text=항해 과제 제출하기').count();

      // 일정 생성
      await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
      await page.fill('input[placeholder="날짜"]', getTodayDate());
      await page.fill('input[placeholder="시작 시간"]', '09:00');
      await page.fill('input[placeholder="종료 시간"]', '10:00');

      // 일정 추가 버튼 클릭
      await page.click('button:has-text("일정 추가")');

      await page.waitForTimeout(300);

      // 일정 추가 후 개수 확인
      const afterEventCount = await monthView.locator('text=항해 과제 제출하기').count();
      expect(afterEventCount).toBe(initialEventCount + 1);
    });

    test('일정 조회: 주간 뷰', async ({ page }) => {
      // 주간 뷰 전환
      const viewSelector = page.locator('[aria-label="뷰 타입 선택"]');
      await viewSelector.click();
      await page.click('[aria-label="week-option"]');

      // 일정 추가 전 개수 확인
      const weekView = page.locator('[data-testid="week-view"]');
      const initialEventCount = await weekView.locator('text=항해 과제 제출하기').count();

      // 일정 생성
      await page.fill('input[placeholder="제목"]', '항해 과제 제출하기');
      await page.fill('input[placeholder="날짜"]', getTodayDate());
      await page.fill('input[placeholder="시작 시간"]', '09:00');
      await page.fill('input[placeholder="종료 시간"]', '10:00');

      // 일정 추가 버튼 클릭
      await page.click('button:has-text("일정 추가")');

      await page.waitForTimeout(300);

      // 일정 추가 후 개수 확인
      const afterEventCount = await weekView.locator('text=항해 과제 제출하기').count();
      expect(afterEventCount).toBe(initialEventCount + 1);
    });
  });
});
