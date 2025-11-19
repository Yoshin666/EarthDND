import React, { useState, useEffect } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";

export function EditProfile() {
  const [user, setUser] = useState(null);
  const [values, setValues] = useState({
    name: "",
    surname: "",
    email: "",
    pass: "",
    confirmPass: "",
  });

  useEffect(() => {
    const id = localStorage.getItem("userId");

    if (!id) return;

    fetch(`http://localhost:3000/user/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setValues({
          name: data.name || "",
          surname: data.surname || "",
          email: data.email || "",
          pass: "",
          confirmPass: "",
        });
      })
      .catch((err) => console.error("Error al obtener el usuario:", err));
  }, []);

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

    if (values.pass.trim() !== "") {
      if (!passwordRegex.test(values.pass)) {
        newErrors.pass =
          "Mayúscula, mínimo 8 caracteres, número y caracter especial obligatorio";
      }

      if (!values.confirmPass.trim()) {
        newErrors.confirmPass = "La confirmación es obligatoria";
      } else if (values.pass !== values.confirmPass) {
        newErrors.confirmPass = "Las contraseñas no coinciden";
      }
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const id = localStorage.getItem("userId");
        const response = await fetch("http://localhost:3000/edit-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            name: values.name,
            surname: values.surname,
            email: values.email,
            pass: values.pass,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("✅ Usuario actualizado con éxito");
          localStorage.setItem("userEmail", values.email);
          localStorage.setItem("userName", values.name);
          localStorage.setItem("userSurname", values.surname);
        } else {
          alert("❌ Error: " + data.error);
        }
      } catch (error) {
        console.error("Error al enviar datos:", error);
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
            <Link to="/profile" className="button-back-register">
              Volver
            </Link>
          </button>
        </nav>
        <main>
          <section className="form-register">
            <h2 className="h2-register-form">Actualizar usuario</h2>

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
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-danger">{errors.email}</p>}

              <div className="input-group">
                <label htmlFor="pass" className="label-register">
                  Contraseña (opcional):
                </label>
                <input
                  type="password"
                  name="pass"
                  value={values.pass}
                  onChange={handleChange}
                  className="input-register"
                  autoComplete="new-password"
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
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPass && (
                <p className="text-danger">{errors.confirmPass}</p>
              )}

              <button className="send-button-login" type="submit">
                Guardar cambios
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
