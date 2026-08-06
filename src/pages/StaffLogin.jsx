import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FiLock, FiUser } from 'react-icons/fi';

const StaffLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8081/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      if (res.data.departmentId) {
        localStorage.setItem('departmentId', res.data.departmentId);
      }
      
      if (res.data.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (res.data.role === 'ROLE_DEPARTMENT_STAFF') {
        navigate('/department-staff');
      } else {
        navigate('/receptionist');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="row justify-content-center align-items-center flex-grow-1 animate-fade-in-up">
      <div className="col-md-6 col-lg-5 col-xl-4">
        <div className="glass-card border-0 overflow-hidden shadow-lg">
          <div className="bg-gradient-primary text-white p-5 text-center position-relative">
            <div className="mb-3">
              <FiLock size={56} className="opacity-75" />
            </div>
            <h2 className="fw-bold mb-0">{t('staff_login')}</h2>
            <p className="mb-0 mt-2 opacity-75">Secure Access Portal</p>
          </div>
          <div className="p-4 p-md-5 bg-white">
            {error && <div className="alert alert-danger border-0 shadow-sm rounded-3 fw-medium">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="form-label fw-medium text-muted d-flex align-items-center gap-2">
                  <FiUser /> Username
                </label>
                <input 
                  type="text" 
                  className="form-control form-control-lg bg-light" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  placeholder="Enter your username"
                />
              </div>
              <div className="mb-5">
                <label className="form-label fw-medium text-muted d-flex align-items-center gap-2">
                  <FiLock /> Password
                </label>
                <input 
                  type="password" 
                  className="form-control form-control-lg bg-light" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="btn-premium w-100 fs-5 py-3 shadow-lg">Login to Dashboard</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
