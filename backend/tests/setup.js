// backend/tests/setup.js
import { sequelize } from "../src/server.js";
import dotenv from "dotenv";

// Load test environment
dotenv.config({ path: ".env.test" });

before(async () => {
  console.log("Syncing test database...");
  await sequelize.sync({ force: true }); // reset tables before tests
});

after(async () => {
  console.log("Closing DB connection...");
  await sequelize.close();
});
