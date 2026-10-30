import React from 'react';

function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="brand">
          <div className="brand-icon">📚</div>
          <span>EduAttend System</span>
        </div>

        {user && (
          <div className="nav-actions">
            <div className="user-badge">
              <span>{user.name}</span>
              <span className="role-tag">{user.role}</span>
            </div>
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
