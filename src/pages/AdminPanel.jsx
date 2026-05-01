import { Link, useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/");
  };

  return (
    <div className="page">
      <div className="header">
        <div>
          <h1 className="title">Admin Panel</h1>
          <p className="subtitle">Choose what you want to manage.</p>
        </div>

        <button className="button button-light" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="grid two-grid">
        <Link to="/qr-codes" className="panel-link">
          <div className="card">
            <div className="big-icon">▦</div>
            <h2>QR Codes</h2>
            <p className="subtitle">
              View teacher QR codes for check-in and check-out scanning.
            </p>
          </div>
        </Link>

        <Link to="/dashboard" className="panel-link">
          <div className="card">
            <div className="big-icon">📊</div>
            <h2>Dashboard</h2>
            <p className="subtitle">
              View attendance records by today, week, month, or all time.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}