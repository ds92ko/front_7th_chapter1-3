import { Event } from '@/types.ts';

/**
 * 주어진 년도와 월의 일수를 반환합니다.
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * 주어진 날짜가 속한 주의 모든 날짜를 반환합니다.
 */
export function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const diff = date.getDate() - day;
  const sunday = new Date(date.setDate(diff));
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(sunday);
    nextDate.setDate(sunday.getDate() + i);
    weekDates.push(nextDate);
  }
  return weekDates;
}

/**
 * 주어진 날짜가 속한 달의 주차별 날짜 배열을 반환합니다.
 */
export function getWeeksAtMonth(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month + 1);
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weeks = [];

  const initWeek = () => Array(7).fill(null);

  let week: Array<number | null> = initWeek();

  for (let i = 0; i < firstDayOfMonth; i++) {
    week[i] = null;
  }

  for (const day of days) {
    const dayIndex = (firstDayOfMonth + day - 1) % 7;
    week[dayIndex] = day;
    if (dayIndex === 6 || day === daysInMonth) {
      weeks.push(week);
      week = initWeek();
    }
  }

  return weeks;
}

/**
 * 주어진 날짜에 해당하는 일정을 반환합니다.
 */
export function getEventsForDay(events: Event[], date: number): Event[] {
  return events.filter((event) => new Date(event.date).getDate() === date);
}

/**
 * 주어진 날짜가 속한 주의 연도, 월, 주차 정보를 "YYYY년 M월 W주" 형식으로 반환합니다.
 */
export function formatWeek(targetDate: Date) {
  const dayOfWeek = targetDate.getDay();
  const diffToThursday = 4 - dayOfWeek;
  const thursday = new Date(targetDate);
  thursday.setDate(targetDate.getDate() + diffToThursday);

  const year = thursday.getFullYear();
  const month = thursday.getMonth() + 1;

  const firstDayOfMonth = new Date(thursday.getFullYear(), thursday.getMonth(), 1);

  const firstThursday = new Date(firstDayOfMonth);
  firstThursday.setDate(1 + ((4 - firstDayOfMonth.getDay() + 7) % 7));

  const weekNumber: number =
    Math.floor((thursday.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  return `${year}년 ${month}월 ${weekNumber}주`;
}

/**
 * 주어진 날짜의 월 정보를 "YYYY년 M월" 형식으로 반환합니다.
 */
export function formatMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}

const stripTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * 주어진 날짜가 특정 범위 내에 있는지 확인합니다.
 */
export function isDateInRange(date: Date, rangeStart: Date, rangeEnd: Date): boolean {
  const normalizedDate = stripTime(date);
  const normalizedStart = stripTime(rangeStart);
  const normalizedEnd = stripTime(rangeEnd);

  return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
}

/**
 * 숫자를 지정된 자릿수만큼 0으로 채운 문자열로 반환합니다.
 */
export function fillZero(value: number, size = 2) {
  return String(value).padStart(size, '0');
}

/**
 * 주어진 날짜를 "YYYY-MM-DD" 형식으로 반환합니다.
 */
export function formatDate(currentDate: Date, day?: number) {
  return [
    currentDate.getFullYear(),
    fillZero(currentDate.getMonth() + 1),
    fillZero(day ?? currentDate.getDate()),
  ].join('-');
}

/**
 * 오늘 날짜를 "YYYY-MM-DD" 형식으로 반환합니다.
 * E2E 테스트에서 사용되는 함수입니다.
 * @returns {string} 오늘 날짜
 */
export function getTodayDate() {
  const today = new Date();
  return formatDate(today);
}

/**
 * 오늘이 속한 주에서 오늘이 아닌 다른 날짜를 "YYYY-MM-DD" 형식으로 반환합니다.
 * E2E 테스트에서 사용되는 함수입니다.
 * @returns {string} 오늘이 아닌 이번 주의 날짜
 */
export function getOtherDateInWeek() {
  const today = new Date();
  const weekDates = getWeekDates(new Date(today));
  const targetDate = weekDates.find((date) => date.getDate() !== today.getDate());

  if (!targetDate) {
    throw new Error('오늘이 아닌 날짜를 찾을 수 없습니다.');
  }

  return formatDate(targetDate);
}

/**
 * 이번 달의 첫째주와 셋째주의 같은 요일 날짜를 "YYYY-MM-DD" 형식으로 반환합니다.
 * E2E 테스트에서 사용되는 함수입니다.
 * @returns {[string, string]} [첫째주 날짜, 셋째주 같은 요일]
 */
export function getFirstAndThirdWeekDate(): [string, string] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstWeekDate = new Date(year, month, 1);

  const thirdWeekDate = new Date(firstWeekDate);
  thirdWeekDate.setDate(firstWeekDate.getDate() + 14);

  return [formatDate(firstWeekDate), formatDate(thirdWeekDate)];
}

/**
 * 이번 주의 월요일과 금요일을 "YYYY-MM-DD" 형식으로 반환합니다.
 * E2E 테스트에서 사용되는 함수입니다.
 * @returns {[string, string]} [이번 주 월요일, 이번 주 금요일]
 */
export function getMondayAndFriday(): [string, string] {
  const today = new Date();
  const weekDates = getWeekDates(new Date(today));

  // 일요일(0)부터 시작하므로 월요일은 인덱스 1, 금요일은 인덱스 5
  const monday = weekDates[1];
  const friday = weekDates[5];

  return [formatDate(monday), formatDate(friday)];
}
