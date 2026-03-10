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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="heading-font text-2xl font-bold text-slate-900">任务筛选与搜索</h2>
        <p className="mt-1 text-sm text-slate-500">按日期、员工、关键词组合筛选当前任务池。</p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700">
            日期
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 transition focus:ring"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            员工
            <select
              value={form.employeeId}
              onChange={(event) => setForm((prev) => ({ ...prev, employeeId: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 transition focus:ring"
            >
              <option value="">全部员工</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
            关键词
            <input
              value={form.keyword}
              onChange={(event) => setForm((prev) => ({ ...prev, keyword: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 transition focus:ring"
              placeholder="任务名 / 地点 / 主题 / 说明"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            清空筛选
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            应用筛选
          </button>
        </div>
      </div>
    </div>
  );
}
