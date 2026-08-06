import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiRefreshCw, FiPlus, FiSearch } from 'react-icons/fi';

const ReceptionistDashboard = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientAge: '',
    enquiryType: 'APPOINTMENT',
    description: ''
  });

  const fetchEnquiries = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `http://localhost:8081/api/enquiries/search?query=${encodeURIComponent(query)}` : 'http://localhost:8081/api/enquiries';
      const res = await axios.get(url);
      setEnquiries(res.data);
    } catch (error) {
      console.error('Error fetching enquiries', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/departments');
      setDepartments(res.data);
    } catch (error) {
      console.error('Error fetching departments', error);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    fetchDepartments();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEnquiries(searchQuery);
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8081/api/enquiries/${id}/status?status=${status}`);
      fetchEnquiries(searchQuery);
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const updateDepartment = async (id, departmentId) => {
    if (!departmentId) return;
    try {
      await axios.put(`http://localhost:8081/api/enquiries/${id}/department?departmentId=${departmentId}`);
      fetchEnquiries(searchQuery);
    } catch (error) {
      console.error('Error updating department', error);
    }
  };

  const handleCreateEnquiry = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/api/enquiries', formData);
      setShowCreateModal(false);
      setFormData({
        patientName: '',
        patientPhone: '',
        patientAge: '',
        enquiryType: 'APPOINTMENT',
        description: ''
      });
      fetchEnquiries(searchQuery);
    } catch (error) {
      console.error('Error creating enquiry', error);
      alert('Failed to create enquiry');
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
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold text-dark mb-0">Receptionist Dashboard</h2>
          <p className="text-muted fs-5 mt-2">Manage patient enquiries and department assignments</p>
        </div>
        <div className="d-flex gap-3">
          <form onSubmit={handleSearch} className="d-flex">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search patients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: '8px 0 0 8px' }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 8px 8px 0' }}>
              <FiSearch />
            </button>
          </form>
          <button className="btn-premium d-flex align-items-center gap-2" onClick={() => setShowCreateModal(true)}>
            <FiPlus /> New Enquiry
          </button>
          <button className="btn-premium-outline d-flex align-items-center gap-2" onClick={() => fetchEnquiries(searchQuery)} disabled={loading}>
            <FiRefreshCw className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {showCreateModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="glass-card bg-white p-4" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h4 className="fw-bold mb-4">Register Patient & Create Enquiry</h4>
            <form onSubmit={handleCreateEnquiry}>
              <div className="mb-3">
                <label className="form-label fw-medium">Patient Name</label>
                <input type="text" className="form-control" required value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Phone Number</label>
                  <input type="tel" className="form-control" required value={formData.patientPhone} onChange={e => setFormData({...formData, patientPhone: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">Age</label>
                  <input type="number" className="form-control" value={formData.patientAge} onChange={e => setFormData({...formData, patientAge: e.target.value})} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Enquiry Type</label>
                <select className="form-select" value={formData.enquiryType} onChange={e => setFormData({...formData, enquiryType: e.target.value})}>
                  <option value="APPOINTMENT">Appointment</option>
                  <option value="BILLING">Billing</option>
                  <option value="DEPARTMENT_INFO">Department Info</option>
                  <option value="DOCTOR_AVAILABILITY">Doctor Availability</option>
                  <option value="LAB_REPORTS">Lab Reports</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label fw-medium">Description</label>
                <textarea className="form-control" rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="d-flex justify-content-end gap-3">
                <button type="button" className="btn btn-light border" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Enquiry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="glass-card premium-table overflow-auto p-4 bg-white">
        {loading ? (
          <div className="text-center py-5 text-muted fs-5">Loading enquiries...</div>
        ) : (
          <table className="table table-borderless table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Enquiry Details</th>
                <th>Status</th>
                <th>Assign Dept</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map(enq => (
                <tr key={enq.id}>
                  <td className="fw-bold text-primary">#{enq.id}</td>
                  <td>
                    <div className="fw-medium text-dark">{enq.patient.name}</div>
                    <small className="text-muted">{enq.patient.phone} • Age: {enq.patient.age || 'N/A'}</small>
                  </td>
                  <td>
                    <div className="mb-1">
                      <span className="badge bg-light text-dark border px-2 py-1">
                        {enq.enquiryType.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <small className="text-muted d-block" style={{ maxWidth: '250px' }}>{enq.description}</small>
                    <small className="text-muted">{new Date(enq.date).toLocaleDateString()}</small>
                  </td>
                  <td>
                    <span className={`badge rounded-pill px-3 py-2 shadow-sm ${getStatusBadge(enq.status)}`}>
                      {enq.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="form-select form-select-sm bg-light border-0 shadow-sm"
                      value={enq.department ? enq.department.id : ''}
                      onChange={(e) => updateDepartment(enq.id, e.target.value)}
                    >
                      <option value="">Assign Dept...</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select 
                      className="form-select form-select-sm bg-light border-0 shadow-sm"
                      value={enq.status}
                      onChange={(e) => updateStatus(enq.id, e.target.value)}
                      disabled={enq.status === 'RESOLVED'} // Receptionist cannot edit if already resolved
                    >
                      <option value="NEW">New</option>
                      <option value="ASSIGNED">Assigned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      {enq.status === 'RESOLVED' && <option value="RESOLVED">Resolved</option>}
                    </select>
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted fs-5">No enquiries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
