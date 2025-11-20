const express = require("express");
const pool = require("./db/db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

/* --- LOGS --- */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/* --- ASEGURAR CARPETA UPLOADS (RENDER) --- */
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

/* --- STATIC --- */
app.use("/uploads", express.static(uploadsPath));

app.use(express.json());
app.use(
  cors({
    origin: "https://yoshin666.github.io",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* --- MULTER --- */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* --- ROOT --- */
app.get("/", (req, res) => {
  res.send("Servidor Node.js funcionando ✅");
});

/* ----------------- AUTH: SIGNUP ----------------- */
app.post("/signup", async (req, res) => {
  const { name, surname, email, pass } = req.body;

  if (!name || !surname || !email || !pass)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });

      if (results.length > 0)
        return res.status(400).json({ error: "El usuario ya está registrado" });

      const hashedPass = await bcrypt.hash(pass, 10);

      const sql =
        "INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)";
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

/* ----------------- AUTH: LOGIN ----------------- */
app.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });

      if (results.length === 0)
        return res.status(404).json({ error: "Usuario no encontrado" });

      const user = results[0];
      const validPassword = await bcrypt.compare(pass, user.password);

      if (!validPassword)
        return res.status(401).json({ error: "Contraseña incorrecta" });

      res.status(200).json({ message: "Inicio de sesión exitoso", user });
    }
  );
});

/* ----------------- PERFIL ----------------- */
app.get("/user/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT id, name, surname, email, profile_image FROM users WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });

      if (results.length === 0)
        return res.status(404).json({ error: "Usuario no encontrado" });

      res.status(200).json(results[0]);
    }
  );
});

/* --- SUBIR IMAGEN DE PERFIL --- */
app.post("/upload-profile", upload.single("imagen"), (req, res) => {
  const userId = req.body.userId;

  if (!userId) return res.status(400).json({ error: "Falta userId" });
  if (!req.file)
    return res.status(400).json({ error: "Falta archivo 'imagen'" });

  pool.query(
    "SELECT profile_image FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });

      const oldImage = results[0]?.profile_image;

      if (oldImage) {
        const imgPath = path.join(uploadsPath, oldImage);
        fs.unlink(imgPath, () => {});
      }

      const newImage = req.file.filename;

      pool.query(
        "UPDATE users SET profile_image = ? WHERE id = ?",
        [newImage, userId],
        (err2) => {
          if (err2)
            return res.status(500).json({ error: "Error al guardar imagen" });

          res.json({
            success: true,
            file: newImage,
            url: `/uploads/${newImage}`,
          });
        }
      );
    }
  );
});

/* ----------------- OBTENER ANUNCIOS DE UN USUARIO ----------------- */
app.get("/ads/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT id, title, description, email, number, image_ads FROM ads WHERE user_id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("❌ Error al obtener anuncios:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }

      res.status(200).json(results);
    }
  );
});

/* ----------------- AGREGAR ANUNCIO ----------------- */
app.post("/adAdd", upload.array("images", 6), (req, res) => {
  const { title, description, email, tel, user_id } = req.body;

  if (!title || !description || !email || !tel || !user_id)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  const files = req.files || [];
  const filenames = files.map((f) => f.filename);

  const imageAdsValue = filenames.length > 0 ? JSON.stringify(filenames) : null;

  const sql =
    "INSERT INTO ads (title, description, email, number, user_id, image_ads) VALUES (?, ?, ?, ?, ?, ?)";

  pool.query(
    sql,
    [title, description, email, tel, user_id, imageAdsValue],
    (err) => {
      if (err) {
        console.error("❌ Error al añadir anuncio:", err);
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

  if (!id || !name || !surname || !email)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  pool.query("SELECT * FROM users WHERE id = ?", [id], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });

    if (results.length === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });

    if (pass && pass.trim() !== "") {
      const hashedPass = await bcrypt.hash(pass, 10);
      pool.query(
        "UPDATE users SET name=?, surname=?, email=?, password=? WHERE id=?",
        [name, surname, email, hashedPass, id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({
            message: "Perfil actualizado correctamente (con nueva contraseña)",
          });
        }
      );
    } else {
      pool.query(
        "UPDATE users SET name=?, surname=?, email=? WHERE id=?",
        [name, surname, email, id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({
            message:
              "Perfil actualizado correctamente (sin cambiar la contraseña)",
          });
        }
      );
    }
  });
});

