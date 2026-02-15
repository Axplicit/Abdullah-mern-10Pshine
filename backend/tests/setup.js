import { sequelize } from "../src/server.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

before(async () => {
  await sequelize.sync({ force: true }); // reset DB before tests
});

after(async () => {
  await sequelize.close();
});
