import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import sequelize from "./config/db.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connected");
    
    if (process.env.NODE_ENV !== "test") {
      await sequelize.sync({ alter: true });
      logger.info("Models synced");
    }

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, "Unable to start server");
    process.exit(1);
  }
};

startServer();
