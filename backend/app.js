const express = require("express");
const pool = require("./db/db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(
  cors({
    origin: "https://yoshin666.github.io",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../src/assets/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Servidor Node.js funcionando ✅");
});

/* ----------------- AUTH / SIGNUP / LOGIN ----------------- */
app.post("/signup", async (req, res) => {
  const { name, surname, email, pass } = req.body;
  if (!name || !surname || !email || !pass)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });
      if (results.rows.length > 0)
        return res.status(400).json({ error: "El usuario ya está registrado" });

      const hashedPass = await bcrypt.hash(pass, 10);
      const sql =
        "INSERT INTO users (name, surname, email, password) VALUES ($1, $2, $3, $4)";
      pool.query(sql, [name, surname, email, hashedPass], (err2) => {
        if (err2) {
          console.error("❌ Error al registrar usuario:", err2);
          return res.status(500).json({ error: "Error en el servidor" });
        }
        res.status(200).json({ message: "Usuario registrado con éxito ✅" });
      });
    }
  );
});

app.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  if (!email || !pass)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });
      if (results.rows.length === 0)
        return res.status(404).json({ error: "Usuario no encontrado" });

      const user = results.rows[0];
      const validPassword = await bcrypt.compare(pass, user.password);
      if (!validPassword)
        return res.status(401).json({ error: "Contraseña incorrecta" });

      res.status(200).json({ message: "Inicio de sesión exitoso", user });
    }
  );
});

/* ----------------- PERFIL ----------------- */
app.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, name, surname, email, profile_image FROM users WHERE id=$1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error en /user/:id", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.get("/ads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM ads WHERE user_id=$1", [id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error en /ads/:id", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Subir imagen de perfil
app.post("/upload-profile", upload.single("imagen"), (req, res) => {
  console.log("Entró en /upload-profile");
  const userId = req.body.userId;

  if (!userId) return res.status(400).json({ error: "Falta userId" });
  if (!req.file)
    return res
      .status(400)
      .json({ error: "Falta archivo 'imagen' en la petición" });

  pool.query(
    "SELECT profile_image FROM users WHERE id = $1",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error al obtener imagen antigua:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }

      const oldImage = results.rows[0]?.profile_image;

      if (oldImage) {
        const oldImagePath = path.join(process.cwd(), "uploads", oldImage);
        fs.unlink(oldImagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.log("No se pudo eliminar imagen antigua:", unlinkErr);
          } else {
            console.log("Imagen antigua eliminada:", oldImage);
          }
        });
      }

      const imagePath = req.file.filename;
      pool.query(
        "UPDATE users SET profile_image = $1 WHERE id = $2",
        [imagePath, userId],
        (err2) => {
          if (err2) {
            console.error("Error al actualizar profile_image:", err2);
            return res.status(500).json({ error: "Error al guardar imagen" });
          }
          const imageUrl = `/uploads/${imagePath}`;
          res.json({ success: true, file: imagePath, url: imageUrl });
        }
      );
    }
  );
});

/* ----------------- ANUNCIOS ----------------- */

app.post("/adAdd", upload.array("images", 6), (req, res) => {
  console.log(
    "Solicitud recibida en /adAdd (multipart con múltiples imágenes)"
  );
  const { title, description, email, tel, user_id } = req.body;

  if (!title || !description || !email || !tel || !user_id) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const files = req.files || [];
  const filenames = files.map((f) => f.filename);
  const imageAdsValue = filenames.length > 0 ? JSON.stringify(filenames) : null;

  const sql =
    "INSERT INTO ads (title, description, email, number, user_id, image_ads) VALUES ($1, $2, $3, $4, $5, $6)";
  pool.query(
    sql,
    [title, description, email, tel, user_id, imageAdsValue],
    (err) => {
      if (err) {
        console.error("❌ Error al añadir anuncio (adAdd):", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }
      const urls = filenames.map((f) => `/uploads/${f}`);
      res.status(200).json({
        message: "Anuncio añadido con éxito ✅",
        files: filenames,
        urls,
      });
    }
  );
});

/* --- EDITAR PERFIL --- */
app.post("/edit-profile", async (req, res) => {
  const { id, name, surname, email, pass } = req.body;
  console.log("Datos recibidos");
  if (!id || !name || !surname || !email) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });
      if (results.rows.length === 0)
        return res.status(404).json({ error: "Usuario no encontrado" });
      if (pass && pass.trim() !== "") {
        const hashedPass = await bcrypt.hash(pass, 10);
        const query =
          "UPDATE users SET name=$1, surname=$2, email=$3, password=$4 WHERE id=$5";
        pool.query(query, [name, surname, email, hashedPass, id], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({
            message: "Perfil actualizado correctamente (con nueva contraseña)",
          });
        });
      } else {
        const query =
          "UPDATE users SET name=$1, surname=$2, email=$3 WHERE id=$4";
        pool.query(query, [name, surname, email, id], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({
            message:
              "Perfil actualizado correctamente (sin cambiar la contraseña)",
          });
        });
      }
    }
  );
});

