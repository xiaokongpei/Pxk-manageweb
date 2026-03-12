import { useMemo, type CSSProperties } from 'react';
import { type Employee, type Task } from '../types';
import { formatDateText } from '../utils/beijingTime';

export interface WorkStatsProps {
  employees: Employee[];
  tasks: Task[];
}

export type SortMode = 'code' | 'count';

type EmployeeRecord = {
  id: string;
  employeeCode: string;
  name: string;
  contact: string;
  count: number;
  records: Task[];
};

interface WorkStatsChartProps extends WorkStatsProps {
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
  motionProgress?: number;
}

interface WorkDetailsGridProps extends WorkStatsProps {
  sortMode: SortMode;
}

function sortTasksForRecord(left: Task, right: Task): number {
  const leftKey = `${left.date} ${left.time || '99:99'}`;
  const rightKey = `${right.date} ${right.time || '99:99'}`;
  return rightKey.localeCompare(leftKey);
}

function normalizeAssigneeIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function compareEmployeeCode(left: string, right: string): number {
  if (!left && !right) {
    return 0;
  }
  if (!left) {
    return 1;
  }
  if (!right) {
    return -1;
  }

  return left.localeCompare(right, 'zh-CN', { numeric: true, sensitivity: 'base' });
}

function buildEmployeeStats(employees: Employee[], tasks: Task[]): EmployeeRecord[] {
  return employees.map((employee) => {
    const records = tasks
      .filter((task) => normalizeAssigneeIds(task.assigneeIds).includes(employee.id))
      .sort(sortTasksForRecord);

    return {
      id: employee.id,
      employeeCode: employee.employeeCode,
      name: employee.name,
      contact: employee.contact,
      count: records.length,
      records,
    };
  });
}

function orderEmployeeStats(stats: EmployeeRecord[], sortMode: SortMode): EmployeeRecord[] {
  const cloned = [...stats];

  if (sortMode === 'count') {
    return cloned.sort((left, right) => {
      if (left.count !== right.count) {
        return right.count - left.count;
      }

      const codeDiff = compareEmployeeCode(left.employeeCode, right.employeeCode);
      if (codeDiff !== 0) {
        return codeDiff;
      }

      return left.name.localeCompare(right.name, 'zh-CN');
    });
  }

  return cloned.sort((left, right) => {
    const codeDiff = compareEmployeeCode(left.employeeCode, right.employeeCode);
    if (codeDiff !== 0) {
      return codeDiff;
    }

    return left.name.localeCompare(right.name, 'zh-CN');
  });
}

