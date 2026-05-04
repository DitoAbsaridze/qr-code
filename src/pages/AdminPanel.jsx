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
          <h1 className="title">ადმინისტრაციული პანელი</h1>
          <p className="subtitle">აირჩიეთ, რისი მართვა გსურთ.</p>
        </div>

        <button className="button button-light" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="grid two-grid">
        <Link to="/qr-codes" className="panel-link">
          <div className="card">
            <div className="big-icon">▦</div>
            <h2>QR კოდები</h2>
            <p className="subtitle">
              იხილეთ მასწავლებლის QR კოდები რეგისტრაციისა და გასვლის სკანირებისთვის.
            </p>
          </div>
        </Link>

        <Link to="/dashboard" className="panel-link">
          <div className="card">
            <div className="big-icon">📊</div>
            <h2>დაფა</h2>
            <p className="subtitle">
              დასწრების ჩანაწერების ნახვა დღევანდელი, კვირის, თვის ან ყველა დროის მიხედვით.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
