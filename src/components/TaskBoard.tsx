import { useMemo, useState } from 'react';
import { type Employee, type Task } from '../types';
import { TaskCard } from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  totalTaskCount: number;
  selectedTaskIds: string[];
  selectedVisibleCount: number;
  employeesById: Map<string, Employee>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onManageAssignees: (task: Task) => void;
  onToggleSelect: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

function normalizeAssigneeIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

export function TaskBoard({
  tasks,
  totalTaskCount,
  selectedTaskIds,
  selectedVisibleCount,
  employeesById,
  onEdit,
  onDelete,
  onManageAssignees,
  onToggleSelect,
  onToggleComplete,
}: TaskBoardProps) {
  const [pendingCollapsed, setPendingCollapsed] = useState(false);
  const [completedCollapsed, setCompletedCollapsed] = useState(false);

  const { pendingTasks, completedTasks } = useMemo(() => {
    return {
      pendingTasks: tasks.filter((task) => !task.completed),
      completedTasks: tasks.filter((task) => task.completed),
    };
  }, [tasks]);

  const renderTaskList = (list: Task[]) => {
    if (list.length === 0) {
      return null;
    }

    return (
      <div className="stagger-grid grid gap-3 sm:gap-4 2xl:grid-cols-2">
        {list.map((task) => {
          const assignedEmployees = normalizeAssigneeIds(task.assigneeIds)
            .map((employeeId) => employeesById.get(employeeId))
            .filter((employee): employee is Employee => Boolean(employee));

          return (
            <TaskCard
              key={task.id}
              task={task}
              assignedEmployees={assignedEmployees}
              selected={selectedTaskIds.includes(task.id)}
              onEdit={onEdit}
              onDelete={onDelete}
              onManageAssignees={onManageAssignees}
              onToggleSelect={onToggleSelect}
              onToggleComplete={onToggleComplete}
            />
          );
        })}
      </div>
    );
  };

  return (
    <section className="glass-panel relative overflow-hidden p-4 md:p-5">
      <div className="parallax-fast pointer-events-none absolute -right-10 top-8 h-40 w-40 rounded-full bg-sky-200/25 blur-3xl" />
      <div className="parallax-slow pointer-events-none absolute left-8 top-0 h-28 w-28 rounded-full bg-emerald-200/20 blur-3xl" />

      <div className="relative z-10 mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="section-kicker hidden sm:inline-flex">任务区</p>
          <h2 className="heading-font mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950 sm:mt-2">任务卡片</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500 sm:mt-2">
            待完成池和已完成池都支持折叠、选择、状态切换和人员管理。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-orange-700 shadow-sm">
            当前 {tasks.length} / 总计 {totalTaskCount}
          </span>
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-700 shadow-sm">
            已选 {selectedVisibleCount}
          </span>
        </div>
      </div>

      {totalTaskCount === 0 ? (
        <div className="relative z-10 rounded-[24px] border border-dashed border-slate-300 bg-white/60 px-4 py-14 text-center text-sm text-slate-500 sm:rounded-[28px] sm:py-16">
          暂无任务，点击上方“新增任务”开始。
        </div>
      ) : tasks.length === 0 ? (
        <div className="relative z-10 rounded-[24px] border border-dashed border-slate-300 bg-white/60 px-4 py-14 text-center text-sm text-slate-500 sm:rounded-[28px] sm:py-16">
          当前筛选条件下没有找到任务。
        </div>
      ) : (
        <div className="task-board-window mobile-scroll relative z-10 flex-1 space-y-4 overflow-y-auto pr-1 sm:space-y-5 sm:pr-2">
          <div className="overflow-hidden rounded-[24px] border border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.9),rgba(248,251,255,0.8))] p-3.5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:rounded-[30px] sm:p-5">
            <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 sm:items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.28)]">
                  {pendingTasks.length}
                </div>
                <div>
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-900">待完成任务池</h3>
                  <p className="text-xs leading-5 text-slate-500">新的任务会优先出现在这里的最前面，便于优先处理。</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingCollapsed((prev) => !prev)}
                className="min-h-[42px] w-full rounded-full border border-slate-200 bg-white/80 px-4 text-xs font-semibold text-slate-700 transition hover:bg-white sm:w-auto"
              >
                {pendingCollapsed ? '展开任务池' : '折叠任务池'}
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-slate-300 bg-white/75 px-4 py-9 text-center text-sm text-slate-500 sm:rounded-[24px] sm:py-10">
                当前没有待完成任务。
              </div>
            ) : pendingCollapsed ? (
              <div className="rounded-[22px] border border-slate-200 bg-white/70 px-4 py-5 text-sm text-slate-600 sm:rounded-[24px]">
                待完成任务池已折叠，共 {pendingTasks.length} 项任务。
              </div>
            ) : (
              renderTaskList(pendingTasks)
            )}
          </div>

          <div className="overflow-hidden rounded-[24px] border border-white/70 bg-[linear-gradient(160deg,rgba(247,250,252,0.92),rgba(241,245,249,0.82))] p-3.5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:rounded-[30px] sm:p-5">
            <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 sm:items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-300 text-sm font-semibold text-slate-800 shadow-[0_10px_24px_rgba(100,116,139,0.18)]">
                  {completedTasks.length}
                </div>
                <div>
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-900">已完成任务池</h3>
                  <p className="text-xs leading-5 text-slate-500">完成后的任务沉淀在这里，方便复盘又不打扰当前执行。</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCompletedCollapsed((prev) => !prev)}
                className="min-h-[42px] w-full rounded-full border border-slate-200 bg-white/80 px-4 text-xs font-semibold text-slate-700 transition hover:bg-white sm:w-auto"
              >
                {completedCollapsed ? '展开任务池' : '折叠任务池'}
              </button>
            </div>

            {completedTasks.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-slate-300 bg-white/75 px-4 py-9 text-center text-sm text-slate-500 sm:rounded-[24px] sm:py-10">
                暂无已完成任务。
              </div>
            ) : completedCollapsed ? (
              <div className="rounded-[22px] border border-slate-200 bg-white/70 px-4 py-5 text-sm text-slate-600 sm:rounded-[24px]">
                已完成任务池已折叠，共 {completedTasks.length} 项任务。
              </div>
            ) : (
              renderTaskList(completedTasks)
            )}
          </div>
        </div>
      )}
    </section>
  );
}
