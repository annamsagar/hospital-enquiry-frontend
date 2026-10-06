import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { FiCheckCircle } from 'react-icons/fi';

const SubmitEnquiry = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientAge: '',
    enquiryType: 'OTHER',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.patientName)) {
      newErrors.patientName = 'Name can only contain letters and spaces';
    }

    if (!formData.patientPhone.trim()) {
      newErrors.patientPhone = 'Phone number is required';
    } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(formData.patientPhone)) {
      newErrors.patientPhone = 'Invalid phone number format';
    }

    if (formData.patientAge && (isNaN(formData.patientAge) || formData.patientAge <= 0 || formData.patientAge > 120)) {
      newErrors.patientAge = 'Please enter a valid age between 1 and 120';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const enquiryTypes = ['APPOINTMENT', 'BILLING', 'DEPARTMENT_INFORMATION', 'DOCTOR_AVAILABILITY', 'LAB_REPORTS', 'OTHER'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.post('/api/enquiries', formData);
      setSuccessMsg(`Enquiry submitted successfully! Your Tracking ID is: ${response.data.id}`);
      setFormData({
        patientName: '',
        patientPhone: '',
        patientAge: '',
        enquiryType: 'OTHER',
        description: ''
      });
      setErrors({});
      window.scrollTo(0,0);
    } catch (error) {
      console.error('Error submitting enquiry', error);
      alert('Failed to submit enquiry.');
    }
  };

  return (
    <div className="row justify-content-center animate-fade-in-up">
      <div className="col-lg-7 col-md-9">
        <div className="glass-card border-0 overflow-hidden">
          <div className="bg-gradient-primary text-white p-4 text-center">
            <h2 className="fw-bold mb-0">📝 {t('submit_enquiry')}</h2>
            <p className="mb-0 mt-2 opacity-75">Please fill out the details below.</p>
          </div>
          <div className="p-4 p-md-5 bg-white">
            {successMsg && (
              <div className="alert alert-success d-flex align-items-center mb-4 border-0 shadow-sm rounded-3">
                <FiCheckCircle size={24} className="me-3" />
                <div className="fs-5 fw-medium">{successMsg}</div>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row g-4 mb-4">
                <div className="col-md-12">
                  <label className="form-label fw-medium text-muted">{t('patient_name')}</label>
                  <input type="text" className={`form-control form-control-lg ${errors.patientName ? 'is-invalid' : ''}`} name="patientName" value={formData.patientName} onChange={handleChange} required placeholder="John Doe" />
                  {errors.patientName && <div className="invalid-feedback">{errors.patientName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium text-muted">{t('phone_number')}</label>
                  <input type="text" className={`form-control form-control-lg ${errors.patientPhone ? 'is-invalid' : ''}`} name="patientPhone" value={formData.patientPhone} onChange={handleChange} required placeholder="+1 234 567 8900" />
                  {errors.patientPhone && <div className="invalid-feedback">{errors.patientPhone}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium text-muted">{t('age')}</label>
                  <input type="number" className={`form-control form-control-lg ${errors.patientAge ? 'is-invalid' : ''}`} name="patientAge" value={formData.patientAge} onChange={handleChange} placeholder="35" />
                  {errors.patientAge && <div className="invalid-feedback">{errors.patientAge}</div>}
                </div>
                <div className="col-md-12">
                  <label className="form-label fw-medium text-muted">{t('enquiry_type')}</label>
                  <select className="form-select form-select-lg" name="enquiryType" value={formData.enquiryType} onChange={handleChange}>
                    {enquiryTypes.map(type => (
                      <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-12">
                  <label className="form-label fw-medium text-muted">{t('description')}</label>
                  <textarea className={`form-control form-control-lg ${errors.description ? 'is-invalid' : ''}`} rows="4" name="description" value={formData.description} onChange={handleChange} required placeholder="How can we help you?"></textarea>
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>
              </div>
              <button type="submit" className="btn-premium w-100 fs-5 py-3 mt-2">{t('submit')}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitEnquiry;
