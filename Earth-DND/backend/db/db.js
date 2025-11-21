const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT || 3306,
});

connection.connect((err) => {
  if (err) {
    console.log("error al conectar la base de datos", err);
    return;
  } else {
    console.log("conectado a la base de datos en Railway");
  }
});

module.exports = connection;