export function WorkStatsChart({ employees, tasks, sortMode, onSortChange, motionProgress = 0 }: WorkStatsChartProps) {
  const stats = useMemo(() => buildEmployeeStats(employees, tasks), [employees, tasks]);
  const orderedStats = useMemo(() => orderEmployeeStats(stats, sortMode), [sortMode, stats]);

  const totalAssignments = useMemo(() => stats.reduce((sum, item) => sum + item.count, 0), [stats]);
  const activeEmployees = useMemo(() => stats.filter((item) => item.count > 0).length, [stats]);
  const averageAssignments = useMemo(() => {
    if (stats.length === 0) {
      return 0;
    }

    return Number((totalAssignments / stats.length).toFixed(1));
  }, [stats, totalAssignments]);

  const maxCount = orderedStats.reduce((max, item) => Math.max(max, item.count), 0);
  const shellStyle = {
    '--panel-progress': `${motionProgress}`,
    transform: `translateY(${16 - motionProgress * 16}px) scale(${0.985 + motionProgress * 0.015})`,
  } as CSSProperties;

  return (
    <section className="stats-stage glass-panel relative flex h-full min-h-[480px] flex-col overflow-hidden p-3 sm:min-h-[560px] sm:p-4 md:min-h-[620px] md:p-5 lg:min-h-[720px] lg:min-h-[760px]" style={shellStyle}>
      <div className="stats-stage-glow stats-stage-glow-a" />
      <div className="stats-stage-glow stats-stage-glow-b" />

      <div className="relative z-10 mb-2.5 flex flex-wrap items-start justify-between gap-2 sm:mb-3 sm:gap-3">
        <div>
          <p className="section-kicker hidden sm:inline-flex">统计视图</p>
          <h2 className="heading-font text-base font-bold text-slate-900 sm:text-lg">人员工作次数统计</h2>
          <p className="text-[11px] text-slate-500 sm:text-xs">默认按编号排序，可切换为按次数排序。</p>
        </div>

        <div className="flex w-full rounded-xl border border-slate-300 bg-white/80 p-0.5 shadow-sm sm:inline-flex sm:w-auto sm:rounded-2xl sm:p-1">
          <button
            type="button"
            onClick={() => onSortChange('code')}
            className={`flex-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs ${
              sortMode === 'code' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            按编号
          </button>
          <button
            type="button"
            onClick={() => onSortChange('count')}
            className={`flex-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs ${
              sortMode === 'count' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            按次数
          </button>
        </div>
      </div>

      {/* 统计卡片 - 移动端优化 */}
      <div className="relative z-10 mb-2.5 grid grid-cols-3 gap-2 sm:mb-3 sm:gap-3">
        <div className="rounded-[16px] border border-slate-200 bg-white/88 p-2 shadow-sm sm:rounded-[22px] sm:p-3">
          <p className="text-[10px] font-semibold text-slate-500 sm:text-[11px]">总参与次数</p>
          <p className="mt-0.5 text-lg font-bold text-slate-900 sm:mt-1 sm:text-2xl">{totalAssignments}</p>
        </div>
        <div className="rounded-[16px] border border-slate-200 bg-white/88 p-2 shadow-sm sm:rounded-[22px] sm:p-3">
          <p className="text-[10px] font-semibold text-slate-500 sm:text-[11px]">有任务员工</p>
          <p className="mt-0.5 text-lg font-bold text-slate-900 sm:mt-1 sm:text-2xl">{activeEmployees}</p>
        </div>
        <div className="rounded-[16px] border border-slate-200 bg-white/88 p-2 shadow-sm sm:rounded-[22px] sm:p-3">
          <p className="text-[10px] font-semibold text-slate-500 sm:text-[11px]">人均参与</p>
          <p className="mt-0.5 text-lg font-bold text-slate-900 sm:mt-1 sm:text-2xl">{averageAssignments}</p>
        </div>
      </div>

      {orderedStats.length === 0 ? (
        <div className="relative z-10 flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-[13px] text-slate-500 sm:text-sm">
          暂无员工数据。
        </div>
      ) : (
        <div className="relative z-10 flex flex-1 flex-col rounded-[20px] border border-slate-200 bg-white/78 p-2.5 shadow-sm sm:rounded-[24px] sm:p-3.5 lg:rounded-[28px] lg:p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5 sm:mb-3 sm:gap-2">
            <p className="text-[13px] font-semibold text-slate-800 sm:text-sm">任务参与柱状图</p>
            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500 sm:px-2.5 sm:py-1 sm:text-[11px]">
              共 {orderedStats.length} 人
            </span>
          </div>
          <div className="mobile-scroll flex-1 overflow-x-auto pb-1 sm:pb-2">
            {/* 柱状图 - 移动端优化 */}
            <div className="stats-bar-stage flex min-h-[240px] items-end gap-1.5 rounded-[16px] bg-gradient-to-b from-slate-50 via-white to-slate-100/80 px-2 py-2 sm:min-h-[300px] sm:gap-2 sm:rounded-[20px] sm:px-3 sm:py-3 lg:min-h-[360px] lg:min-w-[640px] lg:gap-2.5 lg:rounded-[24px] lg:px-4 lg:py-4">
              {orderedStats.map((item, index) => {
                const height = maxCount > 0 ? Math.max((item.count / maxCount) * 180, item.count > 0 ? 24 : 10) : 10;
                const barHeight = maxCount > 0 ? Math.max((item.count / maxCount) * 250, item.count > 0 ? 30 : 12) : 12;
                const drift = ((index % 5) - 2) * (1 - motionProgress) * 6;
                const barStyle = {
                  transform: `translateY(${10 - motionProgress * 10 + drift}px)`,
                } as CSSProperties;
                const fillStyle = {
                  height: `${height}px`,
                  transitionDelay: `${index * 45}ms`,
                  opacity: 0.78 + motionProgress * 0.22,
                } as CSSProperties;
                const lgFillStyle = {
                  height: `${barHeight}px`,
                  transitionDelay: `${index * 45}ms`,
                  opacity: 0.78 + motionProgress * 0.22,
                } as CSSProperties;

                return (
                  <div key={item.id} className="flex min-w-[48px] flex-1 flex-col items-center sm:min-w-[60px] lg:min-w-[76px]" style={barStyle}>
                    <div className="mb-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 sm:mb-2 sm:px-2 sm:py-1 sm:text-[11px]">
                      {item.count}
                    </div>
                    <div className="stats-bar-shell hidden h-[200px] w-full items-end rounded-[18px] border border-slate-100 bg-white/88 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:flex lg:h-[310px] lg:rounded-[22px] lg:px-3 lg:py-3">
                      <div
                        className="stats-bar-fill w-full rounded-t-[14px] bg-gradient-to-t from-emerald-500 via-cyan-400 to-sky-400 shadow-[0_16px_32px_rgba(14,165,233,0.2)] transition-all duration-500 lg:rounded-t-[18px]"
                        style={lgFillStyle}
                        title={`${item.name}：${item.count} 次`}
                      />
                    </div>
                    {/* 移动端简化柱状图 */}
                    <div className="flex h-[120px] w-full items-end rounded-[14px] border border-slate-100 bg-white/88 px-1.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:hidden">
                      <div
                        className="stats-bar-fill w-full rounded-t-[12px] bg-gradient-to-t from-emerald-500 via-cyan-400 to-sky-400 transition-all duration-500"
                        style={fillStyle}
                      />
                    </div>
                    <div className="mt-1.5 text-center sm:mt-2 lg:mt-3">
                      <p className="truncate text-[11px] font-semibold text-slate-900 sm:text-xs">{item.name}</p>
                      <p className="text-[10px] text-slate-500 sm:text-[11px]">编号 {item.employeeCode || '未设'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function WorkDetailsGrid({ employees, tasks, sortMode }: WorkDetailsGridProps) {
  const stats = useMemo(() => buildEmployeeStats(employees, tasks), [employees, tasks]);
  const orderedStats = useMemo(() => orderEmployeeStats(stats, sortMode), [sortMode, stats]);

  return (
    <section className="glass-panel mt-3 p-3 sm:mt-4 sm:p-4 md:p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2 sm:mb-4 sm:gap-3">
        <div>
          <h2 className="heading-font text-base font-bold text-slate-900 sm:text-lg">人员工作详情</h2>
          <p className="text-[11px] text-slate-500 sm:text-xs">双列排布，展示每位员工的任务参与情况。</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 sm:px-3 sm:text-xs">
          共 {orderedStats.length} 人
        </span>
      </div>

      {orderedStats.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-[13px] text-slate-500 sm:text-sm">
          暂无员工数据。
        </div>
      ) : (
        <div className="grid grid-cols-2 auto-rows-fr gap-2 sm:gap-3 lg:gap-4">
          {orderedStats.map((item) => (
            <article
              key={item.id}
              className="flex h-full min-h-[160px] min-w-0 flex-col rounded-[16px] border border-slate-200 bg-white/92 p-2.5 shadow-sm transition duration-200 hover:shadow-md sm:min-h-[200px] sm:rounded-[20px] sm:p-3 lg:min-h-[250px] lg:rounded-[24px] lg:p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-slate-900 sm:text-base">{item.name}</p>
                  <p className="truncate text-[11px] text-slate-500 sm:text-xs">
                    编号 {item.employeeCode || '未设'} | {item.contact || '无联系方式'}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 sm:px-3 sm:py-1 sm:text-xs">
                  {item.count} 次
                </span>
              </div>

              {item.records.length === 0 ? (
                <div className="mt-2 flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-2 py-3 text-[12px] text-slate-500 sm:mt-3 sm:rounded-2xl sm:px-3 sm:py-4 sm:text-sm">
                  暂无排班记录。
                </div>
              ) : (
                <ul className="mobile-scroll mt-2 grid max-h-[120px] flex-1 gap-1.5 overflow-auto pr-0.5 sm:mt-3 sm:max-h-[160px] sm:gap-2 sm:pr-1 lg:grid-cols-2 lg:max-h-[200px]">
                  {item.records.slice(0, 4).map((task) => (
                    <li
                      key={`${item.id}-${task.id}`}
                      className="rounded-xl border border-slate-200 bg-slate-50/90 px-2 py-2 text-[11px] text-slate-600 sm:rounded-2xl sm:px-3 sm:py-3 sm:text-xs"
                    >
                      <p className="truncate font-semibold text-slate-800">{task.name}</p>
                      <p className="mt-0.5 truncate sm:mt-1">
                        {formatDateText(task.date)} {task.time || '未设置'}
                      </p>
                    </li>
                  ))}
                  {item.records.length > 4 && (
                    <li className="col-span-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-2 py-2 text-center text-[11px] text-slate-500 sm:rounded-2xl">
                      还有 {item.records.length - 4} 项任务...
                    </li>
                  )}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
