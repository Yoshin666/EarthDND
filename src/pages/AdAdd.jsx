import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";
import { useState } from "react";

export function AddAds() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [values, setValues] = useState({
    title: "",
    description: "",
    email: "",
    tel: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const emailRegex = /^\S+@\S+\.\S+$/;

  const validate = () => {
    const newErrors = {};
    if (!values.title.trim()) newErrors.title = "El título es obligatorio";

    if (!values.description.trim())
      newErrors.description = "La descripción es obligatoria";
    const palabras = values.description.trim().split(/\s+/);
    if (palabras.length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 palabras";
    }

    if (!values.tel.trim())
      newErrors.tel = "El número de telefono es obligatorio";
    if (!values.email) newErrors.email = "El email es obligatorio";
    else if (!emailRegex.test(values.email))
      newErrors.email = "El email no es válido";
    if (!/^\d+$/.test(values.tel))
      newErrors.tel = "El número de teléfono solo debe contener dígitos";
    else if (values.tel.length !== 9)
      newErrors.tel = "El número de teléfono debe tener exactamente 9 dígitos";
    return newErrors;
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const user_id = localStorage.getItem("userId");
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("email", values.email);
        formData.append("tel", values.tel);
        formData.append("user_id", user_id);

        imageFiles.forEach((file, idx) => {
          formData.append("images", file);
        });

        const response = await fetch("${API_URL}/adAdd", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          alert("✅ Anuncio añadido con éxito");
          setValues({
            title: "",
            description: "",
            email: "",
            tel: "",
            img: "",
          });
          setImageFiles([]);
        } else {
          alert("❌ Error: " + (data.error || data.message));
        }
      } catch (error) {
        console.error("Error al enviar datos:", error);
        alert("❌ Error de conexión con el servidor");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
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
          <button className="button-back">
            <Link to="/profile" className="button-back-link">
              Volver
            </Link>
          </button>
        </nav>

        <main className="main-ads">
          <h2 className="ad-add-title">Añade un anuncio</h2>

          <section className="ad-container">
            <form className="form-ads" onSubmit={handleSubmit} noValidate>
              <div className="row row-ads-add">
                <div className="col-6 col-ad">
                  <div>
                    <label htmlFor="title" className="label-ad">
                      Título:
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="input-ad"
                      value={values.title}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.title && (
                    <p className="text-danger">{errors.title}</p>
                  )}
                </div>
                <div className="col-6 col-ads">
                  <div>
                    <label htmlFor="description" className="label-ad">
                      Descripción:
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="input-ad textarea-ad"
                      value={values.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  {errors.description && (
                    <p className="text-danger">{errors.description}</p>
                  )}
                </div>
              </div>

              <div className="row row-ads-add">
                <div className="col-6 col-ad">
                  <div>
                    <label htmlFor="email" className="label-ad">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="input-ad"
                      value={values.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-danger">{errors.email}</p>
                  )}
                </div>
                <div className="col-6 col-ads">
                  <div>
                    <label htmlFor="tel" className="label-ad">
                      Número:
                    </label>
                    <input
                      type="tel"
                      id="tel"
                      name="tel"
                      className="input-ad"
                      value={values.tel}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.tel && <p className="text-danger">{errors.tel}</p>}
                </div>
              </div>

              <div className="row row-ads-add">
                <div className=" container-edit-button-add-ad">
                  <input
                    type="file"
                    id="image"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleFilesChange}
                    className="upload-input"
                  />
                  <label
                    htmlFor="image"
                    className="upload-label-edit-ad"
                    value={values.img}
                  >
                    Selecionar imágenes
                  </label>
                  <button type="submit" className="upload-button-edit-ad">
                    Guardar anuncio
                  </button>
                </div>
              </div>
            </form>
          </section>
        </main>
      </div>

      <footer className="footer-profile">
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
