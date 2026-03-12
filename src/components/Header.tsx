import { type CSSProperties } from 'react';

interface HeaderProps {
  employeesCount: number;
  tasksCount: number;
  pendingTaskCount: number;
  completedTaskCount: number;
  activeFilterCount: number;
  selectedTaskCount: number;
  heroProgress: number;
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
  pendingTaskCount,
  completedTaskCount,
  activeFilterCount,
  selectedTaskCount,
  heroProgress,
  onAddEmployee,
  onAddTask,
  onOpenTaskFilter,
  onOpenTaskExport,
  onOpenTaskBatch,
  onReset,
}: HeaderProps) {
  return (
    <header
      className="hero-panel reveal-on-scroll is-visible overflow-hidden rounded-[20px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(244,248,255,0.78))] p-3 shadow-[0_24px_64px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:rounded-[26px] sm:p-4 md:rounded-[34px] md:p-5 lg:p-6 xl:rounded-[26px] xl:p-8"
      style={{ '--hero-progress': `${heroProgress}` } as CSSProperties}
    >
      <div className="hero-cover-layer pointer-events-none absolute inset-0">
        <div className="hero-cover-orb hero-cover-orb-a" />
        <div className="hero-cover-orb hero-cover-orb-b" />
        <div className="hero-cover-grid" />
      </div>

      <div className="relative z-10 flex flex-col gap-2 border-b border-slate-200/70 pb-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 sm:text-[11px] sm:tracking-[0.28em]">PXK Manage</p>
          <p className="mt-0.5 text-[11px] text-slate-500 sm:mt-1 sm:text-xs md:text-sm">你的小型任务指挥台</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 sm:justify-end">
          <span className="rounded-full border border-white/70 bg-white/75 px-2 py-0.5 text-[10px] font-semibold text-slate-600 shadow-sm sm:px-2.5 sm:py-1 sm:text-[11px] lg:text-xs">
            北京时间工作流
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 shadow-sm sm:px-2.5 sm:py-1 sm:text-[11px] lg:text-xs">
            实时本地运行
          </span>
        </div>
      </div>

      <section className="relative z-10 mt-3 overflow-hidden rounded-[18px] border border-white/75 bg-[linear-gradient(145deg,rgba(255,255,255,0.8),rgba(246,250,255,0.62))] p-3 shadow-[0_20px_44px_rgba(15,23,42,0.08)] sm:mt-4 sm:rounded-[24px] sm:p-4 md:rounded-[32px] md:p-6 xl:p-7">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_62%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.12),transparent_56%)] xl:block" />

        <div className="relative z-10 grid gap-4 md:gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)] xl:items-end">
          <div>
            <p className="section-kicker hidden md:inline-flex">任务指挥台</p>
            <h1 className="heading-font mt-0.5 text-[1.25rem] font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:mt-1 sm:text-[1.45rem] sm:tracking-[-0.05em] md:text-[1.8rem] lg:text-[2.35rem] xl:text-[3.7rem] xl:leading-[1.03]">
              先别慌，
              <span className="block bg-gradient-to-r from-slate-950 via-sky-700 to-emerald-600 bg-clip-text text-transparent">
                任务都排得开。
              </span>
            </h1>
            <p className="mt-1.5 max-w-3xl text-[12px] leading-5 text-slate-600 sm:mt-2 sm:text-[13px] sm:leading-6 md:mt-3 md:text-sm md:leading-7 lg:text-base">
              该分配的分配，该完成的完成，该统计的统计，主打一个心里有数。
            </p>

            {/* 统计卡片 - 移动端2列，平板及以上4列 */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-2.5 md:gap-3 lg:mt-5 xl:grid-cols-4 xl:gap-2">
              <div className="rounded-[16px] border border-white/80 bg-white/82 p-2.5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] sm:rounded-[20px] sm:p-3 lg:rounded-[24px] lg:p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400 sm:text-[10px] lg:text-[11px] lg:tracking-[0.18em]">团队人数</p>
                <p className="mt-1.5 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950 sm:text-[1.5rem] lg:mt-2 lg:text-[2rem]">{employeesCount}</p>
                <p className="mt-0.5 text-[10px] leading-4 text-slate-500 sm:mt-1 sm:text-[11px] sm:leading-5 lg:text-xs">集中查看员工信息</p>
              </div>
              <div className="rounded-[16px] border border-white/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-2.5 text-white shadow-[0_18px_36px_rgba(15,23,42,0.16)] sm:rounded-[20px] sm:p-3 lg:rounded-[24px] lg:p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/55 sm:text-[10px] lg:text-[11px] lg:tracking-[0.18em]">待完成</p>
                <p className="mt-1.5 text-[1.35rem] font-semibold tracking-[-0.04em] sm:text-[1.5rem] lg:mt-2 lg:text-[2rem]">{pendingTaskCount}</p>
                <p className="mt-0.5 text-[10px] leading-4 text-white/70 sm:mt-1 sm:text-[11px] sm:leading-5 lg:text-xs">优先处理当前事项</p>
              </div>
              <div className="rounded-[16px] border border-white/80 bg-white/82 p-2.5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] sm:rounded-[20px] sm:p-3 lg:rounded-[24px] lg:p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400 sm:text-[10px] lg:text-[11px] lg:tracking-[0.18em]">已完成</p>
                <p className="mt-1.5 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950 sm:text-[1.5rem] lg:mt-2 lg:text-[2rem]">{completedTaskCount}</p>
                <p className="mt-0.5 text-[10px] leading-4 text-slate-500 sm:mt-1 sm:text-[11px] sm:leading-5 lg:text-xs">处理结果清清楚楚</p>
              </div>
              <div className="rounded-[16px] border border-white/80 bg-white/82 p-2.5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] sm:rounded-[20px] sm:p-3 lg:rounded-[24px] lg:p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400 sm:text-[10px] lg:text-[11px] lg:tracking-[0.18em]">全部任务</p>
                <p className="mt-1.5 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950 sm:text-[1.5rem] lg:mt-2 lg:text-[2rem]">{tasksCount}</p>
                <p className="mt-0.5 text-[10px] leading-4 text-slate-500 sm:mt-1 sm:text-[11px] sm:leading-5 lg:text-xs">筛选与批量操作都可用</p>
              </div>
            </div>
          </div>

          {/* 按钮组 - 移动端优化布局 */}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1">
            <div className="grid grid-cols-2 gap-1.5 sm:col-span-2 sm:grid-cols-3 sm:gap-2 lg:col-span-3 xl:grid-cols-1">
              <button
                type="button"
                onClick={onAddTask}
                className="min-h-[42px] rounded-full bg-slate-950 px-3 text-[11px] font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 sm:min-h-[44px] sm:px-4 sm:text-xs lg:text-sm xl:px-5"
              >
                新增任务
              </button>
              <button
                type="button"
                onClick={onAddEmployee}
                className="min-h-[42px] rounded-full bg-white/82 px-3 text-[11px] font-semibold text-slate-900 ring-1 ring-inset ring-slate-200 transition duration-300 hover:-translate-y-0.5 hover:bg-white sm:min-h-[44px] sm:px-4 sm:text-xs lg:text-sm xl:px-5"
              >
                新增员工
              </button>
              <button
                type="button"
                onClick={onOpenTaskFilter}
                className="col-span-2 min-h-[42px] rounded-full bg-white/65 px-3 text-[11px] font-semibold text-slate-700 ring-1 ring-inset ring-slate-200 transition duration-300 hover:-translate-y-0.5 hover:bg-white sm:col-span-1 sm:min-h-[44px] sm:px-4 sm:text-xs lg:text-sm xl:px-5"
              >
                筛选任务{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:col-span-2 sm:grid-cols-3 sm:gap-2 lg:col-span-3 xl:grid-cols-1">
              <button
                type="button"
                onClick={onOpenTaskExport}
                className="min-h-[38px] rounded-full border border-slate-200 bg-white/65 px-2 text-[10px] font-semibold text-slate-700 transition hover:bg-white sm:min-h-[40px] sm:px-3 sm:text-[11px] lg:text-xs xl:min-h-[42px] xl:px-4 xl:text-sm"
              >
                导出数据
              </button>
              <button
                type="button"
                onClick={onOpenTaskBatch}
                className="min-h-[38px] rounded-full border border-slate-200 bg-white/65 px-2 text-[10px] font-semibold text-slate-700 transition hover:bg-white sm:min-h-[40px] sm:px-3 sm:text-[11px] lg:text-xs xl:min-h-[42px] xl:px-4 xl:text-sm"
              >
                批量{selectedTaskCount > 0 ? `(${selectedTaskCount})` : ''}
              </button>
              <button
                type="button"
                onClick={onReset}
                className="min-h-[38px] rounded-full border border-slate-200 bg-white/55 px-2 text-[10px] font-semibold text-slate-600 transition hover:bg-white sm:min-h-[40px] sm:px-3 sm:text-[11px] lg:text-xs xl:min-h-[42px] xl:px-4 xl:text-sm"
              >
                重置数据
              </button>
            </div>
          </div>
        </div>
      </section>
    </header>
  );
}
