interface HeaderProps {
  employeesCount: number;
  tasksCount: number;
  activeFilterCount: number;
  selectedTaskCount: number;
  onAddEmployee: () => void;
  onAddTask: () => void;
  onOpenTaskFilter: () => void;
  onOpenTaskExport: () => void;
  onOpenTaskBatch: () => void;
  onReset: () => void;
}

export function Header({
  employeesCount,
  tasksCount,
  activeFilterCount,
  selectedTaskCount,
  onAddEmployee,
  onAddTask,
  onOpenTaskFilter,
  onOpenTaskExport,
  onOpenTaskBatch,
  onReset,
}: HeaderProps) {
  return (
    <header className="glass-panel mb-5 flex flex-col gap-4 p-5 md:mb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          员工打卡任务系统
        </p>
        <h1 className="heading-font text-2xl font-bold text-slate-900 md:text-3xl">
          工作安排看板
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {employeesCount} 名员工 | {tasksCount} 项任务
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <button
          type="button"
          onClick={onAddEmployee}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          新增员工
        </button>
        <button
          type="button"
          onClick={onAddTask}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          新增任务
        </button>
        <button
          type="button"
          onClick={onOpenTaskFilter}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          筛选任务{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
        <button
          type="button"
          onClick={onOpenTaskExport}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          导出数据
        </button>
        <button
          type="button"
          onClick={onOpenTaskBatch}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          批量操作{selectedTaskCount > 0 ? ` (${selectedTaskCount})` : ''}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          重置示例数据
        </button>
      </div>
    </header>
  );
}
