import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { teachers } from "../data/teachers";
import { getScansFromFirebase } from "../services/attendanceService";

export default function TeacherDetails() {
  const { personalNumber } = useParams();

  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("today");

  const teacher = teachers.find(
    (teacher) => teacher.personalNumber === personalNumber
  );

  const loadScans = async () => {
    try {
      setLoading(true);
      const data = await getScansFromFirebase();
      setScans(data);
    } catch (error) {
      console.error(error);
      alert("Could not load teacher scans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScans();
  }, []);

  const todayKey = new Date().toISOString().split("T")[0];

  const teacherScans = scans.filter(
    (scan) => scan.personalNumber === personalNumber
  );

  const isInFilter = (scan) => {
    if (!scan.fullDate) return false;

    const scanDate = new Date(scan.fullDate);
    const now = new Date();

    if (filter === "today") {
      return scan.date === todayKey;
    }

    if (filter === "week") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return scanDate >= sevenDaysAgo;
    }

    if (filter === "month") {
      return (
        scanDate.getMonth() === now.getMonth() &&
        scanDate.getFullYear() === now.getFullYear()
      );
    }

    return true;
  };

  const filteredScans = teacherScans.filter(isInFilter);

  const groupedByDate = filteredScans.reduce((groups, scan) => {
    if (!groups[scan.date]) {
      groups[scan.date] = [];
    }

    groups[scan.date].push(scan);
    return groups;
  }, {});

  const filterTitle = {
    today: "Today",
    week: "Past Week",
    month: "This Month",
    all: "All Records",
  };

  if (!teacher) {
    return (
      <div className="page">
        <Link to="/dashboard">
          <button className="button button-light">უკან დაფაზე</button>
        </Link>

        <h1>მასწავლებელი ვერ მოიძებნა</h1>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="header">
        <div>
          <h1 className="title">{teacher.fullName}</h1>
          <p className="subtitle">
            Personal number: <strong>{teacher.personalNumber}</strong>
          </p>
        </div>

        <div className="header-actions">
          <Link to="/dashboard">
            <button className="button button-light">უკან დაფაზე</button>
          </Link>

          <button className="button" onClick={loadScans}>
            გადატვირთვა
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-button ${filter === "today" ? "active" : ""}`}
          onClick={() => setFilter("today")}
        >
          დღეს
        </button>

        <button
          className={`filter-button ${filter === "week" ? "active" : ""}`}
          onClick={() => setFilter("week")}
        >
          ამ კვირას
        </button>

        <button
          className={`filter-button ${filter === "month" ? "active" : ""}`}
          onClick={() => setFilter("month")}
        >
          ამ თვეში
        </button>

        <button
          className={`filter-button ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          ყველა დროის
        </button>
      </div>

      <h2>{filterTitle[filter]}</h2>

      {loading ? (
        <p>Loading records...</p>
      ) : filteredScans.length === 0 ? (
        <div className="card">
          <p>ამ პერიოდისთვის ჩანაწერები არ არის.</p>
        </div>
      ) : (
        <div className="grid">
          {Object.entries(groupedByDate).map(([date, records]) => {
            const checkIn = records.find((scan) => scan.type === "in");
            const checkOut = records.find((scan) => scan.type === "out");

            return (
              <div className="card" key={date}>
                <h2>{date}</h2>

                <div className="grid two-grid" style={{ marginTop: 16 }}>
                  <div className="stat">
                    <div className="stat-label">IN</div>
                    <div className="stat-value">
                      {checkIn ? checkIn.time : "—"}
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-label">OUT</div>
                    <div className="stat-value">
                      {checkOut ? checkOut.time : "—"}
                    </div>
                  </div>
                </div>

                <h3 style={{ marginTop: 20 }}>სრული ჩანაწერები</h3>

                {records.map((scan) => (
                  <div className="record" key={scan.id}>
                    <p>
                      <strong>Type:</strong>{" "}
                      <span
                        className={`badge ${
                          scan.type === "in" ? "badge-in" : "badge-out"
                        }`}
                      >
                        {scan.type.toUpperCase()}
                      </span>
                    </p>

                    <p>
                      <strong>Time:</strong> {scan.time}
                    </p>

                    <p>
                      <strong>Full date:</strong> {scan.fullDate}
                    </p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
