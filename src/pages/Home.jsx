import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useNavigate } from "react-router-dom";
import { Login } from "./Login";
import { useState, useEffect } from "react";
export default function Home() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    setIsLoggedIn(!!userEmail);
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
          <div className="contenedor-principal">
            {!isLoggedIn && (
              <button className="button-login" onClick={() => setIsLogin(true)}>
                Iniciar sesión
              </button>
            )}

            {isLoggedIn && (
              <>
                <button className="button-back">
                  <Link to="/ads" className="button-back-link">
                    Anuncios
                  </Link>
                </button>
                <button
                  className="button-login"
                  onClick={() => navigate("/profile")}
                >
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
              </>
            )}

            {isLogin && (
              <>
                <div
                  className="overlay"
                  onClick={() => setIsLogin(false)}
                ></div>

                <div className="card-login">
                  <Login onClose={() => setIsLogin(false)} />
                </div>
              </>
            )}
          </div>
        </nav>
        <main>
          <section>
            <img
              className="casaModelo"
              src="https://i.pinimg.com/originals/99/7a/15/997a15406545a08c8cd0c2da195e80a8.jpg"
              alt="casa modelo"
            />
          </section>
          <section>
            <div className="row">
              <div className="col-4">
                <div className="card">
                  <h5 className="card-header">
                    <i className="bi bi-shield-check"></i>
                  </h5>
                  <div className="card-body">
                    <h4 className="card-title ">Flexibilidad</h4>
                    <p className="card-text">
                      Los anuncios con cancelación flexible te permiten
                      modificar o cancelar tu reserva fácilmente si cambias de
                      planes.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card">
                  <h5 className="card-header">
                    <i className="bi bi-house"></i>
                  </h5>
                  <div className="card-body">
                    <h4 className="card-title">Disponibilidad</h4>
                    <p className="card-text">
                      Únete a los más de 1.000 millones de viajeros que han
                      reservado escapadas en más de 220 países y destinos.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card">
                  <h5 className="card-header">
                    <i className="bi bi-filter-circle"></i>
                  </h5>
                  <div className="card-body">
                    <h4 className="card-title">Lo que buscas</h4>
                    <p className="card-text">
                      Selecciona un rango de precios, el número de habitaciones
                      que necesitas y otras comodidades clave para encontrar el
                      alojamiento que mejor se adapte a lo que buscas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="find-your-spot">
            <h2>Encuentra tu tamaño perfecto</h2>
            <div className="row">
              <div className="col-4">
                <a href="/ads" className="img-a">
                  <div className="card" style={{ width: "18rem" }}>
                    <img
                      src="https://th.bing.com/th/id/R.61e705efc28f2b57f80770aee908f704?rik=eVcEjYdVIlGlig&riu=http%3a%2f%2fdecorandocasas.com.br%2fwp-content%2fuploads%2f2014%2f03%2ffachadas-de-casas-bonitas4.jpg&ehk=jlbkMalj08xz%2fXDTwpz48I3jGi2HlfIE52QHtzP4aio%3d&risl=&pid=ImgRaw&r=0"
                      className="card-img-top"
                      alt="casa modelo"
                    />
                    <div className="card-body">
                      <h5 className="card-title">Casas</h5>
                      <p className="card-text">
                        Una casa es ideal para todos los integrantes de la
                        familia
                      </p>
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-4">
                <a href="/ads" className="img-a">
                  <div className="card" style={{ width: "18rem" }}>
                    <img
                      src="https://th.bing.com/th/id/R.ff51953661fa101f38335ba6db803b4e?rik=4ftTcEXGWEDz3g&pid=ImgRaw&r=0"
                      className="card-img-top"
                      alt="Ejemplo"
                    />
                    <div className="card-body">
                      <h5 className="card-title">Apartamentos</h5>
                      <p className="card-text">
                        Un apartamento por si lo que buscas es tu propio espacio
                      </p>
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-4">
                <a href="/ads" className="img-a">
                  <div className="card" style={{ width: "18rem" }}>
                    <img
                      src="https://www.imperagrupo.com/wp-content/uploads/2023/05/habitacion-modelo-a-doble.jpg"
                      className="card-img-top"
                      alt="Ejemplo"
                    />
                    <div className="card-body">
                      <h5 className="card-title">Habitaciones </h5>
                      <p className="card-text">
                        Para conocer gente y relacionarte, esta habitación es lo
                        que buscas
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </section>
          <section className="ask">
            <div className="row">
              <div className="col-6">
                <h2 className="title-solve-problem">Resolvemos tus dudas</h2>
              </div>

              <div className="col-6">
                <div
                  className="accordion accordion-flush"
                  id="accordionFlushExample"
                >
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingOne">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne"
                        aria-expanded="false"
                        aria-controls="flush-collapseOne"
                      >
                        ¿Puedo cancelar o cambiar si he tenido un problema con
                        el viaje?
                      </button>
                    </h2>
                    <div
                      id="flush-collapseOne"
                      className="accordion-collapse collapse"
                      aria-labelledby="flush-headingOne"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div className="accordion-body">
                        En la mayoría de los casos, puedes resolverlos enviando
                        un mensaje directamente al anfitrión. Si no puede
                        ayudarte, ponte en contacto con Airbnb en un plazo de 24
                        horas desde que lo detectes.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingTwo">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseTwo"
                        aria-expanded="false"
                        aria-controls="flush-collapseTwo"
                      >
                        ¿Qué es un DuckDND y cómo funciona?
                      </button>
                    </h2>
                    <div
                      id="flush-collapseTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="flush-headingTwo"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div className="accordion-body">
                        Para que la experiencia resulte sencilla, agradable y
                        segura para los millones de anfitriones y viajeros que
                        hay por todo el mundo, verificamos los perfiles
                        personales y los anuncios.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingThree">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseThree"
                        aria-expanded="false"
                        aria-controls="flush-collapseThree"
                      >
                        ¿Tengo que encontrarme obligatoriamente con el dueño?
                      </button>
                    </h2>
                    <div
                      id="flush-collapseThree"
                      className="accordion-collapse collapse"
                      aria-labelledby="flush-headingThree"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div className="accordion-body">
                        Si reservas un alojamiento entero o con llegada
                        autónoma, puede que únicamente interactúes con el
                        anfitrión por mensaje a través de la aplicación. En
                        cualquier caso, si pasa algo y necesitas escribirle,
                        podrás hacerlo en cualquier momento.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <footer className="footer">
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
