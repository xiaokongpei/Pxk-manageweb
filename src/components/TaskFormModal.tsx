import { useEffect, useState, type FormEvent } from 'react';
import { type Task, type TaskInput } from '../types';
import { getCurrentBeijingDate } from '../utils/beijingTime';

interface TaskFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialValue: Task | null;
  onClose: () => void;
  onSubmit: (payload: TaskInput) => void;
}

function createEmptyState(): TaskInput {
  return {
    name: '',
    date: getCurrentBeijingDate(),
    time: '',
    location: '',
    topic: '',
    description: '',
  };
}

export function TaskFormModal({
  open,
  mode,
  initialValue,
  onClose,
  onSubmit,
}: TaskFormModalProps) {
  const [form, setForm] = useState<TaskInput>(() => createEmptyState());
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === 'edit' && initialValue) {
      setForm({
        name: initialValue.name,
        date: initialValue.date || getCurrentBeijingDate(),
        time: initialValue.time,
        location: initialValue.location,
        topic: initialValue.topic,
        description: initialValue.description,
      });
      setError('');
      return;
    }

    setForm(createEmptyState());
    setError('');
  }, [open, mode, initialValue]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError('任务名称不能为空。');
      return;
    }

    if (!form.date.trim()) {
      setError('任务日期不能为空。');
      return;
    }

    onSubmit({
      name: form.name.trim(),
      date: form.date.trim(),
      time: form.time.trim(),
      location: form.location.trim(),
      topic: form.topic.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-900/45 p-2 pt-4 sm:items-center sm:p-3 sm:pt-6 md:p-4">
      <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-3 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl sm:p-4 md:p-6">
        <h2 className="heading-font text-xl font-bold text-slate-900 sm:text-2xl">
          {mode === 'create' ? '创建任务' : '编辑任务'}
        </h2>
        <p className="mt-0.5 text-[13px] text-slate-500 sm:mt-1 sm:text-sm">请填写任务信息并安排人员。</p>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3 md:grid-cols-2">
          <label className="block text-[13px] font-semibold text-slate-700 sm:text-sm md:col-span-2">
            任务名称 *
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-[14px] outline-none ring-emerald-500 transition focus:ring sm:rounded-xl sm:px-3"
              placeholder="例如：考勤异常核查"
            />
          </label>

          <label className="block text-[13px] font-semibold text-slate-700 sm:text-sm">
            日期 *
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-[14px] outline-none ring-emerald-500 transition focus:ring sm:rounded-xl sm:px-3"
            />
          </label>

          <label className="block text-[13px] font-semibold text-slate-700 sm:text-sm">
            时间
            <input
              value={form.time}
              onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-[14px] outline-none ring-emerald-500 transition focus:ring sm:rounded-xl sm:px-3"
              placeholder="09:00"
            />
          </label>

          <label className="block text-[13px] font-semibold text-slate-700 sm:text-sm">
            地点
            <input
              value={form.location}
              onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-[14px] outline-none ring-emerald-500 transition focus:ring sm:rounded-xl sm:px-3"
              placeholder="办公室 / 线上"
            />
          </label>

          <label className="block text-[13px] font-semibold text-slate-700 sm:text-sm md:col-span-2">
            主题
            <input
              value={form.topic}
              onChange={(event) => setForm((prev) => ({ ...prev, topic: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-[14px] outline-none ring-emerald-500 transition focus:ring sm:rounded-xl sm:px-3"
              placeholder="任务目标"
            />
          </label>

          <label className="block text-[13px] font-semibold text-slate-700 sm:text-sm md:col-span-2">
            任务说明
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-[14px] outline-none ring-emerald-500 transition focus:ring sm:rounded-xl sm:px-3"
              placeholder="填写执行范围、检查清单、预期结果"
            />
          </label>

          {error ? <p className="text-[13px] text-rose-600 sm:text-sm md:col-span-2">{error}</p> : null}

          <div className="flex items-center justify-end gap-2 pt-1.5 sm:pt-2 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] rounded-lg border border-slate-300 px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50 sm:rounded-xl sm:px-4 sm:text-sm"
            >
              取消
            </button>
            <button
              type="submit"
              className="min-h-[40px] rounded-lg bg-emerald-600 px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-emerald-500 sm:rounded-xl sm:px-4 sm:text-sm"
            >
              {mode === 'create' ? '创建' : '保存修改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
