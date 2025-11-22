const pool = require("./db/db");

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        surname VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL      
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        email VARCHAR(100) NOT NULL,
        number VARCHAR(20),
        user_id INT REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log("✅ Tablas creadas correctamente");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creando tablas:", err);
    process.exit(1);
  }
}

createTables();
