import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiRefreshCw, FiMessageSquare } from 'react-icons/fi';

const DepartmentDashboard = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarksInput, setRemarksInput] = useState({});
  const departmentId = localStorage.getItem('departmentId');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      if (!departmentId) {
        setEnquiries([]);
        return;
      }
      const res = await axios.get(`/api/enquiries/department/${departmentId}`);
      setEnquiries(res.data);
    } catch (error) {
      console.error('Error fetching department enquiries', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/enquiries/${id}/status?status=${status}`);
      fetchEnquiries();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const updateRemarks = async (id) => {
    const remark = remarksInput[id] || '';
    try {
      await axios.put(`/api/enquiries/${id}/remarks`, remark, {
        headers: { 'Content-Type': 'text/plain' }
      });
      fetchEnquiries();
    } catch (error) {
      console.error('Error updating remarks', error);
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
          <h2 className="fw-bold text-dark mb-0">Department Dashboard</h2>
          <p className="text-muted fs-5 mt-2">Manage assigned enquiries</p>
        </div>
        <button className="btn-premium-outline d-flex align-items-center gap-2" onClick={fetchEnquiries} disabled={loading}>
          <FiRefreshCw className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      <div className="glass-card premium-table overflow-auto p-4 bg-white">
        {loading ? (
          <div className="text-center py-5 text-muted fs-5">Loading assigned enquiries...</div>
        ) : (
          <table className="table table-borderless table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient Details</th>
                <th>Enquiry Details</th>
                <th>Status</th>
                <th>Remarks / Comments</th>
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
                  </td>
                  <td>
                    <select 
                      className={`form-select form-select-sm bg-light border-0 shadow-sm ${enq.status === 'RESOLVED' ? 'text-success fw-bold' : ''}`}
                      value={enq.status}
                      onChange={(e) => updateStatus(enq.id, e.target.value)}
                    >
                      <option value="ASSIGNED">Assigned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </td>
                  <td style={{ width: '300px' }}>
                    <div className="d-flex gap-2">
                      <input 
                        type="text" 
                        className="form-control form-control-sm bg-light border-0" 
                        placeholder={enq.remarks || "Add remark..."}
                        value={remarksInput[enq.id] !== undefined ? remarksInput[enq.id] : ''}
                        onChange={(e) => setRemarksInput({...remarksInput, [enq.id]: e.target.value})}
                      />
                      <button 
                        className="btn btn-sm btn-primary d-flex align-items-center"
                        onClick={() => updateRemarks(enq.id)}
                        disabled={remarksInput[enq.id] === undefined || remarksInput[enq.id].trim() === ''}
                      >
                        <FiMessageSquare />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted fs-5">No assigned enquiries.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DepartmentDashboard;
