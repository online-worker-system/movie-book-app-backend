const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const dbConnect = require("./config/database");
const PORT = process.env.PORT || 5000;

// importing routes
const userRoutes = require("./routes/userRoute");
const cinemaRoutes = require("./routes/CinemaRoute");

dbConnect();

// middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// route handlers
app.use("/api/v1/auth", userRoutes);

// start server
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));

// default route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Your server is up and running....",
  });
});
