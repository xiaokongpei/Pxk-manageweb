import { useState } from 'react';
import { type Employee } from '../types';

interface TaskBatchModalProps {
  open: boolean;
  employees: Employee[];
  selectedCount: number;
  visibleCount: number;
  onClose: () => void;
  onSelectAllVisible: () => void;
  onClearSelection: () => void;
  onBulkComplete: () => void;
  onBulkDelete: () => void;
  onBulkAssign: (employeeId: string) => void;
}

export function TaskBatchModal({
  open,
  employees,
  selectedCount,
  visibleCount,
  onClose,
  onSelectAllVisible,
  onClearSelection,
  onBulkComplete,
  onBulkDelete,
  onBulkAssign,
}: TaskBatchModalProps) {
  const [employeeId, setEmployeeId] = useState('');

  if (!open) {
    return null;
  }

  const handleBulkAssign = () => {
    if (!employeeId) {
      return;
    }

    onBulkAssign(employeeId);
    setEmployeeId('');
    onClose();
  };

  const handleBulkComplete = () => {
    onBulkComplete();
    onClose();
  };

  const handleBulkDelete = () => {
    onBulkDelete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-900/45 p-2 pt-4 sm:items-center sm:p-3 sm:pt-6 md:p-4">
      <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-3 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl sm:p-4 md:p-6">
        <h2 className="heading-font text-xl font-bold text-slate-900 sm:text-2xl">批量操作</h2>
        <p className="mt-0.5 text-[13px] text-slate-500 sm:mt-1 sm:text-sm">
          已选择 {selectedCount} 项任务，当前筛选范围内共有 {visibleCount} 项。
        </p>

        <div className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={onSelectAllVisible}
            disabled={visibleCount === 0}
            className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:px-4 sm:py-4"
          >
            <p className="text-[14px] font-bold text-slate-900 sm:text-base">全选当前筛选结果</p>
            <p className="mt-0.5 text-[12px] text-slate-500 sm:mt-1 sm:text-sm">把当前可见任务全部加入批量操作范围。</p>
          </button>

          <button
            type="button"
            onClick={onClearSelection}
            disabled={selectedCount === 0}
            className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:px-4 sm:py-4"
          >
            <p className="text-[14px] font-bold text-slate-900 sm:text-base">清空选择</p>
            <p className="mt-0.5 text-[12px] text-slate-500 sm:mt-1 sm:text-sm">保留任务不变，只清除当前已选中状态。</p>
          </button>

          <button
            type="button"
            onClick={handleBulkComplete}
            disabled={selectedCount === 0}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-left transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:px-4 sm:py-4"
          >
            <p className="text-[14px] font-bold text-emerald-900 sm:text-base">批量标记完成</p>
            <p className="mt-0.5 text-[12px] text-emerald-700 sm:mt-1 sm:text-sm">把选中的任务全部转为已完成。</p>
          </button>

          <button
            type="button"
            onClick={handleBulkDelete}
            disabled={selectedCount === 0}
            className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-left transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:px-4 sm:py-4"
          >
            <p className="text-[14px] font-bold text-rose-900 sm:text-base">批量删除</p>
            <p className="mt-0.5 text-[12px] text-rose-700 sm:mt-1 sm:text-sm">删除选中任务，同步减少相关员工工作次数。</p>
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:mt-5 sm:rounded-2xl sm:p-4">
          <label className="block text-[13px] font-semibold text-slate-700 sm:text-sm">
            批量分配员工
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <select
                value={employeeId}
                onChange={(event) => setEmployeeId(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-[14px] outline-none ring-emerald-500 transition focus:ring sm:rounded-xl sm:px-3"
              >
                <option value="">选择员工</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleBulkAssign}
                disabled={selectedCount === 0 || !employeeId}
                className="min-h-[40px] rounded-lg bg-slate-900 px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:rounded-xl sm:px-4 sm:text-sm"
              >
                批量分配
              </button>
            </div>
          </label>
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
