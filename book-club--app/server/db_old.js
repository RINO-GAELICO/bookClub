import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// If you're running locally and need to load the .env file, this is where dotenv comes in.
dotenv.config(); // This line ensures that .env file variables are loaded into process.env

// Database connection configuration
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost', // Defaults to localhost if DB_HOST is not set
  port: process.env.DB_PORT || 5432,        // Defaults to 5432 if DB_PORT is not set
  username: process.env.DB_USER || 'bookclub_user', // Defaults to bookclub_user if DB_USER is not set
  password: process.env.DB_PASSWORD || 'secretpassword', // Default password if DB_PASSWORD is not set
  database: process.env.DB_NAME || 'bookclub', // Default database name if DB_NAME is not set
  dialect: 'postgres', // Use PostgreSQL dialect
  logging: false,       // Disable logging of SQL queries (set to true for debugging)
});

// Test the connection to ensure it's working
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

// Call the testConnection function to ensure the connection works
testConnection();

export { sequelize };
