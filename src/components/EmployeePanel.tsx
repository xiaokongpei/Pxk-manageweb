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
        opacity: isDragging ? 0.42 : 1,
      }}
      className="group rounded-[18px] border border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(245,248,253,0.82))] p-3 shadow-[0_16px_34px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_54px_rgba(15,23,42,0.12)] sm:rounded-[22px] sm:p-3.5 lg:rounded-[26px] lg:p-4"
    >
      <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3 lg:items-start lg:justify-between">
        <div
          {...attributes}
          {...listeners}
          className="touch-drag-handle flex-1 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-slate-950 sm:text-base">{employee.name}</h3>
            <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-sky-700 sm:px-2.5 sm:py-1 sm:text-[10px]">
              ID {employee.employeeCode || '未设'}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] text-slate-500 sm:mt-2 sm:text-sm">{employee.contact || '未填写联系方式'}</p>
          <p className="mt-2 rounded-xl bg-slate-950/[0.035] px-2.5 py-1.5 text-[11px] leading-5 text-slate-600 sm:mt-3 sm:rounded-2xl sm:px-3 sm:py-2 sm:text-xs sm:leading-6">
            {employee.notes || '暂无备注。'}
          </p>
        </div>

        <div className="flex gap-2 sm:flex-col lg:flex-row">
          <button
            type="button"
            onClick={() => onEdit(employee)}
            className="min-h-[36px] flex-1 rounded-full border border-slate-200 bg-white/80 px-3 text-[11px] font-semibold text-slate-700 transition hover:bg-white sm:min-h-[38px] sm:text-xs lg:min-w-[60px]"
          >
            编辑
          </button>
          <button
            type="button"
            onClick={() => onDelete(employee.id)}
            className="min-h-[36px] flex-1 rounded-full border border-rose-200 bg-rose-50/75 px-3 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-50 sm:min-h-[38px] sm:text-xs lg:min-w-[60px]"
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

    const step = 104;

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
    <section className="glass-panel relative overflow-hidden p-3 sm:p-4 md:p-5">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-24 rounded-full bg-sky-200/20 blur-3xl" />

      <div className="relative z-10 mb-3 flex items-start justify-between gap-2 sm:mb-4 sm:gap-3">
        <div>
          <p className="section-kicker hidden sm:inline-flex">员工区</p>
          <h2 className="heading-font text-lg font-semibold tracking-[-0.03em] text-slate-950 sm:mt-1 sm:text-xl lg:mt-2">员工列表</h2>
          <p className="mt-0.5 text-[13px] leading-5 text-slate-500 sm:mt-1 sm:text-sm sm:leading-6">拖拽员工到任务卡片进行分配。</p>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm sm:px-3 sm:py-1.5 sm:text-xs">
          {employees.length} 人
        </span>
      </div>

      {employees.length === 0 ? (
        <div className="relative z-10 rounded-[20px] border border-dashed border-slate-300 bg-white/60 px-4 py-8 text-center text-[13px] text-slate-500 sm:rounded-[24px] sm:py-10 md:rounded-[28px] md:text-sm md:py-12">
          暂无员工，点击上方"新增员工"开始。
        </div>
      ) : (
        <>
          <div className="relative z-10 mb-2.5 rounded-[16px] border border-white/70 bg-white/65 px-3 py-2 text-[10px] font-semibold leading-5 text-slate-600 shadow-sm sm:mb-3 sm:rounded-[20px] sm:px-4 sm:py-3 sm:text-[11px] sm:leading-6">
            拖拽员工卡片到任务进行分配。桌面端可按 ↑ / ↓ 键浏览。
          </div>

          <div
            tabIndex={0}
            onKeyDown={handleArrowScroll}
            className="relative z-10 h-[50vh] min-h-[260px] max-h-[380px] overflow-hidden rounded-[20px] border border-white/80 bg-white/42 p-1.5 outline-none ring-sky-400/70 transition focus:ring-2 sm:rounded-[24px] sm:p-2 md:h-[520px] md:max-h-[480px] lg:h-[620px] lg:max-h-[560px] xl:h-[720px]"
          >
            <ul ref={listRef} className="mobile-scroll stagger-grid h-full space-y-2 overflow-y-auto pr-1 sm:space-y-3">
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
