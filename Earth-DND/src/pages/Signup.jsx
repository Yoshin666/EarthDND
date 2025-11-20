import React, { useState } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";

export function SignUp() {
  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000"
      : "https://earthdnd.onrender.com";

  const [values, setValues] = useState({
    name: "",
    surname: "",
    email: "",
    pass: "",
    confirmPass: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});

  const emailRegex = /^\S+@\S+\.\S+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const validate = () => {
    const newErrors = {};
    if (!values.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!values.surname.trim())
      newErrors.surname = "El apellido es obligatorio";
    if (!values.email) {
      newErrors.email = "El email es obligatorio";
    } else if (!emailRegex.test(values.email)) {
      newErrors.email = "El email no es válido";
    }
    if (!values.pass) {
      newErrors.pass = "La contraseña es obligatoria";
    } else if (!passwordRegex.test(values.pass)) {
      newErrors.pass =
        "Mayuscula, mínimo 8 caracteres, número y caracter especial obligatorio";
    }
    if (!values.confirmPass) {
      newErrors.confirmPass = "La confirmación es obligatoria";
    } else if (values.pass !== values.confirmPass) {
      newErrors.confirmPass = "Las contraseñas no coinciden";
    }
    if (!values.terms) newErrors.terms = "Debes aceptar los términos";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            surname: values.surname,
            email: values.email,
            pass: values.pass,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("✅ Usuario registrado con éxito");
          setValues({
            name: "",
            surname: "",
            email: "",
            pass: "",
            confirmPass: "",
            terms: false,
          });
        } else {
          alert("❌ Error: " + data.error);
        }
      } catch (error) {
        console.error("Error al enviar datos:", error);
        console.log(API_URL);
        alert("❌ Error de conexión con el servidor");
      }
    }
  };

  return (
    <>
      <div className="container">
        <header className="cabecera">
          <h1>DUCKDND</h1>
          <img
            className="logo"
            src="https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i.5Vzu8cvrxo/v0/-1x-1.jpg"
            alt="logo"
          />
        </header>
        <nav>
          <button className="button-back-register">
            <Link to="/" className="button-back-register">
              Volver
            </Link>
          </button>
        </nav>
        <main>
          <section className="form-register">
            <h2 className="h2-register-form">Formulario de registro</h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="input-group">
                <label htmlFor="name" className="label-register">
                  Nombre:
                </label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  className="input-register"
                  placeholder="Juan"
                />
              </div>
              {errors.name && <p className="text-danger">{errors.name}</p>}

              <div className="input-group">
                <label htmlFor="surname" className="label-register">
                  Apellido:
                </label>
                <input
                  type="text"
                  name="surname"
                  value={values.surname}
                  onChange={handleChange}
                  className="input-register"
                  placeholder="Pérez"
                />
              </div>
              {errors.surname && (
                <p className="text-danger">{errors.surname}</p>
              )}

              <div className="input-group">
                <label htmlFor="email" className="label-register">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  className="input-register"
                  placeholder="juan@hotmail.com"
                />
              </div>
              {errors.email && <p className="text-danger">{errors.email}</p>}

              <div className="input-group">
                <label htmlFor="pass" className="label-register">
                  Contraseña:
                </label>
                <input
                  type="password"
                  name="pass"
                  value={values.pass}
                  onChange={handleChange}
                  className="input-register"
                />
              </div>
              {errors.pass && <p className="text-danger">{errors.pass}</p>}

              <div className="input-group">
                <label htmlFor="confirmPass" className="label-register">
                  Confirmar contraseña:
                </label>
                <input
                  type="password"
                  name="confirmPass"
                  value={values.confirmPass}
                  onChange={handleChange}
                  className="input-register"
                />
              </div>
              {errors.confirmPass && (
                <p className="text-danger">{errors.confirmPass}</p>
              )}

              <div>
                <label htmlFor="terms" className="label-register checkbox">
                  Aceptas los términos y condiciones:
                </label>
                <input
                  type="checkbox"
                  name="terms"
                  checked={values.terms}
                  onChange={handleChange}
                />
              </div>
              {errors.terms && <p className="text-danger">{errors.terms}</p>}

              <button className="send-button-login" type="submit">
                Continuar
              </button>
            </form>
          </section>
        </main>
      </div>
      <footer className="footer-signup">
        <div className="container-footer">
          <p>© 2025 DuckDND. Todos los derechos reservados.</p>
          <div className="social-icons">
            <a href="https://www.instagram.com/realmadrid/">
              <i className="bi bi-instagram social"></i>
            </a>
            <a href="https://www.instagram.com/cristiano/">
              <i className="bi bi-twitter-x social"></i>
            </a>
            <a href="https://www.instagram.com/realmadrid/">
              <i className="bi bi-facebook social"></i>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
