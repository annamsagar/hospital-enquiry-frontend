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
  const [deptErrors, setDeptErrors] = useState({});

  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ id: null, username: '', password: '', role: 'ROLE_RECEPTIONIST', departmentId: '' });
  const [userErrors, setUserErrors] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, deptsRes, usersRes, enqRes] = await Promise.all([
        axios.get('/api/enquiries/dashboard'),
        axios.get('/api/departments'),
        axios.get('/api/users'),
        axios.get('/api/enquiries')
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
      const url = searchQuery ? `/api/enquiries/search?query=${encodeURIComponent(searchQuery)}` : '/api/enquiries';
      const res = await axios.get(url);
      setEnquiries(res.data);
    } catch (error) {
      console.error('Error searching enquiries', error);
    }
  };

  // --- Department CRUD ---
  const validateDeptForm = () => {
    const errors = {};
    if (!deptForm.name.trim()) errors.name = 'Department name is required';
    setDeptErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDept = async (e) => {
    e.preventDefault();
    if (!validateDeptForm()) return;
    try {
      if (deptForm.id) {
        await axios.put(`/api/departments/${deptForm.id}`, { name: deptForm.name, description: deptForm.description });
      } else {
        await axios.post('/api/departments', { name: deptForm.name, description: deptForm.description });
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
      await axios.delete(`/api/departments/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Cannot delete department. It may be assigned to existing staff or enquiries.');
    }
  };

  // --- User CRUD ---
  const validateUserForm = () => {
    const errors = {};
    if (!userForm.username.trim()) errors.username = 'Username is required';
    if (!userForm.id && !userForm.password.trim()) errors.password = 'Password is required for new users';
    if (!userForm.role) errors.role = 'Role is required';
    setUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!validateUserForm()) return;
    try {
      const payload = { username: userForm.username, role: userForm.role };
      if (userForm.password) payload.password = userForm.password;
      
      const params = userForm.role === 'ROLE_DEPARTMENT_STAFF' && userForm.departmentId 
        ? `?departmentId=${userForm.departmentId}` : '';

      if (userForm.id) {
        await axios.put(`/api/users/${userForm.id}${params}`, payload);
      } else {
        await axios.post(`/api/users${params}`, payload);
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
      await axios.delete(`/api/users/${id}`);
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
                  <h3 className="fw-bold mb-0 text-primary">{stats.totalDepartments}</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card p-4 bg-light">
                  <h6 className="text-muted fw-bold text-uppercase mb-2">Receptionists</h6>
                  <h3 className="fw-bold mb-0 text-primary">{stats.totalReceptionists}</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card p-4 bg-light">
                  <h6 className="text-muted fw-bold text-uppercase mb-2">Dept. Staff</h6>
                  <h3 className="fw-bold mb-0 text-primary">{stats.totalDepartmentStaff}</h3>
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
                <input type="text" className={`form-control ${deptErrors.name ? 'is-invalid' : ''}`} required value={deptForm.name} onChange={e => { setDeptForm({...deptForm, name: e.target.value}); setDeptErrors({...deptErrors, name: ''}); }} />
                {deptErrors.name && <div className="invalid-feedback">{deptErrors.name}</div>}
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
                <input type="text" className={`form-control ${userErrors.username ? 'is-invalid' : ''}`} required value={userForm.username} onChange={e => { setUserForm({...userForm, username: e.target.value}); setUserErrors({...userErrors, username: ''}); }} />
                {userErrors.username && <div className="invalid-feedback">{userErrors.username}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Password {userForm.id && <span className="text-muted fw-normal">(Leave blank to keep current)</span>}</label>
                <input type="password" className={`form-control ${userErrors.password ? 'is-invalid' : ''}`} required={!userForm.id} value={userForm.password} onChange={e => { setUserForm({...userForm, password: e.target.value}); setUserErrors({...userErrors, password: ''}); }} />
                {userErrors.password && <div className="invalid-feedback">{userErrors.password}</div>}
              </div>
              <div className="mb-4">
                <label className="form-label fw-medium">Role</label>
                <select 
                  className={`form-select ${userErrors.role ? 'is-invalid' : ''}`} 
                  required
                  value={userForm.role === 'ROLE_DEPARTMENT_STAFF' ? `DEPT_${userForm.departmentId}` : userForm.role} 
                  onChange={e => {
                    const val = e.target.value;
                    setUserErrors({...userErrors, role: ''});
                    if (val.startsWith('DEPT_')) {
                      setUserForm({...userForm, role: 'ROLE_DEPARTMENT_STAFF', departmentId: val.split('_')[1]});
                    } else {
                      setUserForm({...userForm, role: val, departmentId: ''});
                    }
                  }}
                >
                  <option value="">Select a role...</option>
                  <option value="ROLE_RECEPTIONIST">Receptionist</option>
                  <option value="ROLE_ADMIN">Admin</option>
                  <optgroup label="Department Staff">
                    {departments.map(d => (
                      <option key={d.id} value={`DEPT_${d.id}`}>
                        {d.name} Staff
                      </option>
                    ))}
                  </optgroup>
                </select>
                {userErrors.role && <div className="invalid-feedback">{userErrors.role}</div>}
              </div>
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
