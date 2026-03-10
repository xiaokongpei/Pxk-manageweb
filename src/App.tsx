import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { seedEmployees, seedTasks } from './data/seed';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { type Employee, type EmployeeInput, type Task, type TaskInput } from './types';
import { EmployeeFormModal } from './components/EmployeeFormModal';
import { EmployeePanel } from './components/EmployeePanel';
import { Header } from './components/Header';
import { TaskBatchModal } from './components/TaskBatchModal';
import { TaskBoard } from './components/TaskBoard';
import { TaskExportModal } from './components/TaskExportModal';
import { TaskFilterModal } from './components/TaskFilterModal';
import { TaskFormModal } from './components/TaskFormModal';
import { WorkCalendar } from './components/WorkCalendar';
import { WorkStats } from './components/WorkStats';
import { exportTasksAsCsv, exportTasksAsExcel } from './utils/taskExport';
import { getCurrentBeijingDate } from './utils/beijingTime';

const EMPLOYEE_STORAGE_KEY = 'employee-punch-board-employees';
const TASK_STORAGE_KEY = 'employee-punch-board-tasks';

type EmployeeModalState = {
  open: boolean;
  mode: 'create' | 'edit';
  target: Employee | null;
};

type TaskModalState = {
  open: boolean;
  mode: 'create' | 'edit';
  target: Task | null;
};

type EmployeeDragData = {
  type: 'employee';
  employeeId: string;
};

type TaskDropData = {
  type: 'task';
  taskId: string;
};

type TaskFilters = {
  date: string;
  employeeId: string;
  keyword: string;
};

const emptyTaskFilters: TaskFilters = {
  date: '',
  employeeId: '',
  keyword: '',
};

function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isEmployeeDragData(data: unknown): data is EmployeeDragData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const candidate = data as Partial<EmployeeDragData>;
  return candidate.type === 'employee' && typeof candidate.employeeId === 'string';
}

function isTaskDropData(data: unknown): data is TaskDropData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const candidate = data as Partial<TaskDropData>;
  return candidate.type === 'task' && typeof candidate.taskId === 'string';
}

function normalizeAssigneeIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function normalizeEmployeeCode(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function hasAssigneeDiff(raw: unknown, normalized: string[]): boolean {
  if (!Array.isArray(raw)) {
    return normalized.length > 0;
  }

  if (raw.length !== normalized.length) {
    return true;
  }

  return normalized.some((item, index) => item !== raw[index]);
}

export default function App() {
  const [employees, setEmployees] = useLocalStorageState<Employee[]>(EMPLOYEE_STORAGE_KEY, seedEmployees);
  const [tasks, setTasks] = useLocalStorageState<Task[]>(TASK_STORAGE_KEY, seedTasks);
  const [employeeModal, setEmployeeModal] = useState<EmployeeModalState>({
    open: false,
    mode: 'create',
    target: null,
  });
  const [taskModal, setTaskModal] = useState<TaskModalState>({
    open: false,
    mode: 'create',
    target: null,
  });
  const [taskFilterModalOpen, setTaskFilterModalOpen] = useState(false);
  const [taskExportModalOpen, setTaskExportModalOpen] = useState(false);
  const [taskBatchModalOpen, setTaskBatchModalOpen] = useState(false);
  const [taskFilters, setTaskFilters] = useState<TaskFilters>(emptyTaskFilters);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    setEmployees((prev) => {
      let hasUpdate = false;

      const normalized = prev.map((employee) => {
        const normalizedCode = normalizeEmployeeCode(employee.employeeCode);
        if (normalizedCode === employee.employeeCode) {
          return employee;
        }

        hasUpdate = true;
        return {
          ...employee,
          employeeCode: normalizedCode,
        };
      });

      return hasUpdate ? normalized : prev;
    });
  }, [setEmployees]);

  useEffect(() => {
    const defaultDate = getCurrentBeijingDate();

    setTasks((prev) => {
      let hasUpdate = false;

      const normalized = prev.map((task) => {
        const normalizedDate = typeof task.date === 'string' && task.date.trim() ? task.date : defaultDate;
        const normalizedAssigneeIds = normalizeAssigneeIds(task.assigneeIds);
        const normalizedCompleted = typeof task.completed === 'boolean' ? task.completed : false;

        const shouldUpdate =
          normalizedDate !== task.date ||
          normalizedCompleted !== task.completed ||
          hasAssigneeDiff(task.assigneeIds, normalizedAssigneeIds);

        if (!shouldUpdate) {
          return task;
        }

        hasUpdate = true;

        return {
          ...task,
          date: normalizedDate,
          assigneeIds: normalizedAssigneeIds,
          completed: normalizedCompleted,
        };
      });

      return hasUpdate ? normalized : prev;
    });
  }, [setTasks]);

  useEffect(() => {
    setSelectedTaskIds((prev) => prev.filter((taskId) => tasks.some((task) => task.id === taskId)));
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const employeesById = useMemo(() => {
    return new Map(employees.map((employee) => [employee.id, employee]));
  }, [employees]);

  const filteredTasks = useMemo(() => {
    const normalizedKeyword = taskFilters.keyword.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesDate = !taskFilters.date || task.date === taskFilters.date;
      const assigneeIds = normalizeAssigneeIds(task.assigneeIds);
      const matchesEmployee = !taskFilters.employeeId || assigneeIds.includes(taskFilters.employeeId);
      const searchText = [task.name, task.location, task.topic, task.description].join(' ').toLowerCase();
      const matchesKeyword = !normalizedKeyword || searchText.includes(normalizedKeyword);

      return matchesDate && matchesEmployee && matchesKeyword;
    });
  }, [taskFilters, tasks]);

  const visibleTaskIds = useMemo(() => filteredTasks.map((task) => task.id), [filteredTasks]);
  const selectedVisibleCount = useMemo(
    () => selectedTaskIds.filter((taskId) => visibleTaskIds.includes(taskId)).length,
    [selectedTaskIds, visibleTaskIds],
  );
  const activeFilterCount = useMemo(() => {
    return [taskFilters.date, taskFilters.employeeId, taskFilters.keyword.trim()].filter(Boolean).length;
  }, [taskFilters]);

  const activeEmployee = activeEmployeeId ? employeesById.get(activeEmployeeId) ?? null : null;

  const openCreateEmployeeModal = () => {
    setEmployeeModal({ open: true, mode: 'create', target: null });
  };

  const openEditEmployeeModal = (employee: Employee) => {
    setEmployeeModal({ open: true, mode: 'edit', target: employee });
  };

  const closeEmployeeModal = () => {
    setEmployeeModal({ open: false, mode: 'create', target: null });
  };

  const openCreateTaskModal = () => {
    setTaskModal({ open: true, mode: 'create', target: null });
  };

  const openEditTaskModal = (task: Task) => {
    setTaskModal({ open: true, mode: 'edit', target: task });
  };

  const closeTaskModal = () => {
    setTaskModal({ open: false, mode: 'create', target: null });
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId],
    );
  };

  const selectAllVisibleTasks = () => {
    setSelectedTaskIds(visibleTaskIds);
  };

  const clearSelectedTasks = () => {
    setSelectedTaskIds([]);
  };

  const handleEmployeeFormSubmit = (payload: EmployeeInput) => {
    if (employeeModal.mode === 'edit' && employeeModal.target) {
      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === employeeModal.target?.id
            ? { ...employee, ...payload }
            : employee,
        ),
      );
      closeEmployeeModal();
      return;
    }

    setEmployees((prev) => [...prev, { id: createId('emp'), ...payload }]);
    closeEmployeeModal();
  };

  const handleTaskFormSubmit = (payload: TaskInput) => {
    if (taskModal.mode === 'edit' && taskModal.target) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskModal.target?.id
            ? { ...task, ...payload }
            : task,
        ),
      );
      closeTaskModal();
      return;
    }

    setTasks((prev) => [{ id: createId('task'), ...payload, assigneeIds: [], completed: false }, ...prev]);
    closeTaskModal();
  };

  const deleteEmployee = (employeeId: string) => {
    setEmployees((prev) => prev.filter((employee) => employee.id !== employeeId));
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        assigneeIds: normalizeAssigneeIds(task.assigneeIds).filter((assigneeId) => assigneeId !== employeeId),
      })),
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const deleteTasks = (taskIds: string[]) => {
    if (taskIds.length === 0) {
      return;
    }

    const taskIdSet = new Set(taskIds);
    setTasks((prev) => prev.filter((task) => !taskIdSet.has(task.id)));
    clearSelectedTasks();
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task,
      ),
    );
  };

  const completeTasks = () => {
    if (selectedTaskIds.length === 0) {
      return;
    }

    const taskIdSet = new Set(selectedTaskIds);
    setTasks((prev) =>
      prev.map((task) =>
        taskIdSet.has(task.id)
          ? { ...task, completed: true }
          : task,
      ),
    );
    clearSelectedTasks();
  };

  const assignEmployeeToTask = (employeeId: string, taskId: string) => {
    if (!employeesById.has(employeeId)) {
      return;
    }

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId || task.completed) {
          return task;
        }

        const currentAssignees = normalizeAssigneeIds(task.assigneeIds);
        if (currentAssignees.includes(employeeId)) {
          return task;
        }

        return {
          ...task,
          assigneeIds: [...currentAssignees, employeeId],
        };
      }),
    );
  };

  const assignEmployeeToSelectedTasks = (employeeId: string) => {
    if (selectedTaskIds.length === 0 || !employeesById.has(employeeId)) {
      return;
    }

    const taskIdSet = new Set(selectedTaskIds);
    setTasks((prev) =>
      prev.map((task) => {
        if (!taskIdSet.has(task.id) || task.completed) {
          return task;
        }

        const currentAssignees = normalizeAssigneeIds(task.assigneeIds);
        if (currentAssignees.includes(employeeId)) {
          return task;
        }

        return {
          ...task,
          assigneeIds: [...currentAssignees, employeeId],
        };
      }),
    );
  };

  const unassignEmployeeFromTask = (taskId: string, employeeId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          assigneeIds: normalizeAssigneeIds(task.assigneeIds).filter((id) => id !== employeeId),
        };
      }),
    );
  };

  const resetSampleData = () => {
    const shouldReset = window.confirm('确定要重置本地数据并恢复示例员工和任务吗？');
    if (!shouldReset) {
      return;
    }

    setEmployees(seedEmployees);
    setTasks(seedTasks);
    setTaskFilters(emptyTaskFilters);
    clearSelectedTasks();
  };

  const handleBulkDelete = () => {
    if (selectedTaskIds.length === 0) {
      return;
    }

    const shouldDelete = window.confirm(`确定要删除选中的 ${selectedTaskIds.length} 项任务吗？`);
    if (!shouldDelete) {
      return;
    }

    deleteTasks(selectedTaskIds);
  };

  const handleExportCsv = () => {
    exportTasksAsCsv(filteredTasks, employeesById);
    setTaskExportModalOpen(false);
  };

  const handleExportExcel = () => {
    exportTasksAsExcel(filteredTasks, employeesById);
    setTaskExportModalOpen(false);
  };

  const onDragStart = (event: DragStartEvent) => {
    if (isEmployeeDragData(event.active.data.current)) {
      setActiveEmployeeId(event.active.data.current.employeeId);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    if (!event.over) {
      setActiveEmployeeId(null);
      return;
    }

    const activeData = event.active.data.current;
    const overData = event.over.data.current;

    if (isEmployeeDragData(activeData) && isTaskDropData(overData)) {
      assignEmployeeToTask(activeData.employeeId, overData.taskId);
    }

    setActiveEmployeeId(null);
  };

  const onDragCancel = () => {
    setActiveEmployeeId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className="app-shell">
        <div className="mx-auto max-w-[1450px]">
          <Header
            employeesCount={employees.length}
            tasksCount={tasks.length}
            activeFilterCount={activeFilterCount}
            selectedTaskCount={selectedTaskIds.length}
            onAddEmployee={openCreateEmployeeModal}
            onAddTask={openCreateTaskModal}
            onOpenTaskFilter={() => setTaskFilterModalOpen(true)}
            onOpenTaskExport={() => setTaskExportModalOpen(true)}
            onOpenTaskBatch={() => setTaskBatchModalOpen(true)}
            onReset={resetSampleData}
          />

          <main className="grid gap-5 xl:grid-cols-[340px,1fr]">
            <EmployeePanel
              employees={employees}
              onEdit={openEditEmployeeModal}
              onDelete={deleteEmployee}
            />
            <TaskBoard
              tasks={filteredTasks}
              totalTaskCount={tasks.length}
              selectedTaskIds={selectedTaskIds}
              selectedVisibleCount={selectedVisibleCount}
              employeesById={employeesById}
              onEdit={openEditTaskModal}
              onDelete={deleteTask}
              onUnassign={unassignEmployeeFromTask}
              onToggleSelect={toggleTaskSelection}
              onToggleComplete={toggleTaskComplete}
            />
          </main>

          <section className="mt-5 grid gap-5 2xl:grid-cols-[1.2fr,0.8fr]">
            <WorkCalendar tasks={tasks} employeesById={employeesById} />
            <WorkStats employees={employees} tasks={tasks} />
          </section>
        </div>
      </div>

      <DragOverlay>
        {activeEmployee ? (
          <div className="w-64 rounded-xl border border-emerald-400 bg-white p-3 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">拖拽中</p>
            <p className="mt-1 font-semibold text-slate-900">{activeEmployee.name}</p>
            <p className="text-xs text-slate-500">编号 {activeEmployee.employeeCode || '未设'} | {activeEmployee.contact || '未填写联系方式'}</p>
          </div>
        ) : null}
      </DragOverlay>

      <EmployeeFormModal
        open={employeeModal.open}
        mode={employeeModal.mode}
        initialValue={employeeModal.target}
        onClose={closeEmployeeModal}
        onSubmit={handleEmployeeFormSubmit}
      />

      <TaskFormModal
        open={taskModal.open}
        mode={taskModal.mode}
        initialValue={taskModal.target}
        onClose={closeTaskModal}
        onSubmit={handleTaskFormSubmit}
      />

      <TaskFilterModal
        open={taskFilterModalOpen}
        filters={taskFilters}
        employees={employees}
        onClose={() => setTaskFilterModalOpen(false)}
        onApply={setTaskFilters}
        onClear={() => setTaskFilters(emptyTaskFilters)}
      />

      <TaskExportModal
        open={taskExportModalOpen}
        taskCount={filteredTasks.length}
        onClose={() => setTaskExportModalOpen(false)}
        onExportCsv={handleExportCsv}
        onExportExcel={handleExportExcel}
      />

      <TaskBatchModal
        open={taskBatchModalOpen}
        employees={employees}
        selectedCount={selectedTaskIds.length}
        visibleCount={filteredTasks.length}
        onClose={() => setTaskBatchModalOpen(false)}
        onSelectAllVisible={selectAllVisibleTasks}
        onClearSelection={clearSelectedTasks}
        onBulkComplete={completeTasks}
        onBulkDelete={handleBulkDelete}
        onBulkAssign={assignEmployeeToSelectedTasks}
      />
    </DndContext>
  );
}
