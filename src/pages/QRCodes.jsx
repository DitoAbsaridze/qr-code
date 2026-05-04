import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { teachers } from "../data/teachers";

export default function QRCodes() {
  const baseUrl = window.location.origin;

  return (
    <div className="page">
      <div className="header">
        <div>
          <h1 className="title">მასწავლებლის QR კოდები</h1>
          <p className="subtitle">
            დაბეჭდეთ ან გამოფინეთ ეს QR კოდები. მასწავლებლები შესასვლელთან სკანირებენ მათ.
          </p>
        </div>

        <Link to="/admin">
          <button className="button button-light">დაბრუნება ადმინზე</button>
        </Link>
      </div>

      <div className="grid teacher-grid">
        {teachers.map((teacher) => {
          const scanUrl = `${baseUrl}/scan/${teacher.personalNumber}`;

          return (
            <div className="card" key={teacher.id}>
              <h2>{teacher.fullName}</h2>
              <p className="subtitle">
                Personal number: <strong>{teacher.personalNumber}</strong>
              </p>

              <div className="qr-box">
                <QRCodeSVG value={scanUrl} size={190} />
              </div>

              <p className="subtitle" style={{ fontSize: 13 }}>
                QR opens: {scanUrl}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
