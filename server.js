const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./config/database");
const PORT = process.env.PORT || 5000;

// importing routes
const userRoutes = require("./routes/userRoute");
const cinemaRoutes = require("./routes/cinemaRoute");
const movieRoutes = require("./routes/movieRoute");

dbConnect();

// middleware setup
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// route handlers
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/cinema", cinemaRoutes);
app.use("/api/v1/movie", movieRoutes);

// start server
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));

// default route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Your server is up and running....",
  });
});
