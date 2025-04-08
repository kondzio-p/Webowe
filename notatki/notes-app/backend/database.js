const { Sequelize } = require("sequelize");
const path = require("path");

// Konfiguracja połączenia z bazą SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "notes-database.sqlite"),
});

module.exports = sequelize;
