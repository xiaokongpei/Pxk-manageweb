export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  contact: string;
  notes: string;
}

export interface Task {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  topic: string;
  description: string;
  assigneeIds: string[];
  completed: boolean;
}

export type EmployeeInput = Omit<Employee, 'id'>;
export type TaskInput = Omit<Task, 'id' | 'assigneeIds' | 'completed'>;
