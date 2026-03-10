import { type KeyboardEvent, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { type Employee } from '../types';

interface EmployeePanelProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
}

interface EmployeeItemProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
}

function EmployeeItem({ employee, onEdit, onDelete }: EmployeeItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `employee:${employee.id}`,
    data: {
      type: 'employee',
      employeeId: employee.id,
    },
  });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.45 : 1,
      }}
      className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          {...attributes}
          {...listeners}
          className="flex-1 cursor-grab active:cursor-grabbing"
          title="拖拽到任务卡分配"
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">{employee.name}</h3>
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
              编号 {employee.employeeCode || '未设'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">{employee.contact || '未填写联系方式'}</p>
          <p className="mt-2 text-xs text-slate-600">{employee.notes || '暂无备注'}</p>
        </div>

        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onEdit(employee)}
            className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            编辑
          </button>
          <button
            type="button"
            onClick={() => onDelete(employee.id)}
            className="rounded-lg border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            删除
          </button>
        </div>
      </div>
    </li>
  );
}

export function EmployeePanel({ employees, onEdit, onDelete }: EmployeePanelProps) {
  const listRef = useRef<HTMLUListElement | null>(null);

  const handleArrowScroll = (event: KeyboardEvent<HTMLDivElement>) => {
    const listElement = listRef.current;
    if (!listElement) {
      return;
    }

    const step = 94;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      listElement.scrollBy({ top: step, behavior: 'smooth' });
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      listElement.scrollBy({ top: -step, behavior: 'smooth' });
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      listElement.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      listElement.scrollTo({ top: listElement.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <section className="glass-panel p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="heading-font text-lg font-bold text-slate-900">员工列表</h2>
          <p className="text-xs text-slate-500">拖拽员工到右侧任务卡进行分配。</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {employees.length}
        </span>
      </div>

      {employees.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          暂无员工，点击“新增员工”开始。
        </div>
      ) : (
        <>
          <div className="mb-3 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-[11px] font-semibold text-slate-600">
            固定显示区域：点击下方列表后可按 ↑ / ↓ 键上下浏览，Home/End 可快速到顶部或底部。
          </div>

          <div
            tabIndex={0}
            onKeyDown={handleArrowScroll}
            className="h-[430px] rounded-xl border border-slate-200 bg-white/35 p-2 outline-none ring-emerald-400 transition focus:ring-2"
          >
            <ul ref={listRef} className="h-full space-y-3 overflow-y-auto pr-1">
              {employees.map((employee) => (
                <EmployeeItem
                  key={employee.id}
                  employee={employee}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
