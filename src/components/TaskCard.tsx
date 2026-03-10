import { useDroppable } from '@dnd-kit/core';
import { type Employee, type Task } from '../types';
import { formatDateText } from '../utils/beijingTime';

interface TaskCardProps {
  task: Task;
  assignedEmployees: Employee[];
  selected: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUnassign: (taskId: string, employeeId: string) => void;
  onToggleSelect: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export function TaskCard({
  task,
  assignedEmployees,
  selected,
  onEdit,
  onDelete,
  onUnassign,
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
      className={`rounded-2xl border p-4 shadow-sm transition ${
        isCompleted
          ? 'border-slate-300 bg-slate-50/85'
          : isOver
            ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200'
            : 'border-slate-200 bg-white hover:shadow'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <label className="mt-1 flex items-center">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect(task.id)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
              aria-label={`选择任务 ${task.name}`}
            />
          </label>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="heading-font text-lg font-bold text-slate-900">{task.name}</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  isCompleted ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {isCompleted ? '已完成' : '待完成'}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
              <span>{formatDateText(task.date)}</span>
              <span>{task.time || '未设置时间'}</span>
              <span>{task.location || '未设置地点'}</span>
              <span>{task.topic || '未设置主题'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            className={`rounded-lg border px-2 py-1 text-xs font-semibold transition ${
              isCompleted
                ? 'border-sky-300 text-sky-700 hover:bg-sky-50'
                : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            {isCompleted ? '转为待办' : '标记完成'}
          </button>
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            编辑
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="rounded-lg border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            删除
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-600">{task.description || '暂无任务说明。'}</p>

      <div className="mt-4 rounded-xl bg-slate-50 p-3">
        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">已分配员工</p>

        {assignedEmployees.length === 0 ? (
          <p className="mt-2 rounded-lg border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500">
            {isCompleted ? '任务已完成，当前无分配员工。' : '拖拽员工到此处进行分配。'}
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {assignedEmployees.map((employee) => (
              <li
                key={employee.id}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                  isCompleted
                    ? 'border-slate-300 bg-white'
                    : 'border-emerald-200 bg-emerald-50'
                }`}
              >
                <div>
                  <p className={`text-sm font-semibold ${isCompleted ? 'text-slate-900' : 'text-emerald-900'}`}>
                    {employee.name}
                  </p>
                  <p className={`text-xs ${isCompleted ? 'text-slate-600' : 'text-emerald-700'}`}>
                    {employee.contact || '未填写联系方式'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onUnassign(task.id, employee.id)}
                  className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-white"
                >
                  移除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
