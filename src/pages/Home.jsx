import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiEdit3, FiSearch } from 'react-icons/fi';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 animate-fade-in-up">
      <div className="text-center mb-5" style={{ maxWidth: '800px' }}>
        <h1 className="display-3 fw-bold text-primary mb-4" style={{ letterSpacing: '-1px' }}>
          {t('hospital_name')}
        </h1>
        <p className="fs-4 text-muted mb-5">
          Welcome to our state-of-the-art enquiry management system. We are here to assist you with your appointments, billing, and lab reports.
        </p>
      </div>
      
      <div className="row g-4 justify-content-center w-100" style={{ maxWidth: '900px' }}>
        <div className="col-md-6 delay-1 animate-fade-in-up">
          <div className="glass-card p-5 text-center h-100 hover-scale d-flex flex-column justify-content-center">
            <div className="mb-4 text-primary">
              <FiEdit3 size={64} />
            </div>
            <h2 className="fw-bold mb-3">{t('submit_enquiry')}</h2>
            <p className="text-muted mb-4">Have a question or need an appointment? Submit your details here.</p>
            <Link to="/submit-enquiry" className="btn-premium mt-auto w-100 text-decoration-none">
              Start Enquiry
            </Link>
          </div>
        </div>

        <div className="col-md-6 delay-2 animate-fade-in-up">
          <div className="glass-card p-5 text-center h-100 hover-scale d-flex flex-column justify-content-center">
            <div className="mb-4 text-accent" style={{ color: 'var(--accent-color)' }}>
              <FiSearch size={64} />
            </div>
            <h2 className="fw-bold mb-3">{t('track_enquiry')}</h2>
            <p className="text-muted mb-4">Already submitted an enquiry? Check the live status here.</p>
            <Link to="/track-enquiry" className="btn-premium-outline mt-auto w-100 text-decoration-none text-center">
              Check Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
