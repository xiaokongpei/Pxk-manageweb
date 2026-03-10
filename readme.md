# Employee Punch Record Management System

A complete web project built with **Vite + React + TypeScript + Tailwind CSS + dnd-kit**.

## Features

- Employee management
  - Create / edit / delete employees
  - Required validation for employee name
  - Employee fields: name, contact, notes
- Task management
  - Create / edit / delete tasks
  - Task fields: name, date, time, location, topic, description
  - Task card shows details and assigned employees
- Drag-and-drop assignment
  - Drag employee cards from left panel to task cards
  - Duplicate assignment to the same task is prevented
  - Remove assigned employee from each task card
  - Visual highlight while dragging over droppable task cards
- Beijing calendar module
  - Realtime Beijing date/time display (`Asia/Shanghai`)
  - Month navigation + quick "Back to Today"
  - Every day cell previews that day's task arrangements
  - Selected day panel shows full task details and assigned employees
- Workload statistics module
  - Rank employees by task participation count (descending)
  - Show total assignments / active employees / per-person average
  - Visual progress bars for quick comparison of workload
  - Detailed task records per employee
- Data and persistence
  - Frontend local state management
  - `localStorage` persistence
  - Built-in sample employees and tasks
- UI/UX
  - Apple-inspired glassmorphism style with gradient atmosphere
  - Subtle scale and hover motion for cards and interactive blocks
  - Responsive desktop-first interface with mobile fallback

## Project Structure

```text
.
|- index.html
|- package.json
|- postcss.config.cjs
|- tailwind.config.cjs
|- tsconfig.json
|- tsconfig.node.json
|- vite.config.ts
|- src/
|  |- App.tsx
|  |- index.css
|  |- main.tsx
|  |- types.ts
|  |- data/
|  |  |- seed.ts
|  |- hooks/
|  |  |- useLocalStorageState.ts
|  |- utils/
|  |  |- beijingTime.ts
|  |- components/
|     |- Header.tsx
|     |- EmployeePanel.tsx
|     |- EmployeeFormModal.tsx
|     |- TaskBoard.tsx
|     |- TaskCard.tsx
|     |- TaskFormModal.tsx
|     |- WorkCalendar.tsx
|     |- WorkStats.tsx
```

## Install Dependencies

```bash
npm install
```

## Run in Development

```bash
npm run dev
```

## Build for Production

```bash
npm run build
```

## Preview Build

```bash
npm run preview
```

## Notes

- Drag behavior is implemented with `@dnd-kit/core` and `@dnd-kit/utilities`.
- Employee deletion automatically removes that employee from all task assignments.
- Data reset action is available in the top header.
- The calendar and date defaults follow Beijing time (`Asia/Shanghai`).
