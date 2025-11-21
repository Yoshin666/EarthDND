import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function ShowAd() {
  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000"
      : "https://earthdnd.onrender.com";
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const adId = localStorage.getItem("currentAdId");

    fetch("http://localhost:3000/ads")
      .then((res) => res.json())
      .then((data) => {
        const anuncioFiltrado = data.find((ad) => ad.id == adId);
        setAd(anuncioFiltrado);
      })
      .catch((err) => console.error("Error al obtener anuncio:", err));
  }, []);

  if (!ad) return <p>Cargando anuncio...</p>;

  let images = [];
  try {
    images = ad.image_ads ? JSON.parse(ad.image_ads) : [];
  } catch {
    images = [];
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
            <Link to="/ads" className="button-back-link">
              Volver
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
            <div className="card card-show-all-ads">
              <div className="card-title card-title-all-ads">
                <h3>{ad.title}</h3>
              </div>
              <div className="card-body card-body-all-ads">
                {images.length > 0 ? (
                  <div
                    id="carouselShowAd"
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
                            src={`http://localhost:3000/uploads/${img}`}
                            className="img-all-show-ads"
                            alt={`Imagen ${index + 1} anuncio ${ad.title}`}
                          />
                        </div>
                      ))}
                    </div>
                    {images.length > 1 && (
                      <>
                        <button
                          className="carousel-control-prev"
                          type="button"
                          data-bs-target="#carouselShowAd"
                          data-bs-slide="prev"
                        >
                          <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                          className="carousel-control-next"
                          type="button"
                          data-bs-target="#carouselShowAd"
                          data-bs-slide="next"
                        >
                          <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    alt="Imagen por defecto"
                    className="img-fluid mb-3"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                  />
                )}
                <p className="description-ad">{ad.description}</p>
              </div>
              <div className="card-footer card-footer-all-ads">
                📧 {ad.email} | 📞 {ad.number}
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
