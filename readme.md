# Pxk Manage Web

员工任务与打卡管理看板，基于 Vite、React、TypeScript、Tailwind CSS 和 dnd-kit 构建。

## 项目简介

这个项目用于管理员工、任务分配和工作统计，适合轻量级的内部排班、打卡辅助和任务跟踪场景。系统支持拖拽分配员工到任务、任务状态管理、按条件筛选任务、批量操作和数据导出。

## 在线访问

GitHub Pages 部署地址：

[https://xiaokongpei.github.io/Pxk-manageweb/](https://xiaokongpei.github.io/Pxk-manageweb/)

首次部署后，如果页面没有立刻可见，通常等待 GitHub Actions 执行完成即可。

## 核心功能

- 员工管理
- 为员工维护身份编号、姓名、联系方式和备注
- 任务管理
- 创建、编辑、删除任务
- 待完成任务池 / 已完成任务池
- 可将任务标记完成或恢复为待办
- 拖拽分配
- 从员工列表拖拽到任务卡片进行分配
- 统计与分析
- 基于北京时间的任务日历
- 员工工作次数柱状图统计
- 支持按员工编号或工作次数排序
- 筛选、批量操作与导出
- 按日期、员工、关键词筛选任务
- 批量完成、批量删除、批量分配员工
- 导出 CSV / Excel
- 本地持久化
- 使用 `localStorage` 保存数据

## 技术栈

- `Vite`
- `React 18`
- `TypeScript`
- `Tailwind CSS`
- `@dnd-kit/core`
- `@dnd-kit/utilities`

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

### 类型检查

```bash
npm run typecheck
```

### 生产构建

```bash
npm run build
```

### 本地预览构建产物

```bash
npm run preview
```

## 项目结构

```text
.
|- .github/
|  |- workflows/
|     |- deploy.yml
|- src/
|  |- components/
|  |- data/
|  |- hooks/
|  |- utils/
|  |- App.tsx
|  |- index.css
|  |- main.tsx
|  |- types.ts
|- index.html
|- package.json
|- tailwind.config.cjs
|- tsconfig.json
|- vite.config.ts
```

## GitHub Pages 部署说明

项目已经配置 GitHub Pages 自动部署：

- 工作流文件：`.github/workflows/deploy.yml`
- Vite 部署基础路径：`/Pxk-manageweb/`

当代码推送到 `main` 分支后，GitHub Actions 会自动：

1. 安装依赖
2. 执行构建
3. 发布 `dist` 目录到 GitHub Pages

如果仓库还没有启用 GitHub Pages，请在 GitHub 仓库设置中确认：

- `Settings`
- `Pages`
- `Source` 使用 `GitHub Actions`

## 说明

- 删除任务后，对应员工的工作次数会自动减少。
- 员工编号用于识别和排序，不影响拖拽分配逻辑。
- 日期相关展示默认采用北京时间（`Asia/Shanghai`）。
