import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS profile_image TEXT;
    `);

    await pool.query(`
      ALTER TABLE ads
      ADD COLUMN IF NOT EXISTS image_ads TEXT;
    `);

    console.log("✅ Migración completada");
  } catch (err) {
    console.error("❌ Error en migración:", err);
  } finally {
    pool.end();
  }
}

migrate();