/* --- OBTENER TODOS LOS ANUNCIOS --- */
app.get("/ads", (req, res) => {
  pool.query("SELECT * FROM ads", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    res.status(200).json(results);
  });
});

/* --- OBTENER UN ANUNCIO POR ID --- */
app.get("/ad/:id", (req, res) => {
  const { id } = req.params;

  pool.query("SELECT * FROM ads WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    res.status(200).json(results);
  });
});

/* --- EDITAR ANUNCIO --- */
app.post("/edit-Ad", upload.array("images"), (req, res) => {
  const { title, description, email, tel, ad_id } = req.body;

  if (!title || !description || !email || !tel || !ad_id)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  pool.query(
    "SELECT image_ads FROM ads WHERE id = ?",
    [ad_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });

      let oldImages = [];

      if (results.length > 0 && results[0].image_ads) {
        try {
          oldImages = JSON.parse(results[0].image_ads);
        } catch {}
      }

      const newImages = req.files.map((file) => file.filename);

      const updatedImages = [...oldImages, ...newImages];

      const sql =
        "UPDATE ads SET title=?, description=?, email=?, number=?, image_ads=? WHERE id=?";

      pool.query(
        sql,
        [title, description, email, tel, JSON.stringify(updatedImages), ad_id],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Error al actualizar anuncio" });

          res.status(200).json({ message: "Anuncio actualizado con éxito ✅" });
        }
      );
    }
  );
});

/* --- ELIMINAR UN ANUNCIO --- */
app.delete("/ad/:id", (req, res) => {
  const { id } = req.params;

  pool.query("SELECT image_ads FROM ads WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });

    if (result.length === 0)
      return res.status(404).json({ error: "Anuncio no encontrado" });

    let images = [];

    if (result[0].image_ads) {
      try {
        images = JSON.parse(result[0].image_ads);
      } catch {}
    }

    images.forEach((img) => {
      const imgPath = path.join(uploadsPath, img.trim());
      fs.unlink(imgPath, () => {});
    });

    pool.query("DELETE FROM ads WHERE id = ?", [id], (err2, result2) => {
      if (err2)
        return res.status(500).json({ error: "Error al eliminar anuncio" });

      if (result2.affectedRows === 0)
        return res.status(404).json({ error: "Anuncio no encontrado" });

      res.status(200).json({
        message: "Anuncio y sus imágenes eliminados con éxito",
      });
    });
  });
});

/* --- ELIMINAR IMAGEN INDIVIDUAL DEL ANUNCIO --- */
app.post("/delete-image", (req, res) => {
  const { ad_id, image } = req.body;

  if (!ad_id || !image)
    return res.status(400).json({ error: "Faltan parámetros" });

  pool.query(
    "SELECT image_ads FROM ads WHERE id = ?",
    [ad_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });

      if (result.length === 0)
        return res.status(404).json({ error: "Anuncio no encontrado" });

      let images = [];

      if (result[0].image_ads) {
        try {
          images = JSON.parse(result[0].image_ads);
        } catch {}
      }

      const updatedImages = images.filter((img) => img !== image);

      pool.query(
        "UPDATE ads SET image_ads = ? WHERE id = ?",
        [JSON.stringify(updatedImages), ad_id],
        (err2) => {
          if (err2)
            return res
              .status(500)
              .json({ error: "Error al actualizar anuncio" });

          const imgPath = path.join(uploadsPath, image.trim());
          fs.unlink(imgPath, () => {});

          res.status(200).json({
            message: "Imagen eliminada con éxito",
            remainingImages: updatedImages,
          });
        }
      );
    }
  );
});

/* --- PUERTO --- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Node.js funcionando en puerto ${PORT}`);
});
