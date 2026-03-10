function escapeCsvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return /[",\n]/.test(value) ? `"${escaped}"` : escaped;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type ExportTaskRow = {
  status: string;
  name: string;
  date: string;
  time: string;
  location: string;
  topic: string;
  description: string;
  assignees: string;
  assigneeCount: string;
};

type ExportTask = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  topic: string;
  description: string;
  completed: boolean;
  assigneeIds: string[];
};

function downloadFile(content: BlobPart, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function createFileName(prefix: string, extension: string): string {
  const stamp = new Date().toISOString().slice(0, 10);
  return `${prefix}-${stamp}.${extension}`;
}

function toRows(tasks: ExportTask[], employeesById: Map<string, { name: string }>): ExportTaskRow[] {
  return tasks.map((task) => {
    const assignees = task.assigneeIds
      .map((employeeId) => employeesById.get(employeeId)?.name)
      .filter((name): name is string => Boolean(name))
      .join('、');

    return {
      status: task.completed ? '已完成' : '待完成',
      name: task.name,
      date: task.date,
      time: task.time || '',
      location: task.location || '',
      topic: task.topic || '',
      description: task.description || '',
      assignees,
      assigneeCount: String(task.assigneeIds.length),
    };
  });
}

export function exportTasksAsCsv(tasks: ExportTask[], employeesById: Map<string, { name: string }>) {
  const rows = toRows(tasks, employeesById);
  const header = ['状态', '任务名称', '日期', '时间', '地点', '主题', '说明', '已分配员工', '员工数量'];
  const body = rows.map((row) => [
    row.status,
    row.name,
    row.date,
    row.time,
    row.location,
    row.topic,
    row.description,
    row.assignees,
    row.assigneeCount,
  ]);

  const csv = [header, ...body]
    .map((line) => line.map((cell) => escapeCsvCell(cell)).join(','))
    .join('\r\n');

  downloadFile(`\uFEFF${csv}`, createFileName('tasks-export', 'csv'), 'text/csv;charset=utf-8;');
}

export function exportTasksAsExcel(tasks: ExportTask[], employeesById: Map<string, { name: string }>) {
  const rows = toRows(tasks, employeesById);
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
        <table border="1">
          <thead>
            <tr>
              <th>状态</th>
              <th>任务名称</th>
              <th>日期</th>
              <th>时间</th>
              <th>地点</th>
              <th>主题</th>
              <th>说明</th>
              <th>已分配员工</th>
              <th>员工数量</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
                  <tr>
                    <td>${escapeHtml(row.status)}</td>
                    <td>${escapeHtml(row.name)}</td>
                    <td>${escapeHtml(row.date)}</td>
                    <td>${escapeHtml(row.time)}</td>
                    <td>${escapeHtml(row.location)}</td>
                    <td>${escapeHtml(row.topic)}</td>
                    <td>${escapeHtml(row.description)}</td>
                    <td>${escapeHtml(row.assignees)}</td>
                    <td>${escapeHtml(row.assigneeCount)}</td>
                  </tr>
                `,
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  downloadFile(html, createFileName('tasks-export', 'xls'), 'application/vnd.ms-excel;charset=utf-8;');
}
