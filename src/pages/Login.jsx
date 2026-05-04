import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "1234") {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin");
    } else {
      setError("Wrong username or password.");
    }
  };

  return (
    <div className="center-page">
      <form className="card login-card" onSubmit={handleSubmit}>
        <div className="logo-circle">✓</div>

        <h1 className="title">მასწავლებლის დასწრება</h1>
        <p className="subtitle">
          უსაფრთხო ადმინისტრაციული პანელი მასწავლებლის QR დასწრების ჩანაწერების სამართავად.
        </p>

        <input
          className="input"
          type="text"
          placeholder="სახელი"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="პაროლი"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button className="button" style={{ width: "100%", marginTop: 14 }}>
          შესვლა
        </button>

        <p className="subtitle" style={{ fontSize: 13 }}>
          Demo login: admin / 1234
        </p>
      </form>
    </div>
  );
}
