import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function Ads() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/ads`)
      .then((res) => res.json())
      .then((data) => setAds(data))
      .catch((err) => console.error("Error al obtener anuncios:", err));
  }, []);

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
          <button className="button-login" onClick={() => navigate("/profile")}>
            Mi Perfil
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
        <main className="main-ads">
          <section className="all-ads-asection">
            {ads.length === 0 ? (
              <p className="text-none-ads">
                No tienes anuncios publicados aún.
              </p>
            ) : (
              <div className="row row-all-ads">
                {ads.map((ad) => {
                  let images = [];
                  try {
                    images = ad.image_ads ? JSON.parse(ad.image_ads) : [];
                  } catch {
                    images = [];
                  }

                  return (
                    <div
                      className="col-12 col-md-6 col-lg-4 columna"
                      key={ad.id}
                    >
                      <div
                        className="card card-all-ads"
                        onClick={() => {
                          localStorage.setItem("currentAdId", ad.id);
                          navigate("/showAd");
                        }}
                      >
                        <div className="card-title card-title-all-ads">
                          <h3>{ad.title}</h3>
                        </div>

                        <div className="card-body card-body-all-ads">
                          {images.length > 0 ? (
                            <div
                              id={`carouselAd${ad.id}`}
                              className="carousel slide mb-3"
                              data-bs-ride="carousel"
                            >
                              <div className="carousel-inner">
                                {images.map((img, index) => (
                                  <div
                                    className={`carousel-item ${
                                      index === 0 ? "active" : ""
                                    }`}
                                    key={index}
                                  >
                                    <img
                                      src={`${API_URL}/uploads/${img}`}
                                      className="img-all-ads"
                                      alt={`Imagen ${index + 1} anuncio ${
                                        ad.title
                                      }`}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                              alt="Imagen por defecto"
                              className="img-all-ads"
                              style={{ maxHeight: "200px", objectFit: "cover" }}
                            />
                          )}
                          <p className="text-ellipsis">{ad.description}</p>
                        </div>
                        <div className="card-footer card-footer-all-ads">
                          📧 {ad.email} | 📞 {ad.number}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
