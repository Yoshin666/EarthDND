require("dotenv").config();
const { Pool } = require("pg");

const isRemote = (process.env.PGHOST || "").includes("render.com");

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PG_DATABASE,
  ssl: isRemote ? { rejectUnauthorized: false } : false,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Error al conectar a PostgreSQL:", err.stack);
  } else {
    console.log("✅ Conectado a la base de datos PostgreSQL");
    release();
  }
});

module.exports = pool;
