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
  onUnassign: (taskId: string, employeeId: string) => void;
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
  onUnassign,
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
      <div className="grid gap-4 xl:grid-cols-2">
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
              onUnassign={onUnassign}
              onToggleSelect={onToggleSelect}
              onToggleComplete={onToggleComplete}
            />
          );
        })}
      </div>
    );
  };

  return (
    <section className="glass-panel p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="heading-font text-lg font-bold text-slate-900">任务卡片</h2>
          <p className="text-xs text-slate-500">任务操作已集中到头部弹窗，这里专注查看、选择和拖拽。</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-orange-700">
            当前 {tasks.length} / 总计 {totalTaskCount}
          </span>
          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sky-700">
            已选 {selectedVisibleCount}
          </span>
        </div>
      </div>

      {totalTaskCount === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-14 text-center text-sm text-slate-500">
          暂无任务，点击“新增任务”开始。
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-14 text-center text-sm text-slate-500">
          当前筛选条件下没有找到任务。
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">待完成任务池</h3>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {pendingTasks.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPendingCollapsed((prev) => !prev)}
                className="rounded-lg border border-slate-300 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {pendingCollapsed ? '展开任务池' : '折叠任务池'}
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                当前没有待完成任务。
              </div>
            ) : pendingCollapsed ? (
              <div className="rounded-xl border border-slate-200 bg-white/70 px-4 py-5 text-sm text-slate-600">
                待完成任务池已折叠，共 {pendingTasks.length} 项任务。
              </div>
            ) : (
              renderTaskList(pendingTasks)
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">已完成任务池</h3>
                <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {completedTasks.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCompletedCollapsed((prev) => !prev)}
                className="rounded-lg border border-slate-300 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {completedCollapsed ? '展开任务池' : '折叠任务池'}
              </button>
            </div>

            {completedTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                暂无已完成任务。
              </div>
            ) : completedCollapsed ? (
              <div className="rounded-xl border border-slate-200 bg-white/70 px-4 py-5 text-sm text-slate-600">
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
