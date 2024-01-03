// db/index.js

const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const config = require('../config');

const sequelize = new Sequelize(config.development);

const db = {};

fs.readdirSync(path.join(__dirname, '../models'))
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => {
        const model = require(path.join(__dirname, '../models', file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
