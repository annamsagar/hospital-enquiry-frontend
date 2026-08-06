import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiCalendar, FiFileText, FiUser, FiInfo } from 'react-icons/fi';

const TrackEnquiry = () => {
  const { t } = useTranslation();
  const [enquiryId, setEnquiryId] = useState('');
  const [enquiry, setEnquiry] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8081/api/enquiries/${enquiryId}`);
      if (response.data) {
        setEnquiry(response.data);
        setError('');
      } else {
        setEnquiry(null);
        setError('Enquiry not found. Please check the ID.');
      }
    } catch (err) {
      setEnquiry(null);
      setError('Error fetching enquiry details.');
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
    <div className="row justify-content-center animate-fade-in-up">
      <div className="col-lg-6 col-md-8 text-center">
        
        <div className="glass-card p-4 p-md-5 bg-white mb-5">
          <div className="mb-4 text-primary">
            <FiSearch size={48} />
          </div>
          <h2 className="fw-bold mb-4">{t('track_enquiry')}</h2>
          <form onSubmit={handleTrack} className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <input 
              type="number" 
              className="form-control form-control-lg text-center text-sm-start flex-grow-1 shadow-sm" 
              placeholder="Enter Enquiry ID"
              value={enquiryId}
              onChange={(e) => setEnquiryId(e.target.value)}
              required
            />
            <button type="submit" className="btn-premium px-4">Track Status</button>
          </form>
        </div>

        {error && <div className="alert alert-danger fs-5 border-0 shadow-sm rounded-3">{error}</div>}

        {enquiry && (
          <div className="glass-card text-start bg-white overflow-hidden animate-fade-in-up">
            <div className="bg-light p-4 d-flex justify-content-between align-items-center border-bottom">
              <h4 className="mb-0 fw-bold text-dark">Enquiry #{enquiry.id}</h4>
              <span className={`badge rounded-pill fs-6 px-3 py-2 shadow-sm ${getStatusBadge(enquiry.status)}`}>
                {enquiry.status.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="p-4 p-md-5">
              <div className="row g-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="text-primary mt-1"><FiUser size={24} /></div>
                    <div>
                      <small className="text-muted d-block text-uppercase fw-semibold mb-1">{t('patient_name')}</small>
                      <span className="fs-5 fw-medium text-dark">{enquiry.patient.name}</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="text-primary mt-1"><FiInfo size={24} /></div>
                    <div>
                      <small className="text-muted d-block text-uppercase fw-semibold mb-1">{t('enquiry_type')}</small>
                      <span className="fs-5 fw-medium text-dark">{enquiry.enquiryType.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="text-primary mt-1"><FiCalendar size={24} /></div>
                    <div>
                      <small className="text-muted d-block text-uppercase fw-semibold mb-1">{t('date')}</small>
                      <span className="fs-5 fw-medium text-dark">{new Date(enquiry.date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="text-primary mt-1"><FiFileText size={24} /></div>
                    <div>
                      <small className="text-muted d-block text-uppercase fw-semibold mb-1">Department</small>
                      <span className="fs-5 fw-medium text-dark">{enquiry.department ? enquiry.department.name : 'Not Assigned'}</span>
                    </div>
                  </div>
                </div>
                <div className="col-12 mt-4 pt-4 border-top">
                  <small className="text-muted d-block text-uppercase fw-semibold mb-2">{t('description')}</small>
                  <p className="fs-5 text-dark bg-light p-4 rounded-3 border">{enquiry.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackEnquiry;
