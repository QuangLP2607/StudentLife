const express = require("express");
const { sequelize } = require("./models");
const authRoutes = require("./roustes/authRoutes");
const semesterRoutes = require("./roustes/semesterRoutes");
const courseRoutes = require("./roustes/courseRoutes");
const scheduleRoutes = require("./roustes/scheduleRoutes");
const postRoutes = require("./roustes/postRoutes");
const noteRoutes = require("./roustes/noteRoutes");
const uploadRoutes = require("./roustes/uploadRoutes"); // đúng đường dẫn nhé

const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/upload", uploadRoutes);

module.exports = app;
