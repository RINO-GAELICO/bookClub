import { Sequelize } from "sequelize";

// Database connection configuration
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost', // Use 'localhost' or Docker service name
  port: process.env.DB_PORT || 5432, // Default PostgreSQL port
  username: process.env.DB_USER || 'bookclub_user',
  password: process.env.DB_PASSWORD || 'secretpassword',
  database: process.env.DB_NAME || 'bookclub',
  dialect: 'postgres',
  logging: false, // Set to true if you want to see SQL queries in the console
});

// Test the connection
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
