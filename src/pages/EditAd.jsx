import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function EditAds() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);
  const [values, setValues] = useState({
    title: "",
    description: "",
    email: "",
    tel: "",
    image_ads: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const emailRegex = /^\S+@\S+\.\S+$/;

  useEffect(() => {
    const id = localStorage.getItem("currentAdId");

    if (!id) return;

    fetch(`${API_URL}/ad/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos recibidos:", data);
        const ad = Array.isArray(data) ? data[0] : data;
        setUser(ad);
        setValues({
          title: ad.title || "",
          description: ad.description || "",
          email: ad.email || "",
          tel: ad.number || "",
          image_ads: ad.image_ads ? JSON.parse(ad.image_ads) : [],
        });
      })
      .catch((err) => console.error("Error al obtener el usuario:", err));
  }, []);

  const validate = () => {
    const newErrors = {};
    const telString = values.tel ? String(values.tel) : "";

    if (!values.title.trim()) newErrors.title = "El título es obligatorio";
    if (!values.description.trim())
      newErrors.description = "La descripción es obligatoria";
    const palabras = values.description.trim().split(/\s+/);
    if (palabras.length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 palabras";
    }
    if (!telString.trim())
      newErrors.tel = "El número de telefono es obligatorio";

    if (!values.email) {
      newErrors.email = "El email es obligatorio";
    } else if (!emailRegex.test(values.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!/^\d+$/.test(telString)) {
      newErrors.tel = "El número de teléfono solo debe contener dígitos";
    } else if (telString.length !== 9) {
      newErrors.tel = "El número de teléfono debe tener exactamente 9 dígitos";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
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
        const ad_id = localStorage.getItem("currentAdId");

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("email", values.email);
        formData.append("tel", values.tel);
        formData.append("ad_id", ad_id);

        imageFiles.forEach((file) => {
          formData.append("images", file);
        });

        const response = await fetch("${API_URL}/edit-Ad", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          alert("✅ Anuncio actualizado con éxito");
          setImageFiles([]);
          setValues({
            title: "",
            description: "",
            email: "",
            tel: "",
            image_ads: [],
          });
          window.location.reload();
        } else {
          alert("❌ Error: " + data.error);
        }
      } catch (error) {
        console.error("Error al enviar datos:", error);
        alert("❌ Error de conexión con el servidor");
      }
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar este anuncio?"
    );
    if (!confirmDelete) return;

    const ad_id = localStorage.getItem("currentAdId");
    try {
      const response = await fetch(`${API_URL}/ad/${ad_id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Anuncio eliminado con éxito");
        window.location.href = "/profile";
      } else {
        alert("Error al eliminar anuncio: " + data.error);
      }
    } catch (error) {
      console.error("Error al eliminar anuncio:", error);
      alert("Error de conexión con el servidor");
    }
  };

  const handleDeleteImage = async (imageName) => {
    const ad_id = localStorage.getItem("currentAdId");

    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar esta imagen?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch("${API_URL}/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad_id, image: imageName }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Imagen eliminada con éxito");
        setValues((prev) => ({
          ...prev,
          image_ads: prev.image_ads.filter((img) => img !== imageName),
        }));
      } else {
        alert("Error al eliminar imagen: " + data.error);
      }
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      alert("Error de conexión con el servidor");
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
          <button className="button-back">
            <Link to="/profile" className="button-back-link">
              Volver
            </Link>
          </button>
        </nav>

        <main className="main-ads">
          <h2 className="ad-add-title">Actualizar anuncio</h2>

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
                <div className="col-12">
                  <div className="form-group">
                    <label
                      htmlFor="images"
                      className="upload-label-edit-ad upload-new-imgs"
                    >
                      Selecionar nuevas imágenes
                    </label>
                    <input
                      type="file"
                      id="images"
                      name="images"
                      multiple
                      accept="image/*"
                      onChange={handleFilesChange}
                      className="upload-input "
                    />
                  </div>
                </div>
              </div>

              {values.image_ads.length > 0 ? (
                <div className="images-grid">
                  {values.image_ads.map((image, index) => (
                    <div key={index} className="image-item">
                      <img
                        src={`${API_URL}/uploads/${image}`}
                        alt={`Imagen ${index + 1} del anuncio`}
                        className="img-grid"
                      />
                      <button
                        type="button"
                        className="delete-image-button"
                        onClick={() => handleDeleteImage(image)}
                      >
                        Eliminar imágen
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-imgs">No hay imágenes para este anuncio</p>
              )}

              <div className="button-save-add-container-edit-ad ">
                <button type="submit" className="button-save-ad">
                  Guardar Anuncio
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="button-save-ad"
                >
                  Eliminar Anuncio
                </button>
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
