import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMonitor, FiEdit3, FiSearch, FiLock, FiUser } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation(); // force re-render on route change
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
    setIsNavCollapsed(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/staff';
  };

  const closeNav = () => {
    setIsNavCollapsed(true);
  };

  const isLoggedIn = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  return (
    <nav className="navbar navbar-expand-lg navbar-light glass-navbar sticky-top py-3">
      <div className="container-fluid px-4 px-md-5">
        <Link className="navbar-brand fs-4 fw-bold text-primary d-flex align-items-center gap-2" to="/" onClick={closeNav}>
          <FiMonitor size={28} />
          {t('hospital_name')}
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isNavCollapsed ? '' : 'show'}`} id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link fw-medium d-flex align-items-center gap-2" to="/submit-enquiry" onClick={closeNav}>
                <FiEdit3 /> {t('submit_enquiry')}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium d-flex align-items-center gap-2" to="/track-enquiry" onClick={closeNav}>
                <FiSearch /> {t('track_enquiry')}
              </Link>
            </li>
            
            {isLoggedIn ? (
              <>
                <li className="nav-item ms-lg-3">
                  <Link className="nav-link fw-medium d-flex align-items-center gap-2" to={
                    userRole === 'ROLE_ADMIN' ? '/admin' : 
                    userRole === 'ROLE_DEPARTMENT_STAFF' ? '/department-staff' : '/receptionist'
                  } onClick={closeNav}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item ms-lg-3 d-flex align-items-center">
                  <span className="badge bg-light text-dark border me-3 d-flex align-items-center gap-2 px-3 py-2">
                    <FiUser /> {userRole === 'ROLE_ADMIN' ? 'Admin' : userRole === 'ROLE_DEPARTMENT_STAFF' ? 'Dept Staff' : 'Receptionist'}
                  </span>
                  <button onClick={handleLogout} className="btn-premium-outline btn-sm">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item ms-lg-3">
                <Link className="btn-premium btn-sm d-flex align-items-center gap-2" to="/staff" onClick={closeNav}>
                  <FiLock /> {t('staff_login')}
                </Link>
              </li>
            )}
            
            <li className="nav-item ms-lg-3">
              <select 
                className="form-select form-select-sm border-0 shadow-sm rounded-pill px-3" 
                onChange={handleLanguageChange} 
                defaultValue={i18n.language}
                style={{ width: 'auto', backgroundColor: 'var(--glass-bg)' }}
              >
                <option value="en">English</option>
                <option value="te">తెలుగు</option>
                <option value="hi">हिन्दी</option>
              </select>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
