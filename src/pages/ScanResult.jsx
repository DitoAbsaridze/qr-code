import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { teachers } from "../data/teachers";
import { saveScanToFirebase } from "../services/attendanceService";

export default function ScanResult() {
  const { personalNumber } = useParams();
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasSaved = useRef(false);

  const teacher = teachers.find(
    (teacher) => teacher.personalNumber === personalNumber
  );

  useEffect(() => {
    const saveScan = async () => {
      if (!teacher) {
        setLoading(false);
        return;
      }

      if (hasSaved.current) return;
      hasSaved.current = true;

      try {
        const result = await saveScanToFirebase(personalNumber);
        setScanResult(result);
      } catch (error) {
        console.error(error);
        setScanResult({
          success: false,
          message: "Something went wrong while saving scan.",
        });
      } finally {
        setLoading(false);
      }
    };

    saveScan();
  }, [personalNumber, teacher]);

  return (
    <div className="center-page">
      <div className="card scan-success-card">
        {loading && (
          <>
            <div className="success-icon">...</div>
            <h1>Saving</h1>
            <p className="subtitle">Please wait.</p>
          </>
        )}

        {!loading && !teacher && (
          <>
            <div className="success-icon not-allowed-icon">!</div>
            <h1>Teacher not found</h1>
            <p className="subtitle">This QR code is not registered.</p>
          </>
        )}

        {!loading && teacher && scanResult && (
          <>
            <div
              className={`success-icon ${
                scanResult.success ? "" : "not-allowed-icon"
              }`}
            >
              {scanResult.success ? "✓" : "!"}
            </div>

            <h1>{scanResult.success ? "Success" : "Not allowed"}</h1>

            <h2>{teacher.fullName}</h2>

            <p>
              Type:{" "}
              <strong>
                {scanResult.scan ? scanResult.scan.type.toUpperCase() : "-"}
              </strong>
            </p>

            <p className="subtitle">{scanResult.message}</p>

            {scanResult.scan && (
              <p>
                Time: <strong>{scanResult.scan.time}</strong>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}