/*--- MOSTRAR TODOS LOS ANUNCIOS ---*/
app.get("/ads", (req, res) => {
  pool.query("SELECT * FROM ads", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.status(200).json(results.rows);
  });
});

/* --- EDITAR ANUNCIOS --- */
app.get("/ad/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM ads WHERE id = $1", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    res.status(200).json(results.rows);
  });
});

app.post("/edit-Ad", upload.array("images"), (req, res) => {
  const { title, description, email, tel, ad_id } = req.body;

  if (!title || !description || !email || !tel || !ad_id) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  pool.query(
    "SELECT image_ads FROM ads WHERE id = $1",
    [ad_id],
    (err, results) => {
      if (err) {
        console.error("Error al obtener imágenes antiguas:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }

      let oldImages = [];
      if (results.rows.length > 0 && results.rows[0].image_ads) {
        try {
          oldImages = JSON.parse(results.rows[0].image_ads);
        } catch {
          oldImages = [];
        }
      }

      const newImages = req.files.map((file) => file.filename);
      const updatedImages = [...oldImages, ...newImages];

      const sql =
        "UPDATE ads SET title=$1, description=$2, email=$3, number=$4, image_ads=$5 WHERE id=$6";
      pool.query(
        sql,
        [title, description, email, tel, JSON.stringify(updatedImages), ad_id],
        (err) => {
          if (err) {
            console.error("❌ Error al actualizar anuncio:", err);
            return res.status(500).json({ error: "Error en el servidor" });
          }
          res.status(200).json({ message: "Anuncio actualizado con éxito ✅" });
        }
      );
    }
  );
});

/*--- ELIMINAR ANUNCIO ---*/
app.delete("/ad/:id", (req, res) => {
  const { id } = req.params;

  pool.query("SELECT image_ads FROM ads WHERE id = $1", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Anuncio no encontrado" });

    let images = [];
    if (result.rows[0].image_ads) {
      try {
        images = JSON.parse(result.rows[0].image_ads);
      } catch (e) {
        console.error("Error al parsear image_ads:", e);
        images = [];
      }
    }

    images.forEach((image) => {
      const imagePath = path.join(process.cwd(), "uploads", image.trim());
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.log(`No se pudo eliminar la imagen: ${imagePath}`);
        } else {
          console.log(`Imagen eliminada: ${imagePath}`);
        }
      });
    });

    pool.query("DELETE FROM ads WHERE id = $1", [id], (err, result2) => {
      if (err)
        return res.status(500).json({ error: "Error al eliminar anuncio" });
      if (result2.rowCount === 0)
        return res.status(404).json({ error: "Anuncio no encontrado" });
      res
        .status(200)
        .json({ message: "Anuncio y sus imágenes eliminados con éxito" });
    });
  });
});

app.post("/delete-image", (req, res) => {
  const { ad_id, image } = req.body;

  if (!ad_id || !image) {
    return res.status(400).json({ error: "Faltan parámetros (ad_id o image)" });
  }

  pool.query(
    "SELECT image_ads FROM ads WHERE id = $1",
    [ad_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });
      if (result.rows.length === 0)
        return res.status(404).json({ error: "Anuncio no encontrado" });

      let images = [];
      if (result.rows[0].image_ads) {
        try {
          images = JSON.parse(result.rows[0].image_ads);
        } catch (e) {
          console.error("Error al parsear image_ads:", e);
          images = [];
        }
      }

      const updatedImages = images.filter((img) => img !== image);

      pool.query(
        "UPDATE ads SET image_ads = $1 WHERE id = $2",
        [JSON.stringify(updatedImages), ad_id],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Error al actualizar anuncio" });

          const imagePath = path.join(process.cwd(), "uploads", image.trim());
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.log(`No se pudo eliminar la imagen: ${imagePath}`);
            } else {
              console.log(`Imagen eliminada: ${imagePath}`);
            }
          });

          res.status(200).json({
            message: "Imagen eliminada con éxito",
            remainingImages: updatedImages,
          });
        }
      );
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
