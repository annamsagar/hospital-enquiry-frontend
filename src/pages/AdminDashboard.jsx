import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiUsers, FiActivity, FiCheckCircle, FiClock, FiGrid, FiUserPlus, FiPlus, FiTrash2, FiEdit, FiSearch } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, departments, users, enquiries
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptForm, setDeptForm] = useState({ id: null, name: '', description: '' });

  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ id: null, username: '', password: '', role: 'ROLE_RECEPTIONIST', departmentId: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, deptsRes, usersRes, enqRes] = await Promise.all([
        axios.get('http://localhost:8081/api/enquiries/dashboard'),
        axios.get('http://localhost:8081/api/departments'),
        axios.get('http://localhost:8081/api/users'),
        axios.get('http://localhost:8081/api/enquiries')
      ]);
      setStats(statsRes.data);
      setDepartments(deptsRes.data);
      setUsers(usersRes.data);
      setEnquiries(enqRes.data);
    } catch (error) {
      console.error('Error fetching admin data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchEnquiries = async (e) => {
    e.preventDefault();
    try {
      const url = searchQuery ? `http://localhost:8081/api/enquiries/search?query=${encodeURIComponent(searchQuery)}` : 'http://localhost:8081/api/enquiries';
      const res = await axios.get(url);
      setEnquiries(res.data);
    } catch (error) {
      console.error('Error searching enquiries', error);
    }
  };

  // --- Department CRUD ---
  const handleSaveDept = async (e) => {
    e.preventDefault();
    try {
      if (deptForm.id) {
        await axios.put(`http://localhost:8081/api/departments/${deptForm.id}`, { name: deptForm.name, description: deptForm.description });
      } else {
        await axios.post('http://localhost:8081/api/departments', { name: deptForm.name, description: deptForm.description });
      }
      setShowDeptModal(false);
      fetchData();
    } catch (error) {
      alert('Failed to save department. Ensure name is unique.');
    }
  };

  const handleDeleteDept = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await axios.delete(`http://localhost:8081/api/departments/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Cannot delete department. It may be assigned to existing staff or enquiries.');
    }
  };

  // --- User CRUD ---
  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      const payload = { username: userForm.username, role: userForm.role };
      if (userForm.password) payload.password = userForm.password;
      
      const params = userForm.role === 'ROLE_DEPARTMENT_STAFF' && userForm.departmentId 
        ? `?departmentId=${userForm.departmentId}` : '';

      if (userForm.id) {
        await axios.put(`http://localhost:8081/api/users/${userForm.id}${params}`, payload);
      } else {
        await axios.post(`http://localhost:8081/api/users${params}`, payload);
      }
      setShowUserModal(false);
      fetchData();
    } catch (error) {
      alert('Failed to save user. Username might already exist.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:8081/api/users/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete user.');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'NEW': return 'bg-secondary';
      case 'ASSIGNED': return 'bg-info text-dark';
      case 'IN_PROGRESS': return 'bg-warning text-dark';
      case 'RESOLVED': return 'bg-success';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="container-fluid px-0 animate-fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0">Admin Control Center</h2>
          <p className="text-muted fs-5 mt-2">Manage the hospital enquiry system</p>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'dashboard' ? 'active shadow-sm' : 'text-dark'}`} onClick={() => setActiveTab('dashboard')}>
            <FiActivity className="me-2" /> Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'departments' ? 'active shadow-sm' : 'text-dark'}`} onClick={() => setActiveTab('departments')}>
            <FiGrid className="me-2" /> Departments
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'users' ? 'active shadow-sm' : 'text-dark'}`} onClick={() => setActiveTab('users')}>
            <FiUsers className="me-2" /> Users
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'enquiries' ? 'active shadow-sm' : 'text-dark'}`} onClick={() => setActiveTab('enquiries')}>
            <FiActivity className="me-2" /> All Enquiries
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5 text-muted fs-5">Loading admin data...</div>
      ) : (
        <>
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && stats && (
            <div className="row g-4 mb-5">
              <div className="col-md-3">
                <div className="stat-card p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted fw-bold text-uppercase mb-1">Total Enquiries</h6>
                      <h2 className="fw-bold mb-0 text-primary">{stats.totalEnquiries}</h2>
                    </div>
                    <div className="p-3 bg-primary bg-opacity-10 rounded-circle text-primary">
                      <FiActivity size={24} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted fw-bold text-uppercase mb-1">Pending (New/Assigned)</h6>
                      <h2 className="fw-bold mb-0 text-warning">{stats.pendingEnquiries}</h2>
                    </div>
                    <div className="p-3 bg-warning bg-opacity-10 rounded-circle text-warning">
                      <FiClock size={24} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted fw-bold text-uppercase mb-1">In Progress</h6>
                      <h2 className="fw-bold mb-0 text-info">{stats.inProgressEnquiries}</h2>
                    </div>
                    <div className="p-3 bg-info bg-opacity-10 rounded-circle text-info">
                      <FiClock size={24} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted fw-bold text-uppercase mb-1">Resolved</h6>
                      <h2 className="fw-bold mb-0 text-success">{stats.resolvedEnquiries}</h2>
                    </div>
                    <div className="p-3 bg-success bg-opacity-10 rounded-circle text-success">
                      <FiCheckCircle size={24} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Secondary Stats */}
              <div className="col-md-4">
                <div className="stat-card p-4 bg-light">
                  <h6 className="text-muted fw-bold text-uppercase mb-2">Departments</h6>
                  <h3 className="fw-bold mb-0">{stats.totalDepartments}</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card p-4 bg-light">
                  <h6 className="text-muted fw-bold text-uppercase mb-2">Receptionists</h6>
                  <h3 className="fw-bold mb-0">{stats.totalReceptionists}</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card p-4 bg-light">
                  <h6 className="text-muted fw-bold text-uppercase mb-2">Dept. Staff</h6>
                  <h3 className="fw-bold mb-0">{stats.totalDepartmentStaff}</h3>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEPARTMENTS */}
          {activeTab === 'departments' && (
            <div className="glass-card p-4 bg-white">
              <div className="d-flex justify-content-between mb-4">
                <h4 className="fw-bold">Manage Departments</h4>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { setDeptForm({ id: null, name: '', description: '' }); setShowDeptModal(true); }}>
                  <FiPlus /> Add Department
                </button>
              </div>
              <table className="table table-hover align-middle">
                <thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
                <tbody>
                  {departments.map(dept => (
                    <tr key={dept.id}>
                      <td className="fw-bold text-primary">#{dept.id}</td>
                      <td className="fw-medium">{dept.name}</td>
                      <td className="text-muted">{dept.description || 'N/A'}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setDeptForm(dept); setShowDeptModal(true); }}><FiEdit /></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteDept(dept.id)}><FiTrash2 /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <div className="glass-card p-4 bg-white">
              <div className="d-flex justify-content-between mb-4">
                <h4 className="fw-bold">Manage Users</h4>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { setUserForm({ id: null, username: '', password: '', role: 'ROLE_RECEPTIONIST', departmentId: '' }); setShowUserModal(true); }}>
                  <FiUserPlus /> Add User
                </button>
              </div>
              <table className="table table-hover align-middle">
                <thead><tr><th>ID</th><th>Username</th><th>Role</th><th>Department</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="fw-bold text-primary">#{u.id}</td>
                      <td className="fw-medium">{u.username}</td>
                      <td><span className="badge bg-secondary">{u.role.replace('ROLE_', '')}</span></td>
                      <td className="text-muted">{u.department ? u.department.name : 'N/A'}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setUserForm({ id: u.id, username: u.username, password: '', role: u.role, departmentId: u.department?.id || '' }); setShowUserModal(true); }}><FiEdit /></button>
                        {u.username !== 'admin' && ( // Prevent deleting main admin
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(u.id)}><FiTrash2 /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="glass-card p-4 bg-white">
              <div className="d-flex justify-content-between mb-4">
                <h4 className="fw-bold">All Enquiries (Read Only)</h4>
                <form onSubmit={handleSearchEnquiries} className="d-flex">
                  <input type="text" className="form-control" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ borderRadius: '8px 0 0 8px' }} />
                  <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 8px 8px 0' }}><FiSearch /></button>
                </form>
              </div>
              <table className="table table-hover align-middle">
                <thead><tr><th>ID</th><th>Patient</th><th>Type</th><th>Status</th><th>Department</th></tr></thead>
                <tbody>
                  {enquiries.map(enq => (
                    <tr key={enq.id}>
                      <td className="fw-bold text-primary">#{enq.id}</td>
                      <td><div className="fw-medium">{enq.patient.name}</div><small className="text-muted">{enq.patient.phone}</small></td>
                      <td><span className="badge bg-light text-dark border">{enq.enquiryType.replace(/_/g, ' ')}</span></td>
                      <td><span className={`badge rounded-pill shadow-sm ${getStatusBadge(enq.status)}`}>{enq.status.replace(/_/g, ' ')}</span></td>
                      <td className="text-muted">{enq.department ? enq.department.name : 'Unassigned'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showDeptModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="glass-card bg-white p-4" style={{ width: '100%', maxWidth: '500px' }}>
            <h4 className="fw-bold mb-4">{deptForm.id ? 'Edit' : 'Add'} Department</h4>
            <form onSubmit={handleSaveDept}>
              <div className="mb-3">
                <label className="form-label fw-medium">Department Name</label>
                <input type="text" className="form-control" required value={deptForm.name} onChange={e => setDeptForm({...deptForm, name: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="form-label fw-medium">Description</label>
                <textarea className="form-control" rows="3" value={deptForm.description} onChange={e => setDeptForm({...deptForm, description: e.target.value})}></textarea>
              </div>
              <div className="d-flex justify-content-end gap-3">
                <button type="button" className="btn btn-light border" onClick={() => setShowDeptModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUserModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="glass-card bg-white p-4" style={{ width: '100%', maxWidth: '500px' }}>
            <h4 className="fw-bold mb-4">{userForm.id ? 'Edit' : 'Add'} User</h4>
            <form onSubmit={handleSaveUser}>
              <div className="mb-3">
                <label className="form-label fw-medium">Username</label>
                <input type="text" className="form-control" required value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Password {userForm.id && <span className="text-muted fw-normal">(Leave blank to keep current)</span>}</label>
                <input type="password" className="form-control" required={!userForm.id} value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Role</label>
                <select className="form-select" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value, departmentId: ''})}>
                  <option value="ROLE_RECEPTIONIST">Receptionist</option>
                  <option value="ROLE_DEPARTMENT_STAFF">Department Staff</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
              </div>
              {userForm.role === 'ROLE_DEPARTMENT_STAFF' && (
                <div className="mb-4">
                  <label className="form-label fw-medium">Assign Department</label>
                  <select className="form-select" required value={userForm.departmentId} onChange={e => setUserForm({...userForm, departmentId: e.target.value})}>
                    <option value="">Select a department...</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              )}
              <div className="d-flex justify-content-end gap-3 mt-4">
                <button type="button" className="btn btn-light border" onClick={() => setShowUserModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
