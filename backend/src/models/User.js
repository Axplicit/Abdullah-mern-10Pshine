import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // ✅ OTP fields
  resetOtp: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  resetOtpExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export default User;
