import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import * as api from '../api';

const Login = ({ setAuthUser }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = isRegister 
        ? await api.register(formData)
        : await api.login({ email: formData.email, password: formData.password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setAuthUser(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please make sure the backend server is running!');
    }
  };

  return (
    <div className="login-container">
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h1>Task Manager</h1>
        <p className="subtitle">Securely connect to your workspace.</p>
        
        {error && <p style={{ color: 'var(--danger-color)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className="form-control" onChange={handleChange} required />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Password</label>
            <input type={showPassword ? "text" : "password"} name="password" className="form-control" onChange={handleChange} required style={{ paddingRight: '2.5rem' }}/>
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '35px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          
          <button type="submit" className="btn btn-primary w-100 mt-4">
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isRegister ? 'Already have an account?' : 'Need to organize your life?'}
          </p>
          <button className="btn-link" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Sign in here' : 'Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
