import { useDroppable } from '@dnd-kit/core';
import { type Employee, type Task } from '../types';
import { formatDateText } from '../utils/beijingTime';

interface TaskCardProps {
  task: Task;
  assignedEmployees: Employee[];
  selected: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onManageAssignees: (task: Task) => void;
  onToggleSelect: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export function TaskCard({
  task,
  assignedEmployees,
  selected,
  onEdit,
  onDelete,
  onManageAssignees,
  onToggleSelect,
  onToggleComplete,
}: TaskCardProps) {
  const isCompleted = task.completed === true;

  const { isOver, setNodeRef } = useDroppable({
    id: `task:${task.id}`,
    data: {
      type: 'task',
      taskId: task.id,
    },
    disabled: isCompleted,
  });

  return (
    <article
      ref={setNodeRef}
      className={`group relative overflow-hidden rounded-[20px] border p-3 shadow-[0_16px_36px_rgba(15,23,42,0.07)] transition duration-300 sm:rounded-[24px] sm:p-3.5 md:rounded-[30px] md:p-4 lg:p-5 ${
        isCompleted
          ? 'border-white/70 bg-[linear-gradient(160deg,rgba(248,250,252,0.94),rgba(241,245,249,0.82))]'
          : isOver
            ? 'border-emerald-300 bg-[linear-gradient(160deg,rgba(236,253,245,0.96),rgba(255,255,255,0.9))] ring-2 ring-emerald-200/70'
            : 'border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(245,248,253,0.82))] hover:-translate-y-0.5 hover:shadow-[0_24px_54px_rgba(15,23,42,0.11)]'
      }`}
    >
      <div className="pointer-events-none absolute inset-x-10 top-0 h-20 rounded-full bg-sky-200/20 blur-3xl" />

      <div className="relative z-10 flex flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
          <label className="mt-0.5 flex items-center sm:mt-1">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect(task.id)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
              aria-label={`选择任务 ${task.name}`}
            />
          </label>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 className="heading-font truncate text-base font-semibold tracking-[-0.02em] text-slate-950 sm:text-lg lg:text-xl">{task.name}</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] sm:text-[10px] ${
                  isCompleted ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {isCompleted ? '已完成' : '进行中'}
              </span>
            </div>

            {/* 标签 - 移动端简化显示 */}
            <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
              <span className="rounded-full border border-slate-200 bg-white/75 px-2 py-0.5 text-[10px] font-medium text-slate-600 sm:px-3 sm:py-1 sm:text-xs">
                {formatDateText(task.date)}
              </span>
              <span className="rounded-full border border-slate-200 bg-white/75 px-2 py-0.5 text-[10px] font-medium text-slate-600 sm:px-3 sm:py-1 sm:text-xs">
                {task.time || '未设置'}
              </span>
              <span className="hidden rounded-full border border-slate-200 bg-white/75 px-3 py-1 text-xs font-medium text-slate-600 sm:block">
                {task.location || '未设置地点'}
              </span>
              <span className="hidden rounded-full border border-slate-200 bg-white/75 px-3 py-1 text-xs font-medium text-slate-600 lg:block">
                {task.topic || '未设置主题'}
              </span>
            </div>
          </div>
        </div>

        {/* 按钮组 - 移动端优化布局 */}
        <div className="grid w-full grid-cols-4 gap-1.5 sm:flex sm:w-auto sm:flex-wrap sm:gap-2 lg:items-center lg:justify-end">
          <button
            type="button"
            onClick={() => onManageAssignees(task)}
            className="min-h-[36px] rounded-full border border-slate-200 bg-white/80 px-2 text-[10px] font-semibold text-slate-700 transition hover:bg-white sm:min-h-[42px] sm:px-3 sm:text-xs lg:px-4"
          >
            人员
          </button>
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            className={`min-h-[36px] rounded-full px-2 text-[10px] font-semibold transition sm:min-h-[42px] sm:px-3 sm:text-xs lg:px-4 ${
              isCompleted
                ? 'border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100'
                : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {isCompleted ? '待办' : '完成'}
          </button>
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="min-h-[36px] rounded-full border border-slate-200 bg-white/70 px-2 text-[10px] font-semibold text-slate-700 transition hover:bg-white sm:min-h-[42px] sm:px-3 sm:text-xs lg:px-4"
          >
            编辑
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="min-h-[36px] rounded-full border border-rose-200 bg-rose-50/75 px-2 text-[10px] font-semibold text-rose-600 transition hover:bg-rose-100 sm:min-h-[42px] sm:px-3 sm:text-xs lg:px-4"
          >
            删除
          </button>
        </div>
      </div>

      {/* 任务详情区域 - 移动端单列 */}
      <div className="relative z-10 mt-3 grid gap-2.5 sm:mt-3.5 lg:mt-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(260px,0.75fr)] lg:gap-3">
        <div className="rounded-[16px] border border-white/70 bg-white/68 p-2.5 shadow-sm sm:rounded-[20px] sm:p-3 lg:rounded-[24px] lg:p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 sm:text-[11px]">任务说明</p>
          <p className="mt-2 text-[13px] leading-6 text-slate-600 sm:mt-3 sm:text-sm sm:leading-7">{task.description || '暂无任务说明。'}</p>
        </div>

        <div className="rounded-[16px] border border-white/70 bg-slate-950/[0.035] p-2.5 shadow-sm sm:rounded-[20px] sm:p-3 lg:rounded-[24px] lg:p-4">
          <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 sm:text-[11px]">已分配员工</p>
            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500 sm:px-2.5 sm:py-1 sm:text-[11px]">
              {assignedEmployees.length} 人
            </span>
          </div>

          {assignedEmployees.length === 0 ? (
            <p className="mt-2 rounded-[14px] border border-dashed border-slate-300 bg-white/70 px-3 py-3 text-[12px] text-slate-500 sm:mt-3 sm:rounded-[18px] sm:py-4 sm:text-sm">
              暂无分配，点击"人员"按钮添加。
            </p>
          ) : (
            <ul className="mt-2 grid gap-1.5 sm:mt-3 sm:grid-cols-2 sm:gap-2">
              {assignedEmployees.map((employee) => (
                <li
                  key={employee.id}
                  className={`rounded-[14px] border px-2.5 py-2 sm:rounded-[18px] sm:px-3 sm:py-3 ${
                    isCompleted
                      ? 'border-slate-200 bg-white/80'
                      : 'border-emerald-200 bg-emerald-50/80'
                  }`}
                >
                  <p className={`truncate text-[13px] font-semibold sm:text-sm ${isCompleted ? 'text-slate-900' : 'text-emerald-900'}`}>
                    {employee.name}
                  </p>
                  <p className={`mt-0.5 truncate text-[11px] sm:mt-1 sm:text-xs ${isCompleted ? 'text-slate-600' : 'text-emerald-700'}`}>
                    编号 {employee.employeeCode || '未设'}
                  </p>
                  <p className={`mt-0.5 truncate text-[11px] sm:hidden ${isCompleted ? 'text-slate-500' : 'text-emerald-700/80'}`}>
                    {employee.contact || '无联系方式'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
