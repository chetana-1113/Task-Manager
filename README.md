# Full-Stack Task Management Web Application

## Features
- **Frontend**: Built with React (Vite) offering a clean, responsive UI with premium CSS aesthetics and micro-animations.
- **Backend**: Node.js and Express powering REST API CRUD endpoints.
- **Database**: MongoDB integration configured with Mongoose schemas.
- **Advanced Features**: Drag-and-drop Task Organization (Kanban-style) & Dark Mode toggling!

## Setup and Run Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A running instance of MongoDB locally or on MongoDB Atlas.

### 2. Run the Backend API Server
Open a new terminal and run:
```bash
cd "task-manager/backend"
npm start
```
The server will now be running on `http://localhost:5000` connected to MongoDB `mongodb://127.0.0.1:27017/task-manager`

### 3. Run the Frontend App
Open a separate terminal and run:
```bash
cd "task-manager/frontend"
npm run dev
```
You can access your React dashboard typically on `http://localhost:5173`

### Deployment Guides
- **Frontend** can be deployed statically directly to Vercel/Netlify by uploading the `frontend/` directory and setting build command to `npm run build` and output directory to `dist`.
- **Backend** can be deployed via Render or Heroku by specifying `node server.js` as the start command, and providing `MONGO_URI` in their configuration variables using a MongoDB Atlast string.
"# Task_Manager-App" 
