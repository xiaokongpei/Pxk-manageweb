import { useEffect, useState, type FormEvent } from 'react';
import { type Employee, type EmployeeInput } from '../types';

interface EmployeeFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialValue: Employee | null;
  onClose: () => void;
  onSubmit: (payload: EmployeeInput) => void;
}

const emptyState: EmployeeInput = {
  employeeCode: '',
  name: '',
  contact: '',
  notes: '',
};

export function EmployeeFormModal({
  open,
  mode,
  initialValue,
  onClose,
  onSubmit,
}: EmployeeFormModalProps) {
  const [form, setForm] = useState<EmployeeInput>(emptyState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === 'edit' && initialValue) {
      setForm({
        employeeCode: initialValue.employeeCode,
        name: initialValue.name,
        contact: initialValue.contact,
        notes: initialValue.notes,
      });
      setError('');
      return;
    }

    setForm(emptyState);
    setError('');
  }, [open, mode, initialValue]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError('员工姓名不能为空。');
      return;
    }

    onSubmit({
      employeeCode: form.employeeCode.trim(),
      name: form.name.trim(),
      contact: form.contact.trim(),
      notes: form.notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-900/45 p-2 pt-4 sm:items-center sm:p-3 sm:pt-6 md:p-4">
      <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-3 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl sm:p-4 md:p-6">
        <h2 className="heading-font text-xl font-bold text-slate-900 sm:text-2xl">
          {mode === 'create' ? '创建员工' : '编辑员工'}
        </h2>
        <p className="mt-0.5 text-[13px] text-slate-500 sm:mt-1 sm:text-sm">带 * 为必填项，身份编号可用于排序与识别。</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
          <label className="block text-[13px] font-semibold text-slate-700 sm:text-sm">
            身份编号
            <input
              value={form.employeeCode}
              onChange={(event) => setForm((prev) => ({ ...prev, employeeCode: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-[14px] outline-none ring-emerald-500 transition focus:ring sm:rounded-xl sm:px-3"
              placeholder="例如：001 或 A-102"
            />
          </label>

          <label className="block text-[13px] font-semibold text-slate-700 sm:text-sm">
            员工姓名 *
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-[14px] outline-none ring-emerald-500 transition focus:ring sm:rounded-xl sm:px-3"
              placeholder="例如：张三"
            />
          </label>

          <label className="block text-[13px] font-semibold text-slate-700 sm:text-sm">
            联系方式
            <input
              value={form.contact}
              onChange={(event) => setForm((prev) => ({ ...prev, contact: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-[14px] outline-none ring-emerald-500 transition focus:ring sm:rounded-xl sm:px-3"
              placeholder="邮箱或手机号"
            />
          </label>

          <label className="block text-[13px] font-semibold text-slate-700 sm:text-sm">
            备注
            <textarea
              rows={3}
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-[14px] outline-none ring-emerald-500 transition focus:ring sm:rounded-xl sm:px-3"
              placeholder="可填写班次、岗位、可出勤时段"
            />
          </label>

          {error ? <p className="text-[13px] text-rose-600 sm:text-sm">{error}</p> : null}

          <div className="flex items-center justify-end gap-2 pt-1.5 sm:pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] rounded-lg border border-slate-300 px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50 sm:rounded-xl sm:px-4 sm:text-sm"
            >
              取消
            </button>
            <button
              type="submit"
              className="min-h-[40px] rounded-lg bg-slate-900 px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-slate-700 sm:rounded-xl sm:px-4 sm:text-sm"
            >
              {mode === 'create' ? '创建' : '保存修改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
