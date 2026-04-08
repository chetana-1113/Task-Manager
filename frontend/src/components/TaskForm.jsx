import React, { useState } from 'react';

const TaskForm = ({ onClose, onSave, task }) => {
  const [formData, setFormData] = useState({
    title: task ? task.title : '',
    description: task ? task.description : '',
    dueDate: task && task.dueDate ? task.dueDate.substring(0, 10) : '',
    priority: task ? task.priority : 'Medium',
    status: task ? task.status : 'Pending'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = { ...formData };
    // Mongoose will crash if dueDate is an empty string instead of a valid date
    if (!submissionData.dueDate) {
      delete submissionData.dueDate;
    }
    onSave(submissionData, task?._id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ marginBottom: '1.5rem' }}>{task ? 'Edit Task' : 'New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input required type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} placeholder="What needs to be done?" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleChange} placeholder="Add details..."></textarea>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" name="dueDate" className="form-control" value={formData.dueDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select name="priority" className="form-control" value={formData.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
