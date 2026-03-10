export const BEIJING_TIME_ZONE = 'Asia/Shanghai';

export type BeijingDateParts = {
  year: number;
  month: number;
  day: number;
};

function toNumberPart(parts: Intl.DateTimeFormatPart[], type: 'year' | 'month' | 'day'): number {
  const target = parts.find((part) => part.type === type)?.value;
  return Number(target ?? '0');
}

export function getBeijingDateParts(date: Date = new Date()): BeijingDateParts {
  const formatter = new Intl.DateTimeFormat('zh-CN', {
    timeZone: BEIJING_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  return {
    year: toNumberPart(parts, 'year'),
    month: toNumberPart(parts, 'month'),
    day: toNumberPart(parts, 'day'),
  };
}

export function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getCurrentBeijingDate(): string {
  const parts = getBeijingDateParts();
  return formatDateKey(parts.year, parts.month, parts.day);
}

export function getBeijingDateFrom(date: Date): string {
  const parts = getBeijingDateParts(date);
  return formatDateKey(parts.year, parts.month, parts.day);
}

export function shiftDateString(dateString: string, offsetDays: number): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const utcTime = Date.UTC(year, month - 1, day + offsetDays);
  const shifted = new Date(utcTime);
  return formatDateKey(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, shifted.getUTCDate());
}

export function formatDateText(dateString?: string): string {
  if (!dateString) {
    return '未设置日期';
  }

  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) {
    return dateString;
  }

  return `${year}年${month}月${day}日`;
}

export function formatBeijingNow(now: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: BEIJING_TIME_ZONE,
    dateStyle: 'full',
    timeStyle: 'medium',
    hour12: false,
  }).format(now);
}

export function getMonthDays(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function getWeekday(year: number, month: number, day: number): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}
