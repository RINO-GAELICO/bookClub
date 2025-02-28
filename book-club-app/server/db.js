import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Ensure that DATABASE_URL_POSTGRES is correctly set
const databaseUrl = process.env.DATABASE_URL_POSTGRES;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL_POSTGRES is not defined. Check your .env file.");
  process.exit(1); // Exit the app if DB URL is missing
}

// Create a new Sequelize instance using the connection string
const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true, // Required for Xata
      rejectUnauthorized: false, // Allows self-signed certificates
    },
  },
  logging: false, // Set to true for debugging SQL queries
});

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully to Xata!");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1); // Exit the app on DB connection failure
  }
};

testConnection();

export { sequelize };
