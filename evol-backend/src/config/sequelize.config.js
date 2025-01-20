require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'todo_db',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
    },
    test: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'todo_db',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
    },
    production: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'todo_db',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
    },
};
