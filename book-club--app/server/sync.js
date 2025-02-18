// sync.js
import { sequelize } from "./db.js";

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // Don't reset the tables
    console.log("✅ Database synced!");
  } catch (error) {
    console.error("❌ Database sync failed:", error);
  }
};

syncDatabase();
export { syncDatabase };