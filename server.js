const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
// const cors = require("cors");
const dbConnect = require("./config/database");
const PORT = process.env.PORT || 5000;

// importing routes
const userRoutes = require("./routes/userRoute");

dbConnect();

// middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
// app.use(cors());

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
