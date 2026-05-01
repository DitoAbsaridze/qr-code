import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import QRCodes from "./pages/QRCodes";
import Dashboard from "./pages/Dashboard";
import TeacherDetails from "./pages/TeacherDetails";
import ScanResult from "./pages/ScanResult";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
}

function NotFound() {
  return (
    <div className="page">
      <h2>Page not found</h2>
      <Link to="/">Go to login</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/qr-codes"
        element={
          <ProtectedRoute>
            <QRCodes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/:personalNumber"
        element={
          <ProtectedRoute>
            <TeacherDetails />
          </ProtectedRoute>
        }
      />

      <Route path="/scan/:personalNumber" element={<ScanResult />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}