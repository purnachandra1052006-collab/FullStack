import React from 'react';

function StatCard({ title, value, icon, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span>{title}</span>
        <h3>{value}</h3>
        {subtitle && <small style={{ color: 'var(--text-muted)' }}>{subtitle}</small>}
      </div>
      <div className="stat-icon">{icon}</div>
    </div>
  );
}

export default StatCard;
