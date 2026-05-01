import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { teachers } from "../data/teachers";
import { getScansFromFirebase } from "../services/attendanceService";

export default function Dashboard() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadScans = async () => {
    try {
      setLoading(true);
      const data = await getScansFromFirebase();
      setScans(data);
    } catch (error) {
      console.error(error);
      alert("Could not load scans from Firebase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScans();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const getTodayScans = (personalNumber) => {
    return scans.filter(
      (scan) => scan.personalNumber === personalNumber && scan.date === today
    );
  };

  return (
    <div className="page">
      <div className="header">
        <div>
          <h1 className="title">Dashboard</h1>
          <p className="subtitle">Choose a teacher to view attendance details.</p>
        </div>

        <div className="header-actions">
          <Link to="/admin">
            <button className="button button-light">Back to admin</button>
          </Link>

          <button className="button" onClick={loadScans}>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading teachers...</p>
      ) : (
        <div className="grid teacher-grid">
          {teachers.map((teacher) => {
            const todayScans = getTodayScans(teacher.personalNumber);

            const checkIn = todayScans.find((scan) => scan.type === "in");
            const checkOut = todayScans.find((scan) => scan.type === "out");

            return (
              <Link
                key={teacher.id}
                to={`/teacher/${teacher.personalNumber}`}
                className="panel-link"
              >
                <div className="card teacher-card">
                  <h2>{teacher.fullName}</h2>

                  <p className="subtitle">
                    Personal number: <strong>{teacher.personalNumber}</strong>
                  </p>

                  <div className="grid two-grid" style={{ marginTop: 16 }}>
                    <div className="stat">
                      <div className="stat-label">Today IN</div>
                      <div className="stat-value">
                        {checkIn ? checkIn.time : "—"}
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-label">Today OUT</div>
                      <div className="stat-value">
                        {checkOut ? checkOut.time : "—"}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    {checkIn && !checkOut && (
                      <span className="badge badge-in">Currently inside</span>
                    )}

                    {checkIn && checkOut && (
                      <span className="badge badge-out">Completed day</span>
                    )}

                    {!checkIn && !checkOut && (
                      <span className="badge badge-waiting">
                        Not scanned today
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}