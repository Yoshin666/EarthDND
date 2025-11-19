const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "duck",
});

connection.connect((err) => {
  //los () exteriores hace que sea una expresión, no una declaración
  if (err) {
    console.log("error al conectar la base de datos", err);
    return;
  } else {
    console.log("conectado");
  }
});

module.exports = connection;
