import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function Login({ onClose }) {
  const API_URL = "https://earthdnd.onrender.com";
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }

      console.log("✅ Usuario logueado:", data.user);

      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userSurname", data.user.surname);

      navigate("/profile");
    } catch (err) {
      console.error("Error en la conexión:", err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="card-login-form">
      <div className="card-header">
        <button className="close-button-login" onClick={onClose}>
          X
        </button>
        <h2 className="h2-login">Bienvenido a DuckDND</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-login">
        <label className="label-login">
          Correo electrónico:
          <input
            type="email"
            placeholder="Hola@ejemplo.com"
            className="input-login"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="label-login">
          Contraseña:
          <input
            type="password"
            className="input-login"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </label>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="send-button-login" type="submit">
          Continuar
        </button>

        <div className="o">o</div>
        <Link to="/signup" className="link-to-register">
          <button className="send-button-login-register">Registrarse</button>
        </Link>
      </form>
    </div>
  );
}
