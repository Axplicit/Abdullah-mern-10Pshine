import { sequelize } from "../src/server.js";

before(async () => {
  await sequelize.sync({ force: true }); // reset DB before tests
});

after(async () => {
  await sequelize.close();
});
