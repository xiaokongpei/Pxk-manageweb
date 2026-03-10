import { type Employee, type Task } from '../types';
import { getCurrentBeijingDate, shiftDateString } from '../utils/beijingTime';

const today = getCurrentBeijingDate();
const tomorrow = shiftDateString(today, 1);
const dayAfterTomorrow = shiftDateString(today, 2);

export const seedEmployees: Employee[] = [
  {
    id: 'emp-lihua',
    employeeCode: '001',
    name: '李华',
    contact: 'lihua@company.local',
    notes: '早班负责人，熟悉前台流程。',
  },
  {
    id: 'emp-wangmin',
    employeeCode: '002',
    name: '王敏',
    contact: 'wangmin@company.local',
    notes: '擅长活动支持与沟通协调。',
  },
  {
    id: 'emp-zhaolei',
    employeeCode: '003',
    name: '赵磊',
    contact: 'zhaolei@company.local',
    notes: '兼职员工，上午时段可排班。',
  },
];

export const seedTasks: Task[] = [
  {
    id: 'task-briefing',
    name: '晨会打卡核对',
    date: today,
    time: '08:30',
    location: '总部 A 会议室',
    topic: '日常同步',
    description: '复核昨日打卡异常，明确当天优先处理事项。',
    assigneeIds: ['emp-lihua'],
    completed: false,
  },
  {
    id: 'task-audit',
    name: '考勤数据抽检',
    date: tomorrow,
    time: '11:00',
    location: '运营工位',
    topic: '数据质检',
    description: '核查漏打卡与重复记录，并在中午前完成反馈。',
    assigneeIds: [],
    completed: false,
  },
  {
    id: 'task-training',
    name: '新员工系统培训',
    date: dayAfterTomorrow,
    time: '15:00',
    location: '培训室 C',
    topic: '入职培训',
    description: '讲解打卡系统流程，完成权限开通与操作演示。',
    assigneeIds: ['emp-wangmin'],
    completed: false,
  },
];
