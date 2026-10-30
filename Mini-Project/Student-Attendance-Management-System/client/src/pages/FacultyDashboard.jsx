import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard.jsx';
import LeaveStatusBadge from '../components/LeaveStatusBadge.jsx';

function FacultyDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('mark'); // 'mark' | 'leaves' | 'search'
  
  // Data states
  const [students, setStudents] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Attendance Marking State
  const [selectedSubject, setSelectedSubject] = useState('Web Technologies');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRoster, setAttendanceRoster] = useState({}); // { [studentId]: 'Present' | 'Absent' }
  const [markMessage, setMarkMessage] = useState({ type: '', text: '' });
  const [savingAttendance, setSavingAttendance] = useState(false);

  // Search Student State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState(null);
  const [studentReportData, setStudentReportData] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all students
      const studRes = await fetch('http://localhost:5000/api/students');
      const studJson = await studRes.json();
      if (studJson.success) {
        setStudents(studJson.data);
        // Initialize roster to Present for all
        const initialRoster = {};
        studJson.data.forEach(s => {
          initialRoster[s._id] = 'Present';
        });
        setAttendanceRoster(initialRoster);
      }

      // 2. Fetch all leave requests
      const leaveRes = await fetch('http://localhost:5000/api/leaves/all');
      const leaveJson = await leaveRes.json();
      if (leaveJson.success) {
        setLeaves(leaveJson.data);
      }
    } catch (err) {
      console.error('Error fetching faculty data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle student status in mark attendance roster
  const toggleStatus = (studentId) => {
    setAttendanceRoster(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const setAllStatus = (status) => {
    const updated = {};
    students.forEach(s => {
      updated[s._id] = status;
    });
    setAttendanceRoster(updated);
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    setMarkMessage({ type: '', text: '' });
    setSavingAttendance(true);

    const records = students.map(s => ({
      studentId: s._id,
      status: attendanceRoster[s._id] || 'Present'
    }));

    try {
      const res = await fetch('http://localhost:5000/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          date: selectedDate,
          records
        })
      });

      const data = await res.json();
      if (data.success) {
        setMarkMessage({ type: 'success', text: `Attendance saved successfully for ${selectedSubject} (${selectedDate})!` });
      } else {
        setMarkMessage({ type: 'error', text: data.message || 'Failed to save attendance' });
      }
    } catch (err) {
      setMarkMessage({ type: 'error', text: 'Network error saving attendance' });
    } finally {
      setSavingAttendance(false);
    }
  };

  // Update Leave Status (Approve / Reject)
  const handleUpdateLeave = async (leaveId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/leaves/${leaveId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      if (data.success) {
        // Refresh leaves list
        setLeaves(leaves.map(l => l._id === leaveId ? data.data : l));
      }
    } catch (err) {
      alert('Failed to update leave status');
    }
  };

  // Student Report inspection
  const viewStudentReport = async (student) => {
    setSelectedStudentForReport(student);
    try {
      const res = await fetch(`http://localhost:5000/api/attendance/student/${student._id}`);
      const data = await res.json();
      if (data.success) {
        setStudentReportData(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.rollNumber && s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingLeavesCount = leaves.filter(l => l.status === 'Pending').length;

  return (
    <div>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Faculty Management Portal</h2>
          <p>Logged in as: <strong>{user.name}</strong> • {user.department}</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <StatCard title="Registered Students" value={students.length} icon="👨‍🎓" />
        <StatCard title="Pending Leaves" value={pendingLeavesCount} icon="⏳" subtitle={pendingLeavesCount > 0 ? 'Requires action' : 'All clear'} />
        <StatCard title="Total Leaves Filed" value={leaves.length} icon="📑" />
        <StatCard title="Active Courses" value="4" icon="📖" subtitle="CS Department" />
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'mark' ? 'active' : ''}`}
          onClick={() => setActiveTab('mark')}
        >
          ✏️ Mark Attendance
        </button>
        <button
          className={`tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaves')}
        >
          📬 Leave Requests ({pendingLeavesCount})
        </button>
        <button
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          🔍 Search Student Records
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading records...
        </div>
      ) : activeTab === 'mark' ? (
        /* MARK ATTENDANCE TAB */
        <div className="section-card">
          <div className="section-header">
            <h3>Record Class Attendance</h3>
          </div>

          {markMessage.text && (
            <div className={`alert ${markMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {markMessage.text}
            </div>
          )}

          <form onSubmit={handleSaveAttendance}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Select Subject</label>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                  <option value="Web Technologies">Web Technologies</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Database Management">Database Management</option>
                  <option value="Operating Systems">Operating Systems</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-sm"
                  style={{ background: 'var(--success-light)', color: '#065f46', flex: 1, height: '42px' }}
                  onClick={() => setAllStatus('Present')}
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  className="btn-sm"
                  style={{ background: 'var(--danger-light)', color: '#991b1b', flex: 1, height: '42px' }}
                  onClick={() => setAllStatus('Absent')}
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            <div className="table-responsive" style={{ marginBottom: '1.5rem' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Student Name</th>
                    <th>Department</th>
                    <th>Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No students enrolled.
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => {
                      const status = attendanceRoster[student._id] || 'Present';
                      return (
                        <tr key={student._id}>
                          <td><strong>{student.rollNumber || 'N/A'}</strong></td>
                          <td>{student.name}</td>
                          <td>{student.department}</td>
                          <td>
                            <button
                              type="button"
                              className={`attendance-toggle-btn ${status === 'Present' ? 'toggle-present' : 'toggle-absent'}`}
                              onClick={() => toggleStatus(student._id)}
                            >
                              {status === 'Present' ? '✓ Present' : '✗ Absent'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <button type="submit" className="btn-primary" disabled={savingAttendance || students.length === 0}>
              {savingAttendance ? 'Saving Attendance...' : `Submit Attendance for ${selectedSubject}`}
            </button>
          </form>
        </div>
      ) : activeTab === 'leaves' ? (
        /* LEAVE REQUESTS TAB */
        <div className="section-card">
          <div className="section-header">
            <h3>Student Leave Applications</h3>
            <small style={{ color: 'var(--text-muted)' }}>{leaves.length} Total Requests</small>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No leave requests submitted yet.
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave._id}>
                      <td><strong>{leave.studentId?.name || 'Unknown'}</strong></td>
                      <td>{leave.studentId?.rollNumber || '—'}</td>
                      <td>{leave.startDate} to {leave.endDate}</td>
                      <td>{leave.reason}</td>
                      <td>
                        <LeaveStatusBadge status={leave.status} />
                      </td>
                      <td>
                        {leave.status === 'Pending' ? (
                          <div style={{ display: 'flex' }}>
                            <button
                              className="btn-sm btn-approve"
                              onClick={() => handleUpdateLeave(leave._id, 'Approved')}
                            >
                              Approve
                            </button>
                            <button
                              className="btn-sm btn-reject"
                              onClick={() => handleUpdateLeave(leave._id, 'Rejected')}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* SEARCH & STUDENT RECORDS TAB */
        <div>
          <div className="section-card">
            <div className="section-header">
              <h3>Search Student Directory</h3>
            </div>

            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="Search by student name, roll number, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No students found matching "{searchQuery}".
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s._id}>
                        <td><strong>{s.rollNumber || 'N/A'}</strong></td>
                        <td>{s.name}</td>
                        <td>{s.email}</td>
                        <td>{s.department}</td>
                        <td>
                          <button
                            className="btn-sm"
                            style={{ background: 'var(--primary)', color: 'white' }}
                            onClick={() => viewStudentReport(s)}
                          >
                            View Attendance Report
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Drilldown Report for Selected Student */}
          {selectedStudentForReport && studentReportData && (
            <div className="section-card" style={{ border: '2px solid var(--primary-light)' }}>
              <div className="section-header">
                <h3>
                  Attendance Report: {selectedStudentForReport.name} ({selectedStudentForReport.rollNumber})
                </h3>
                <button
                  className="btn-sm"
                  style={{ background: '#e2e8f0', color: '#334155' }}
                  onClick={() => setSelectedStudentForReport(null)}
                >
                  Close Report
                </button>
              </div>

              <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                <StatCard
                  title="Overall Attendance"
                  value={`${studentReportData.overallPercentage}%`}
                  icon="📊"
                />
                <StatCard
                  title="Total Classes"
                  value={studentReportData.totalClasses}
                  icon="🏫"
                />
                <StatCard
                  title="Present"
                  value={studentReportData.presentClasses}
                  icon="✅"
                />
                <StatCard
                  title="Absent"
                  value={studentReportData.absentClasses}
                  icon="❌"
                />
              </div>

              <div className="section-header">
                <h4>Subject Breakdown</h4>
              </div>
              <div className="subjects-grid">
                {studentReportData.subjectWise.map((sub, i) => (
                  <div key={i} className="subject-item">
                    <div className="subject-top">
                      <span>{sub.subject}</span>
                      <span>{sub.percentage}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className={`progress-bar-fill ${
                          sub.percentage >= 75 ? 'progress-green' : sub.percentage >= 60 ? 'progress-yellow' : 'progress-red'
                        }`}
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FacultyDashboard;
