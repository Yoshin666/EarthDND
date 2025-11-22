const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false, // Render requiere SSL
  },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Error al conectar a PostgreSQL:", err.stack);
  } else {
    console.log("✅ Conectado a la base de datos PostgreSQL en Render");
    release();
  }
});

module.exports = pool;
