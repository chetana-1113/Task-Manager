// Local Storage Mock API Implementation
// Replaces Axios and Backend with purely persistent browser-side storage.

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getLocalTasks = () => {
  const tasks = localStorage.getItem('local_tasks');
  return tasks ? JSON.parse(tasks) : [];
};

const saveLocalTasks = (tasks) => {
  localStorage.setItem('local_tasks', JSON.stringify(tasks));
};

export const login = async (data) => {
  await delay(400); // simulate network
  // Fake login accepts anything and just returns the user
  const user = { id: 'local_user', name: data.name || data.email.split('@')[0], email: data.email };
  return { data: { token: 'fake_local_token', user } };
};

export const register = login; // Register does the same fake login

export const getTasks = async () => {
  await delay(200);
  return { data: getLocalTasks() };
};

export const createTask = async (data) => {
  await delay(200);
  const tasks = getLocalTasks();
  const newTask = {
    ...data,
    _id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  };
  saveLocalTasks([newTask, ...tasks]);
  return { data: newTask };
};

export const updateTask = async (id, data) => {
  await delay(200);
  const tasks = getLocalTasks();
  const index = tasks.findIndex(t => t._id === id);
  if (index === -1) throw new Error('Task not found');
  
  tasks[index] = { ...tasks[index], ...data };
  saveLocalTasks(tasks);
  return { data: tasks[index] };
};

export const deleteTask = async (id) => {
  await delay(200);
  const tasks = getLocalTasks();
  saveLocalTasks(tasks.filter(t => t._id !== id));
  return { data: { message: 'Deleted' } };
};
