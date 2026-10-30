import React from 'react';

function LeaveStatusBadge({ status }) {
  const getBadgeClass = (s) => {
    switch (s?.toLowerCase()) {
      case 'approved':
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      case 'present':
        return 'badge-present';
      case 'absent':
        return 'badge-absent';
      default:
        return 'badge-pending';
    }
  };

  return <span className={`badge ${getBadgeClass(status)}`}>{status}</span>;
}

export default LeaveStatusBadge;
