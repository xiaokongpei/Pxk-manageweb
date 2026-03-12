import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { type Employee, type Task } from '../types';
import {
  formatBeijingNow,
  formatDateKey,
  formatDateText,
  getBeijingDateFrom,
  getCurrentBeijingDate,
  getMonthDays,
  getWeekday,
} from '../utils/beijingTime';

interface WorkCalendarProps {
  tasks: Task[];
  employeesById: Map<string, Employee>;
  motionProgress?: number;
}

const weekLabels = ['一', '二', '三', '四', '五', '六', '日'];

function normalizeWeekday(weekday: number): number {
  return weekday === 0 ? 6 : weekday - 1;
}

function normalizeTaskDate(value: unknown, fallbackDate: string): string {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }
  return fallbackDate;
}

function normalizeAssigneeIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

export function WorkCalendar({ tasks, employeesById, motionProgress = 0 }: WorkCalendarProps) {
  const [now, setNow] = useState(() => new Date());
  const beijingToday = getBeijingDateFrom(now);

  const [viewMonth, setViewMonth] = useState(() => beijingToday.slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(() => beijingToday);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const [viewYear, viewMonthNumber] = viewMonth.split('-').map(Number);
  const firstWeekday = normalizeWeekday(getWeekday(viewYear, viewMonthNumber, 1));
  const totalDays = getMonthDays(viewYear, viewMonthNumber);

  const tasksByDate = useMemo(() => {
    const grouped = new Map<string, Task[]>();
    const fallbackDate = getCurrentBeijingDate();

    tasks.forEach((task) => {
      const dateKey = normalizeTaskDate(task?.date, fallbackDate);

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)?.push(task);
    });

    grouped.forEach((records) => {
      records.sort((left, right) => {
        const leftKey = `${left.time || '99:99'}-${left.name}`;
        const rightKey = `${right.time || '99:99'}-${right.name}`;
        return leftKey.localeCompare(rightKey, 'zh-CN');
      });
    });

    return grouped;
  }, [tasks]);

  const selectedTasks = tasksByDate.get(selectedDate) ?? [];
  const monthTaskCount = useMemo(() => {
    return tasks.reduce((count, task) => {
      const dateKey = normalizeTaskDate(task?.date, getCurrentBeijingDate());
      return dateKey.startsWith(`${viewMonth}-`) ? count + 1 : count;
    }, 0);
  }, [tasks, viewMonth]);

  const monthCells = useMemo(() => {
    const cells: Array<{ key: string; day: number | null; dateKey: string | null }> = [];

    for (let index = 0; index < firstWeekday; index += 1) {
      cells.push({ key: `empty-${index}`, day: null, dateKey: null });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const dateKey = formatDateKey(viewYear, viewMonthNumber, day);
      cells.push({ key: dateKey, day, dateKey });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ key: `tail-${cells.length}`, day: null, dateKey: null });
    }

    return cells;
  }, [firstWeekday, totalDays, viewMonthNumber, viewYear]);

  const goPrevMonth = () => {
    let nextYear = viewYear;
    let nextMonth = viewMonthNumber - 1;

    if (nextMonth < 1) {
      nextMonth = 12;
      nextYear -= 1;
    }

    setViewMonth(`${nextYear}-${String(nextMonth).padStart(2, '0')}`);
  };

  const goNextMonth = () => {
    let nextYear = viewYear;
    let nextMonth = viewMonthNumber + 1;

    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }

    setViewMonth(`${nextYear}-${String(nextMonth).padStart(2, '0')}`);
  };

  const goToday = () => {
    setViewMonth(beijingToday.slice(0, 7));
    setSelectedDate(beijingToday);
  };

  const panelStyle = {
    '--panel-progress': `${motionProgress}`,
    transform: `translateY(${18 - motionProgress * 18}px) scale(${0.985 + motionProgress * 0.015})`,
  } as CSSProperties;

  const detailStyle = {
    transform: `translateY(${24 - motionProgress * 24}px)`,
    opacity: 0.72 + motionProgress * 0.28,
  } as CSSProperties;

  return (
    <section
      className="calendar-stage glass-panel relative flex h-full min-h-[480px] flex-col overflow-hidden p-3 sm:min-h-[560px] sm:p-4 md:min-h-[620px] md:p-5 lg:min-h-[720px] lg:min-h-[760px]"
      style={panelStyle}
    >
      <div className="calendar-stage-glow calendar-stage-glow-a" />
      <div className="calendar-stage-glow calendar-stage-glow-b" />

      <div className="relative z-10 mb-2.5 flex flex-wrap items-start justify-between gap-2 sm:mb-3 sm:gap-3">
        <div>
          <p className="section-kicker hidden sm:inline-flex">日历视图</p>
          <h2 className="heading-font text-base font-bold text-slate-900 sm:text-lg">工作日历（北京时间）</h2>
          <p className="text-[11px] text-slate-500 sm:text-xs">{formatBeijingNow(now)}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold sm:mt-2 sm:gap-2 sm:text-[11px]">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-700 sm:px-2 sm:py-1">
              本月 {monthTaskCount}
            </span>
            <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-sky-700 sm:px-2 sm:py-1">
              {formatDateText(selectedDate)}
            </span>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto sm:gap-2">
          <button
            type="button"
            onClick={goPrevMonth}
            className="min-h-[32px] rounded-lg border border-slate-300 bg-white/70 px-2.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 sm:px-3 sm:text-xs"
          >
            上月
          </button>
          <span className="text-[12px] font-semibold text-slate-700 sm:text-sm">{viewYear}年{viewMonthNumber}月</span>
          <button
            type="button"
            onClick={goNextMonth}
            className="min-h-[32px] rounded-lg border border-slate-300 bg-white/70 px-2.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 sm:px-3 sm:text-xs"
          >
            下月
          </button>
          <button
            type="button"
            onClick={goToday}
            className="min-h-[32px] rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:px-3 sm:text-xs"
          >
            今天
          </button>
        </div>
      </div>

      {/* 日历主体 - 移动端优化 */}
      <div className="mobile-scroll relative z-10 flex-1 overflow-x-auto pb-1 sm:pb-2">
        <div className="min-w-0 w-full">
          <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold text-slate-500 sm:gap-1 sm:text-[11px] lg:gap-1.5 lg:text-xs">
            {weekLabels.map((label) => (
              <div key={label} className="py-1">{label}</div>
            ))}
          </div>

          <div className="mt-1.5 grid grid-cols-7 gap-0.5 sm:mt-2 sm:gap-1 lg:gap-1.5">
            {monthCells.map((cell) => {
              if (!cell.dateKey || cell.day === null) {
                return <div key={cell.key} className="h-[52px] rounded-lg border border-transparent sm:h-[64px] sm:rounded-xl lg:h-[80px] lg:rounded-xl" />;
              }

              const dayTasks = tasksByDate.get(cell.dateKey) ?? [];
              const isToday = cell.dateKey === beijingToday;
              const isSelected = cell.dateKey === selectedDate;
              const hasTasks = dayTasks.length > 0;

              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => setSelectedDate(cell.dateKey ?? beijingToday)}
                  className={`calendar-cell h-[52px] rounded-[12px] border p-1 text-left transition duration-300 sm:h-[64px] sm:rounded-[14px] sm:p-1.5 lg:h-[80px] lg:rounded-[16px] lg:p-2 ${
                    isSelected
                      ? 'scale-[1.02] border-emerald-400 bg-gradient-to-br from-emerald-50 to-white shadow-md'
                      : hasTasks
                        ? 'border-sky-200 bg-gradient-to-br from-white to-sky-50/60 hover:border-emerald-200 hover:shadow-sm'
                        : 'border-slate-200 bg-white/85 hover:border-emerald-200 hover:shadow-sm'
                  }`}
                >
                  <div className="mb-0.5 flex items-center justify-between sm:mb-1">
                    <span className={`text-[11px] font-semibold sm:text-xs ${isToday ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {cell.day}
                    </span>
                    {dayTasks.length > 0 ? (
                      <span className="rounded-full bg-orange-100 px-1 text-[9px] font-semibold text-orange-700 sm:px-1.5 sm:text-[10px]">
                        {dayTasks.length}
                      </span>
                    ) : null}
                  </div>
                  {/* 任务预览 - 仅在较大屏幕显示 */}
                  <div className="hidden space-y-0.5 overflow-hidden sm:block">
                    {dayTasks.slice(0, 2).map((task) => (
                      <p key={task.id} className="truncate text-[10px] text-slate-600">
                        <span className="mr-0.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {task.time || '--'} {task.name}
                      </p>
                    ))}
                    {dayTasks.length > 2 ? <p className="text-[9px] text-slate-500">+{dayTasks.length - 2}</p> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 任务详情区域 */}
      <div
        className="calendar-detail-stage relative z-10 mt-2.5 flex min-h-[140px] flex-col rounded-[16px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-2.5 sm:mt-3 sm:min-h-[160px] sm:rounded-[20px] sm:p-3 lg:min-h-[200px] lg:rounded-[24px]"
        style={detailStyle}
      >
        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
          <p className="text-[13px] font-semibold text-slate-800 sm:text-sm">{formatDateText(selectedDate)} 任务</p>
          <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500 sm:px-2.5 sm:py-1 sm:text-[11px]">
            {selectedTasks.length} 项
          </span>
        </div>
        {selectedTasks.length === 0 ? (
          <div className="mt-2 flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-3 text-[13px] text-slate-500 sm:mt-3 sm:text-sm">
            当天暂无任务安排。
          </div>
        ) : (
          <ul className="mobile-scroll mt-2 grid max-h-[120px] flex-1 gap-1.5 overflow-auto pr-1 sm:mt-3 sm:max-h-[140px] sm:grid-cols-2 sm:gap-2 lg:max-h-[180px]">
            {selectedTasks.map((task) => {
              const assignedNames = normalizeAssigneeIds(task.assigneeIds)
                .map((employeeId) => employeesById.get(employeeId)?.name)
                .filter((name): name is string => Boolean(name));

              return (
                <li
                  key={task.id}
                  className="rounded-xl border border-slate-200 bg-white/95 px-2.5 py-2 text-[11px] text-slate-600 transition hover:shadow-sm sm:rounded-2xl sm:px-3 sm:py-3 sm:text-xs"
                >
                  <p className="font-semibold text-slate-800">{task.name}</p>
                  <p className="mt-0.5 sm:mt-1">时间：{task.time || '未设置'} | 地点：{task.location || '未设置'}</p>
                  <p className="mt-0.5 sm:mt-1">已安排：{assignedNames.length > 0 ? assignedNames.join('、') : '暂无'}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
