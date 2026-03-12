interface TaskExportModalProps {
  open: boolean;
  taskCount: number;
  onClose: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
}

export function TaskExportModal({
  open,
  taskCount,
  onClose,
  onExportCsv,
  onExportExcel,
}: TaskExportModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-900/45 p-2 pt-4 sm:items-center sm:p-3 sm:pt-6 md:p-4">
      <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-3 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl sm:p-4 md:p-6">
        <h2 className="heading-font text-xl font-bold text-slate-900 sm:text-2xl">导出任务数据</h2>
        <p className="mt-0.5 text-[13px] text-slate-500 sm:mt-1 sm:text-sm">将当前筛选结果导出为表格文件，当前可导出 {taskCount} 项任务。</p>

        <div className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onExportCsv}
            disabled={taskCount === 0}
            className="rounded-xl border border-slate-300 bg-white px-3 py-4 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:px-4 sm:py-5"
          >
            <p className="text-[15px] font-bold text-slate-900 sm:text-base">导出 CSV</p>
            <p className="mt-1 text-[12px] text-slate-500 sm:text-sm">适合导入表格软件或进一步处理。</p>
          </button>

          <button
            type="button"
            onClick={onExportExcel}
            disabled={taskCount === 0}
            className="rounded-xl border border-slate-300 bg-white px-3 py-4 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:px-4 sm:py-5"
          >
            <p className="text-[15px] font-bold text-slate-900 sm:text-base">导出 Excel</p>
            <p className="mt-1 text-[12px] text-slate-500 sm:text-sm">导出为可直接用 Excel 打开的 `.xls` 文件。</p>
          </button>
        </div>

        <div className="mt-4 flex justify-end sm:mt-5">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] rounded-lg border border-slate-300 px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50 sm:rounded-xl sm:px-4 sm:text-sm"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
