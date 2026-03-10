import { useMemo, useState } from 'react';
import { type Employee, type Task } from '../types';
import { formatDateText } from '../utils/beijingTime';

interface WorkStatsProps {
  employees: Employee[];
  tasks: Task[];
}

type EmployeeRecord = {
  id: string;
  employeeCode: string;
  name: string;
  contact: string;
  count: number;
  records: Task[];
};

type SortMode = 'code' | 'count';

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

export function WorkStats({ employees, tasks }: WorkStatsProps) {
  const [sortMode, setSortMode] = useState<SortMode>('code');

  const stats = useMemo<EmployeeRecord[]>(() => {
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
  }, [employees, tasks]);

  const orderedStats = useMemo(() => {
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
  }, [sortMode, stats]);

  const totalAssignments = useMemo(() => {
    return stats.reduce((sum, item) => sum + item.count, 0);
  }, [stats]);

  const activeEmployees = useMemo(() => {
    return stats.filter((item) => item.count > 0).length;
  }, [stats]);

  const averageAssignments = useMemo(() => {
    if (stats.length === 0) {
      return 0;
    }

    return Number((totalAssignments / stats.length).toFixed(1));
  }, [stats, totalAssignments]);

  const maxCount = orderedStats.reduce((max, item) => Math.max(max, item.count), 0);

  return (
    <section className="glass-panel p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="heading-font text-lg font-bold text-slate-900">人员工作次数统计</h2>
          <p className="text-xs text-slate-500">默认按员工编号从左到右递增展示，也可切换为按次数递减。</p>
        </div>

        <div className="inline-flex rounded-xl border border-slate-300 bg-white/80 p-1">
          <button
            type="button"
            onClick={() => setSortMode('code')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              sortMode === 'code' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            按编号排序
          </button>
          <button
            type="button"
            onClick={() => setSortMode('count')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              sortMode === 'count' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            按次数排序
          </button>
        </div>
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
          <p className="text-[11px] font-semibold text-slate-500">总参与次数</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{totalAssignments}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
          <p className="text-[11px] font-semibold text-slate-500">有任务员工</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{activeEmployees}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
          <p className="text-[11px] font-semibold text-slate-500">人均参与</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{averageAssignments}</p>
        </div>
      </div>

      {orderedStats.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          暂无员工数据。
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
            <div className="overflow-x-auto pb-2">
              <div className="flex min-w-[720px] items-end gap-4">
                {orderedStats.map((item) => {
                  const height = maxCount > 0 ? Math.max((item.count / maxCount) * 220, item.count > 0 ? 28 : 12) : 12;

                  return (
                    <div key={item.id} className="flex min-w-[88px] flex-1 flex-col items-center">
                      <div className="mb-2 text-xs font-semibold text-slate-500">{item.count} 次</div>
                      <div className="flex h-60 w-full items-end rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 px-3 py-3">
                        <div
                          className="w-full rounded-t-2xl bg-gradient-to-t from-emerald-500 via-cyan-400 to-sky-400 shadow-[0_12px_28px_rgba(14,165,233,0.22)] transition-all duration-500"
                          style={{ height: `${height}px` }}
                          title={`${item.name}：${item.count} 次`}
                        />
                      </div>
                      <div className="mt-3 text-center">
                        <p className="text-xs font-semibold text-slate-900">{item.name}</p>
                        <p className="text-[11px] text-slate-500">编号 {item.employeeCode || '未设'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {orderedStats.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white/90 p-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      编号 {item.employeeCode || '未设'} | {item.contact || '未填写联系方式'}
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {item.count} 次
                  </span>
                </div>

                {item.records.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">暂无排班记录。</p>
                ) : (
                  <ul className="mt-2 max-h-40 space-y-2 overflow-auto pr-1">
                    {item.records.map((task) => (
                      <li
                        key={`${item.id}-${task.id}`}
                        className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs text-slate-600"
                      >
                        <p className="font-semibold text-slate-800">{task.name}</p>
                        <p className="mt-1">
                          {formatDateText(task.date)} {task.time || '未设置时间'} | {task.location || '未设置地点'}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
