require('dotenv').config(); // Load environment variables from .env file
// import { config } from 'dotenv';

module.exports = {
  development: {
    username: process.env.DB_USER || "bookclub_user",
    password: process.env.DB_PASSWORD || "secretpassword",
    database: process.env.DB_NAME || "bookclub",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
  },
  production: {
    username: process.env.DB_USER || "bookclub_user",
    password: process.env.DB_PASSWORD || "secretpassword",
    database: process.env.DB_NAME || "bookclub",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
  },
};
