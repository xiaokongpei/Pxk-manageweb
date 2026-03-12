import { useEffect, useState } from 'react';
import { type Employee, type Task } from '../types';

interface TaskAssigneeModalProps {
  open: boolean;
  task: Task | null;
  employees: Employee[];
  onClose: () => void;
  onSave: (taskId: string, assigneeIds: string[]) => void;
}

export function TaskAssigneeModal({ open, task, employees, onClose, onSave }: TaskAssigneeModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open || !task) {
      return;
    }

    setSelectedIds(Array.isArray(task.assigneeIds) ? task.assigneeIds : []);
  }, [open, task]);

  if (!open || !task) {
    return null;
  }

  const selectedIdSet = new Set(selectedIds);

  const toggleEmployee = (employeeId: string) => {
    setSelectedIds((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId],
    );
  };

  const handleSave = () => {
    onSave(task.id, selectedIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-900/45 p-2 pt-4 sm:items-center sm:p-3 sm:pt-6 md:p-4">
      <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-3 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl sm:p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="heading-font text-xl font-bold text-slate-900 sm:text-2xl">人员分配</h2>
            <p className="mt-0.5 text-[13px] text-slate-500 sm:mt-1 sm:text-sm">为"{task.name}"选择参与员工。</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 sm:px-3 sm:text-xs">
            已选 {selectedIds.length} 人
          </span>
        </div>

        {employees.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-8 text-center text-[13px] text-slate-500 sm:mt-5 sm:rounded-2xl sm:px-4 sm:py-10 sm:text-sm">
            还没有员工，请先新增员工。
          </div>
        ) : (
          <div className="mobile-scroll mt-4 grid max-h-[50vh] gap-2 overflow-y-auto pr-0.5 sm:mt-5 sm:max-h-[52vh] sm:grid-cols-2 sm:gap-3 sm:pr-1">
            {employees.map((employee) => {
              const checked = selectedIdSet.has(employee.id);

              return (
                <label
                  key={employee.id}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-[16px] border px-3 py-2.5 transition sm:rounded-[20px] sm:gap-3 sm:px-4 sm:py-3 ${
                    checked
                      ? 'border-emerald-300 bg-emerald-50/80 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleEmployee(employee.id)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <p className="text-[13px] font-semibold text-slate-900 sm:text-sm">{employee.name}</p>
                      <span className="rounded-full border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[9px] font-semibold text-sky-700 sm:px-2 sm:text-[10px]">
                        编号 {employee.employeeCode || '未设'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500 sm:mt-1 sm:text-xs">{employee.contact || '未填写联系方式'}</p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500 sm:mt-2 sm:text-xs sm:leading-5">{employee.notes || '暂无备注。'}</p>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        <div className="mt-4 flex items-center justify-end gap-2 sm:mt-5">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] rounded-lg border border-slate-300 px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50 sm:rounded-xl sm:px-4 sm:text-sm"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="min-h-[40px] rounded-lg bg-emerald-600 px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-emerald-500 sm:rounded-xl sm:px-4 sm:text-sm"
          >
            保存分配
          </button>
        </div>
      </div>
    </div>
  );
}
