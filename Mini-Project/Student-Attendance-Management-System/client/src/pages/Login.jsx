import React, { useState } from 'react';

function Login({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Login failed');
      } else {
        onLogin(data.user);
      }
    } catch (err) {
      setError('Could not connect to backend server. Make sure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo credentials autofill
  const fillDemo = (role) => {
    if (role === 'faculty') {
      setFormData({ email: 'faculty@college.edu', password: 'password123' });
    } else {
      setFormData({ email: 'john@student.edu', password: 'password123' });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your attendance portal</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. john@student.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>
            ⚡ Quick Demo Sign In:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-sm"
              style={{ flex: 1, background: '#e2e8f0', color: '#334155' }}
              onClick={() => fillDemo('student')}
            >
              Student Demo
            </button>
            <button
              type="button"
              className="btn-sm"
              style={{ flex: 1, background: '#e2e8f0', color: '#334155' }}
              onClick={() => fillDemo('faculty')}
            >
              Faculty Demo
            </button>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account?{' '}
          <span className="auth-link" onClick={onSwitchToRegister}>
            Register here
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
