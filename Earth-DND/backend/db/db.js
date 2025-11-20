const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false }, // Render requiere SSL
});

pool
  .connect()
  .then(() => console.log("Conexión a PostgreSQL exitosa"))
  .catch((err) => console.error("Error al conectar a PostgreSQL:", err));

module.exports = pool;
