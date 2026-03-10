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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="heading-font text-2xl font-bold text-slate-900">批量操作</h2>
        <p className="mt-1 text-sm text-slate-500">
          当前已选择 {selectedCount} 项任务，当前筛选范围内共有 {visibleCount} 项任务。
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={onSelectAllVisible}
            disabled={visibleCount === 0}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-4 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <p className="text-base font-bold text-slate-900">全选当前筛选结果</p>
            <p className="mt-1 text-sm text-slate-500">把当前可见任务全部加入批量操作范围。</p>
          </button>

          <button
            type="button"
            onClick={onClearSelection}
            disabled={selectedCount === 0}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-4 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <p className="text-base font-bold text-slate-900">清空选择</p>
            <p className="mt-1 text-sm text-slate-500">保留任务不变，只清除当前已选中状态。</p>
          </button>

          <button
            type="button"
            onClick={handleBulkComplete}
            disabled={selectedCount === 0}
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-left transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <p className="text-base font-bold text-emerald-900">批量标记完成</p>
            <p className="mt-1 text-sm text-emerald-700">把选中的任务全部转为已完成。</p>
          </button>

          <button
            type="button"
            onClick={handleBulkDelete}
            disabled={selectedCount === 0}
            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-left transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <p className="text-base font-bold text-rose-900">批量删除</p>
            <p className="mt-1 text-sm text-rose-700">删除选中任务，并同步减少相关员工工作次数。</p>
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label className="block text-sm font-semibold text-slate-700">
            批量分配员工
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <select
                value={employeeId}
                onChange={(event) => setEmployeeId(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-emerald-500 transition focus:ring"
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
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                批量分配
              </button>
            </div>
          </label>
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
