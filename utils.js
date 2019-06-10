const Sequelize = require('sequelize');

const config = require('./config');

const sequelize = new Sequelize(config.sql.db, config.sql.userName, config.sql.password, {
    host: config.sql.host,
    dialect: 'mysql',

    pool: {
        max: process.env.MYSQL_MAX_CON,
        min: process.env.MYSQL_MIN_CON,
        acquire: process.env.MYSQL_ACQUIRE,
        idle: process.env.MYSQL_IDLE
    },
    operatorsAliases: false,
    define: {
        timestamps: false
    }
});

module.exports = {
    sequelize: sequelize
};