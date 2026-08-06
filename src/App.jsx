import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubmitEnquiry from './pages/SubmitEnquiry';
import TrackEnquiry from './pages/TrackEnquiry';
import StaffLogin from './pages/StaffLogin';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DepartmentDashboard from './pages/DepartmentDashboard';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container-fluid main-wrapper px-4 px-md-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit-enquiry" element={<SubmitEnquiry />} />
            <Route path="/track-enquiry" element={<TrackEnquiry />} />
            <Route path="/staff" element={<StaffLogin />} />
            <Route path="/receptionist" element={<ReceptionistDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/department-staff" element={<DepartmentDashboard />} />
          </Routes>
        </main>
        <footer className="bg-dark text-white text-center py-3 mt-auto">
          &copy; 2026 City General Hospital
        </footer>
      </div>
    </Router>
  );
}

export default App;
