import { useEffect, useMemo, useState } from 'react';
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

export function WorkCalendar({ tasks, employeesById }: WorkCalendarProps) {
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

  return (
    <section className="glass-panel p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="heading-font text-lg font-bold text-slate-900">工作日历（北京时间）</h2>
          <p className="text-xs text-slate-500">{formatBeijingNow(now)}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700">
              本月任务 {monthTaskCount}
            </span>
            <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-sky-700">
              当前选中 {formatDateText(selectedDate)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrevMonth}
            className="rounded-lg border border-slate-300 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            上月
          </button>
          <span className="text-sm font-semibold text-slate-700">{viewYear}年{viewMonthNumber}月</span>
          <button
            type="button"
            onClick={goNextMonth}
            className="rounded-lg border border-slate-300 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            下月
          </button>
          <button
            type="button"
            onClick={goToday}
            className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-100"
          >
            回到今天
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">
        {weekLabels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {monthCells.map((cell) => {
          if (!cell.dateKey || cell.day === null) {
            return <div key={cell.key} className="h-24 rounded-xl border border-transparent" />;
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
              className={`h-24 rounded-xl border p-2 text-left transition duration-200 ${
                isSelected
                  ? 'scale-[1.02] border-emerald-400 bg-gradient-to-br from-emerald-50 to-white shadow-md'
                  : hasTasks
                    ? 'border-sky-200 bg-gradient-to-br from-white to-sky-50/60 hover:-translate-y-0.5 hover:shadow-md'
                    : 'border-slate-200 bg-white/85 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-sm'
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className={`text-xs font-semibold ${isToday ? 'text-emerald-700' : 'text-slate-700'}`}>
                  {cell.day}
                </span>
                {dayTasks.length > 0 ? (
                  <span className="rounded-full bg-orange-100 px-1.5 text-[10px] font-semibold text-orange-700">
                    {dayTasks.length}
                  </span>
                ) : null}
              </div>
              <div className="space-y-1 overflow-hidden">
                {dayTasks.slice(0, 2).map((task) => (
                  <p key={task.id} className="truncate text-[10px] text-slate-600">
                    <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {task.time || '--:--'} {task.name}
                  </p>
                ))}
                {dayTasks.length > 2 ? <p className="text-[10px] text-slate-500">更多 {dayTasks.length - 2} 项...</p> : null}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3">
        <p className="text-sm font-semibold text-slate-800">{formatDateText(selectedDate)} 任务详情</p>
        {selectedTasks.length === 0 ? (
          <p className="mt-2 text-xs text-slate-500">当天暂无任务安排。</p>
        ) : (
          <ul className="mt-2 max-h-44 space-y-2 overflow-auto pr-1">
            {selectedTasks.map((task) => {
              const assignedNames = normalizeAssigneeIds(task.assigneeIds)
                .map((employeeId) => employeesById.get(employeeId)?.name)
                .filter((name): name is string => Boolean(name));

              return (
                <li
                  key={task.id}
                  className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs text-slate-600 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <p className="font-semibold text-slate-800">{task.name}</p>
                  <p className="mt-1">时间：{task.time || '未设置'} | 地点：{task.location || '未设置'}</p>
                  <p className="mt-1">已安排：{assignedNames.length > 0 ? assignedNames.join('、') : '暂无'}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
