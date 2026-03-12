# Pxk Manage Web

员工任务与打卡管理看板，支持云端数据同步与多用户隔离。

## 项目简介

这是一个现代化的员工任务管理系统，支持多设备数据同步、用户数据隔离、拖拽分配任务等功能。每位用户拥有独立的数据空间，登录后可在任意设备访问自己的数据。

## 在线访问

Firebase Hosting 部署地址：

**[https://the-minister-s-rebirth-pxk.web.app](https://the-minister-s-rebirth-pxk.web.app)**

## 核心功能

### 用户系统
- 邮箱密码注册 / 登录
- Google 账号快捷登录
- 用户数据完全隔离，每人只能看到自己的数据

### 员工管理
- 维护员工编号、姓名、联系方式、备注
- 支持添加、编辑、删除员工

### 任务管理
- 创建、编辑、删除任务
- 待完成任务池 / 已完成任务池
- 任务状态切换（待办 / 已完成）

### 拖拽分配
- 从员工列表拖拽到任务卡片进行分配
- 可视化分配状态

### 统计与分析
- 工作日历视图（基于北京时间）
- 员工工作次数统计图表
- 支持按编号或工作次数排序

### 筛选与导出
- 按日期、员工、关键词筛选任务
- 批量完成、批量删除、批量分配
- 导出 CSV / Excel 格式

### 云端同步
- Firebase Firestore 实时数据库
- 多设备自动同步
- 数据持久化存储

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 18 |
| 构建工具 | Vite |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 拖拽 | @dnd-kit/core |
| 后端服务 | Firebase |
| 认证 | Firebase Authentication |
| 数据库 | Firebase Firestore |
| 托管 | Firebase Hosting |

## 本地开发

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 配置 Firebase（如需云同步功能）

1. 创建 Firebase 项目：[Firebase Console](https://console.firebase.google.com/)
2. 启用 Authentication（邮箱密码 + Google 登录）
3. 启用 Firestore Database
4. 创建 `.env` 文件：

```env
VITE_FIREBASE_API_KEY=你的API密钥
VITE_FIREBASE_AUTH_DOMAIN=你的项目ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=你的项目ID
VITE_FIREBASE_STORAGE_BUCKET=你的项目ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=你的发送者ID
VITE_FIREBASE_APP_ID=你的应用ID
```

### 启动开发服务器

```bash
npm run dev
```

### 其他命令

```bash
npm run build      # 生产构建
npm run preview    # 预览构建产物
npm run typecheck  # 类型检查
```

## 项目结构

```text
.
├── src/
│   ├── components/     # React 组件
│   │   ├── AuthPage.tsx
│   │   ├── EmployeePanel.tsx
│   │   ├── TaskBoard.tsx
│   │   ├── TaskCard.tsx
│   │   └── ...
│   ├── contexts/       # React Context
│   │   └── AuthContext.tsx
│   ├── hooks/          # 自定义 Hooks
│   │   └── useFirestoreState.ts
│   ├── lib/            # 第三方库配置
│   │   └── firebase.ts
│   ├── data/           # 初始数据
│   ├── utils/          # 工具函数
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
├── firebase.json       # Firebase 配置
├── .firebaserc         # Firebase 项目配置
├── vite.config.ts
├── tailwind.config.cjs
└── package.json
```

## 部署指南

### 部署到 Firebase Hosting

1. 安装 Firebase CLI：
   ```bash
   npm install -g firebase-tools
   ```

2. 登录 Firebase：
   ```bash
   firebase login
   ```

3. 初始化项目（如果还没有）：
   ```bash
   firebase init hosting
   ```

4. 构建并部署：
   ```bash
   npm run build
   firebase deploy
   ```

### 部署到其他平台

如需部署到其他平台（如 Vercel、Netlify），只需：

1. 修改 `vite.config.ts` 中的 `base` 配置
2. 运行 `npm run build`
3. 上传 `dist` 目录

## 数据安全说明

- 所有用户数据存储在 Firebase Firestore
- 每位用户只能访问自己创建的数据
- Firebase 安全规则确保数据隔离
- 建议在生产环境中配置 Firestore 安全规则

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
