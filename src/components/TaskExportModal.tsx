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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="heading-font text-2xl font-bold text-slate-900">导出任务数据</h2>
        <p className="mt-1 text-sm text-slate-500">将当前筛选结果导出为表格文件，当前可导出 {taskCount} 项任务。</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onExportCsv}
            disabled={taskCount === 0}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-5 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <p className="text-base font-bold text-slate-900">导出 CSV</p>
            <p className="mt-1 text-sm text-slate-500">适合导入表格软件或进一步处理。</p>
          </button>

          <button
            type="button"
            onClick={onExportExcel}
            disabled={taskCount === 0}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-5 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <p className="text-base font-bold text-slate-900">导出 Excel</p>
            <p className="mt-1 text-sm text-slate-500">导出为可直接用 Excel 打开的 `.xls` 文件。</p>
          </button>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
