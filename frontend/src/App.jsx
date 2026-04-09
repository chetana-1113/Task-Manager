import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FiEdit2, FiTrash2, FiPlus, FiBookOpen, FiLogOut } from 'react-icons/fi';
import * as api from './api';
import TaskForm from './components/TaskForm';
import Login from './components/Login';

const Dashboard = ({ user, handleLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = ['Pending', 'In Progress', 'Completed'];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.getTasks();
      setTasks(data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
      console.error('Failed to fetch tasks', err);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const updatedTasks = tasks.map(task => {
      if (task._id === draggableId) return { ...task, status: destination.droppableId };
      return task;
    });
    setTasks(updatedTasks);
    try {
      await api.updateTask(draggableId, { status: destination.droppableId });
    } catch (err) { fetchTasks(); }
  };

  const handleSaveTask = async (taskData, id) => {
    try {
      if (id) await api.updateTask(id, taskData);
      else await api.createTask(taskData);
      fetchTasks();
      closeForm();
    } catch (err) {}
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Erase this page from your book?')) {
      try {
        await api.deleteTask(id);
        fetchTasks();
      } catch (err) {}
    }
  };

  const openEditForm = (task) => { setEditingTask(task); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditingTask(null); };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="app-container">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <header style={{ textAlign: 'center', width: '100%' }}>
          <h1>Task Manager</h1>
          <p className="subtitle">Welcome back, {user.name}. Manage your workflow clearly.</p>
          
          <div className="header-controls">
            <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
              <FiPlus /> New Task
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              <FiLogOut /> Sign Out
            </button>
          </div>
        </header>

        <div className="toolbar">
          <input 
            type="text" 
            placeholder="Search your tasks..." 
            className="form-control" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-board">
            {columns.map(status => (
              <div key={status} className="kanban-column">
                <div className="column-header">
                  {status} 
                  <span className="column-badge">{filteredTasks.filter(t => t.status === status).length}</span>
                </div>
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
                      {filteredTasks.filter(task => task.status === status).map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div className="task-card" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <h3 className="task-title">{task.title}</h3>
                                {task.description && <p className="task-desc">{task.description}</p>}
                                
                                <div className="task-meta">
                                  <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                                  {task.dueDate && <span className="date-text">{new Date(task.dueDate).toLocaleDateString()}</span>}
                                  <div className="task-actions">
                                    <button className="btn-icon" title="Edit" onClick={() => openEditForm(task)}><FiEdit2 size={16} /></button>
                                    <button className="btn-icon danger-icon" title="Delete" onClick={() => handleDeleteTask(task._id)}><FiTrash2 size={16} /></button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
      {isFormOpen && <TaskForm onClose={closeForm} onSave={handleSaveTask} task={editingTask} />}
    </div>
  );
};

const App = () => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) setAuthUser(JSON.parse(user));
    setLoading(false);
    
    // Always dreamy book aesthetic
    document.body.setAttribute('data-theme', 'dreamy');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthUser(null);
  };

  if (loading) return null;

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={!authUser ? <Login setAuthUser={setAuthUser} /> : <Navigate to="/" />} />
        <Route path="/" element={authUser ? <Dashboard user={authUser} handleLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
