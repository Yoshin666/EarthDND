import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [ads, setAds] = useState([]);
  const [file, setFile] = useState(null);

  const handleSubmitImage = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("imagen", file);
    formData.append("userId", localStorage.getItem("userId"));

    await axios.post(`${API_URL}/upload-profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Imagen subida");
    window.location.reload();
  };

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) return;

    fetch(`${API_URL}/user/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error al obtener el usuario:", err));

    fetch(`${API_URL}/ads/${id}`)
      .then((res) => res.json())
      .then((data) => setAds(data))
      .catch((err) => console.error("Error al obtener anuncios:", err));
  }, []);

  if (!user) {
    return <p>Cargando datos del usuario...</p>;
  }

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
            <Link to="/" className="button-back-link">
              Inicio
            </Link>
          </button>
          <button className="button-back">
            <Link to="/ads" className="button-back-link">
              Anuncios
            </Link>
          </button>
          <button
            className="button-close-profile"
            onClick={() => {
              localStorage.removeItem("userEmail");
              window.location.href = "/";
            }}
          >
            Cerrar sesión
          </button>
        </nav>
        <main>
          <section className="section-profile">
            <div className="row">
              <div className="col-md-4 col-profile">
                <div className="card">
                  <div className="card-body card-body-img">
                    <h2 className="card-header-profile">Mi perfil</h2>
                    <div className="profile-img-box">
                      <img
                        src={
                          user.profile_image
                            ? `${API_URL}/uploads/${user.profile_image}`
                            : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                        }
                        alt="Foto de perfil"
                        className="profile-img"
                      />
                    </div>
                    <form onSubmit={handleSubmitImage} className="upload-form">
                      <input
                        type="file"
                        id="file-upload"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="upload-input"
                        style={{ display: "none" }}
                      />
                      <label htmlFor="file-upload" className="upload-label">
                        Seleccionar
                      </label>
                      <button type="submit" className="upload-button">
                        Confirmar
                      </button>
                    </form>

                    <p className="data-profile">
                      <strong></strong> {user.name} {user.surname}
                    </p>
                    <p className="data-profile">{user.email}</p>
                  </div>
                  <div className="edit-profile-button1">
                    <Link to="/editprofile" className="edit-profile-link">
                      <button className="edit-profile-button">
                        Editar perfil
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <h2 className="ad-title"> Anuncios publicados</h2>
                <div className="ad-add-container">
                  <button className="ad-add">
                    <Link to="/adAdd" className="ad-add-link">
                      Añadir nuevo anuncio
                    </Link>
                  </button>
                  {ads.length === 0 ? (
                    <p className="text-none-ads">
                      No tienes anuncios publicados aún.
                    </p>
                  ) : (
                    <div className="row row-cards-ads">
                      {ads.map((ad) => {
                        const images = ad.image_ads
                          ? JSON.parse(ad.image_ads)
                          : [];

                        return (
                          <div
                            key={ad.id}
                            className="col-12 col-md-6 col-lg-4 mb-4 col-cards-ads"
                          >
                            <div className="card card-ads h-100">
                              <div className="card-img">
                                {images.length === 0 ? (
                                  <img
                                    className="img-ads"
                                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                                    alt="Imagen del anuncio"
                                  />
                                ) : (
                                  <div
                                    id={`carouselAds${ad.id}`}
                                    className="carousel slide carousel-fade"
                                    data-bs-ride="carousel"
                                    data-bs-interval="5000"
                                  >
                                    <div className="carousel-inner">
                                      {images.map((image, index) => (
                                        <div
                                          key={index}
                                          className={`carousel-item ${
                                            index === 0 ? "active" : ""
                                          }`}
                                        >
                                          <div className="card-img">
                                            <img
                                              src={`${API_URL}/uploads/${image}`}
                                              className="img-ads"
                                              alt={`Imagen ${
                                                index + 1
                                              } del anuncio`}
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    {images.length > 1 && (
                                      <>
                                        <button
                                          className="carousel-control-prev"
                                          type="button"
                                          data-bs-target={`#carouselAds${ad.id}`}
                                          data-bs-slide="prev"
                                        >
                                          <span
                                            className="carousel-control-prev-icon"
                                            aria-hidden="true"
                                          ></span>
                                          <span className="visually-hidden">
                                            Anterior
                                          </span>
                                        </button>

                                        <button
                                          className="carousel-control-next"
                                          type="button"
                                          data-bs-target={`#carouselAds${ad.id}`}
                                          data-bs-slide="next"
                                        >
                                          <span
                                            className="carousel-control-next-icon"
                                            aria-hidden="true"
                                          ></span>
                                          <span className="visually-hidden">
                                            Siguiente
                                          </span>
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="card-body card-body-all-ads">
                                <div className="card-title card-title-ads">
                                  <h4>{ad.title}</h4>
                                </div>
                                <p className="text-ellipsis">
                                  {ad.description}
                                </p>
                              </div>
                              <div className="card-footer card-footer-all-ads ">
                                📧{ad.email} | 📞{ad.number}
                              </div>
                              <button
                                className="edit-ad-button"
                                onClick={() => {
                                  localStorage.setItem("currentAdId", ad.id);
                                  navigate("/EditAd");
                                }}
                              >
                                Editar anuncio
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
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
