import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard.jsx';
import LeaveStatusBadge from '../components/LeaveStatusBadge.jsx';

function StudentDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'leaves'
  const [attendanceData, setAttendanceData] = useState({
    totalClasses: 0,
    presentClasses: 0,
    absentClasses: 0,
    overallPercentage: 0,
    subjectWise: [],
    records: []
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Leave Form state
  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [leaveMessage, setLeaveMessage] = useState({ type: '', text: '' });
  const [submittingLeave, setSubmittingLeave] = useState(false);

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Attendance Summary
      const attRes = await fetch(`http://localhost:5000/api/attendance/student/${user.id}`);
      const attJson = await attRes.json();
      if (attJson.success) {
        setAttendanceData(attJson.data);
      }

      // 2. Fetch Leaves
      const leaveRes = await fetch(`http://localhost:5000/api/leaves/student/${user.id}`);
      const leaveJson = await leaveRes.json();
      if (leaveJson.success) {
        setLeaveRequests(leaveJson.data);
      }
    } catch (err) {
      console.error('Error loading student dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveFormChange = (e) => {
    setLeaveForm({
      ...leaveForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setLeaveMessage({ type: '', text: '' });
    setSubmittingLeave(true);

    try {
      const res = await fetch('http://localhost:5000/api/leaves/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          ...leaveForm
        })
      });

      const data = await res.json();
      if (data.success) {
        setLeaveMessage({ type: 'success', text: 'Leave request submitted successfully!' });
        setLeaveForm({ startDate: '', endDate: '', reason: '' });
        // Refresh leaves list
        fetchStudentData();
      } else {
        setLeaveMessage({ type: 'error', text: data.message || 'Failed to submit leave' });
      }
    } catch (err) {
      setLeaveMessage({ type: 'error', text: 'Network error submitting leave application' });
    } finally {
      setSubmittingLeave(false);
    }
  };

  const getProgressColor = (pct) => {
    if (pct >= 75) return 'progress-green';
    if (pct >= 60) return 'progress-yellow';
    return 'progress-red';
  };

  return (
    <div>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Student Portal</h2>
          <p>Welcome, <strong>{user.name}</strong> ({user.rollNumber || 'Roll N/A'}) • {user.department}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          📊 Attendance Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaves')}
        >
          📝 Leave Management
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading your attendance data...
        </div>
      ) : activeTab === 'attendance' ? (
        <div>
          {/* Top KPIs */}
          <div className="stats-grid">
            <StatCard
              title="Overall Attendance"
              value={`${attendanceData.overallPercentage}%`}
              icon="📈"
              subtitle={attendanceData.overallPercentage >= 75 ? 'Above criteria (≥75%)' : 'Short of criteria (<75%)'}
            />
            <StatCard
              title="Total Classes"
              value={attendanceData.totalClasses}
              icon="🏫"
            />
            <StatCard
              title="Classes Attended"
              value={attendanceData.presentClasses}
              icon="✅"
            />
            <StatCard
              title="Classes Missed"
              value={attendanceData.absentClasses}
              icon="❌"
            />
          </div>

          {/* Subject-wise Attendance */}
          <div className="section-card">
            <div className="section-header">
              <h3>Subject-wise Attendance</h3>
              <small style={{ color: 'var(--text-muted)' }}>Minimum recommended: 75%</small>
            </div>

            {attendanceData.subjectWise.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No subject attendance recorded yet.</p>
            ) : (
              <div className="subjects-grid">
                {attendanceData.subjectWise.map((sub, idx) => (
                  <div key={idx} className="subject-item">
                    <div className="subject-top">
                      <span>{sub.subject}</span>
                      <span>{sub.percentage}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className={`progress-bar-fill ${getProgressColor(sub.percentage)}`}
                        style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="subject-details">
                      <span>Attended: {sub.present}/{sub.total}</span>
                      <span>Missed: {sub.absent}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Attendance Logs */}
          <div className="section-card">
            <div className="section-header">
              <h3>Recent Attendance History</h3>
            </div>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.records.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No attendance history found.
                      </td>
                    </tr>
                  ) : (
                    attendanceData.records.slice(0, 15).map((rec, i) => (
                      <tr key={i}>
                        <td>{rec.date}</td>
                        <td><strong>{rec.subject}</strong></td>
                        <td>
                          <LeaveStatusBadge status={rec.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Leave Requests Tab */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Submit Leave Form */}
          <div className="section-card" style={{ height: 'fit-content' }}>
            <div className="section-header">
              <h3>Apply for Leave</h3>
            </div>

            {leaveMessage.text && (
              <div className={`alert ${leaveMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {leaveMessage.text}
              </div>
            )}

            <form onSubmit={handleLeaveSubmit}>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={leaveForm.startDate}
                  onChange={handleLeaveFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={leaveForm.endDate}
                  onChange={handleLeaveFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Reason for Leave</label>
                <textarea
                  name="reason"
                  rows="3"
                  placeholder="Explain reason for absence..."
                  value={leaveForm.reason}
                  onChange={handleLeaveFormChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" disabled={submittingLeave}>
                {submittingLeave ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>

          {/* My Leaves Table */}
          <div className="section-card">
            <div className="section-header">
              <h3>My Leave Applications</h3>
            </div>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No leave requests submitted yet.
                      </td>
                    </tr>
                  ) : (
                    leaveRequests.map((leave) => (
                      <tr key={leave._id}>
                        <td>{leave.startDate} to {leave.endDate}</td>
                        <td>{leave.reason}</td>
                        <td>
                          <LeaveStatusBadge status={leave.status} />
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {leave.facultyRemarks || '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
