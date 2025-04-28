const express = require("express");
const { sequelize } = require("./models");
const authRoutes = require("./roustes/authRoutes");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

module.exports = app;
