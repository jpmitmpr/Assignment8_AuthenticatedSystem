// database/setup.js
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_NAME;

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, dbFile),
  logging: false,
});

// USER MODEL
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
});

// PROJECT MODEL
const Project = sequelize.define('Project', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false }
});

// TASK MODEL
const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  projectId: { type: DataTypes.INTEGER, allowNull: false }
});

// RELATIONSHIPS
User.hasMany(Project, { foreignKey: 'userId' });
Project.belongsTo(User, { foreignKey: 'userId' });

Project.hasMany(Task, { foreignKey: 'projectId' });
Task.belongsTo(Project, { foreignKey: 'projectId' });

module.exports = {
  sequelize,
  User,
  Project,
  Task
};
