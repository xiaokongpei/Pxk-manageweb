import { useEffect, useState } from 'react';
import { type Employee } from '../types';

interface TaskFilterModalProps {
  open: boolean;
  filters: {
    date: string;
    employeeId: string;
    keyword: string;
  };
  employees: Employee[];
  onClose: () => void;
  onApply: (filters: { date: string; employeeId: string; keyword: string }) => void;
  onClear: () => void;
}

export function TaskFilterModal({
  open,
  filters,
  employees,
  onClose,
  onApply,
  onClear,
}: TaskFilterModalProps) {
  const [form, setForm] = useState(filters);

  useEffect(() => {
    if (open) {
      setForm(filters);
    }
  }, [filters, open]);

  if (!open) {
    return null;
  }

  const handleApply = () => {
    onApply({
      date: form.date,
      employeeId: form.employeeId,
      keyword: form.keyword.trim(),
    });
    onClose();
  };

  const handleClear = () => {
    setForm({ date: '', employeeId: '', keyword: '' });
    onClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-900/45 p-2 pt-4 sm:items-center sm:p-3 sm:pt-6 md:p-4">
      <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-3 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl sm:p-4 md:p-6">
        <h2 className="heading-font text-xl font-bold text-slate-900 sm:text-2xl">任务筛选与搜索</h2>
        <p className="mt-0.5 text-[13px] text-slate-500 sm:mt-1 sm:text-sm">按日期、员工、关键词组合筛选当前任务池。</p>

        <div className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3 md:grid-cols-2">
          <label className="block text-[13px] font-semibold text-slate-700 sm:text-sm">
            日期
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-[14px] outline-none ring-emerald-500 transition focus:ring sm:rounded-xl sm:px-3"
            />
          </label>

          <label className="block text-[13px] font-semibold text-slate-700 sm:text-sm">
            员工
            <select
              value={form.employeeId}
              onChange={(event) => setForm((prev) => ({ ...prev, employeeId: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-[14px] outline-none ring-emerald-500 transition focus:ring sm:rounded-xl sm:px-3"
            >
              <option value="">全部员工</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-[13px] font-semibold text-slate-700 sm:text-sm md:col-span-2">
            关键词
            <input
              value={form.keyword}
              onChange={(event) => setForm((prev) => ({ ...prev, keyword: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-[14px] outline-none ring-emerald-500 transition focus:ring sm:rounded-xl sm:px-3"
              placeholder="任务名 / 地点 / 主题 / 说明"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-1.5 sm:mt-5 sm:gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="min-h-[40px] rounded-lg border border-slate-300 px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50 sm:rounded-xl sm:px-4 sm:text-sm"
          >
            清空筛选
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] rounded-lg border border-slate-300 px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50 sm:rounded-xl sm:px-4 sm:text-sm"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="min-h-[40px] rounded-lg bg-slate-900 px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-slate-700 sm:rounded-xl sm:px-4 sm:text-sm"
          >
            应用筛选
          </button>
        </div>
      </div>
    </div>
  );
}
