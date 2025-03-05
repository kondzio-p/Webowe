const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Note = sequelize.define("Note", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
  imagePath: {
    type: DataTypes.STRING,
  },
});

module.exports = Note;
