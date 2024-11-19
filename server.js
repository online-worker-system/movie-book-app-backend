const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const dbConnect = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const PORT = process.env.PORT || 5000;

// importing routes
const userRoutes = require("./routes/userRoute");
const cinemaRoutes = require("./routes/cinemaRoute");
const movieRoutes = require("./routes/movieRoute");
const showRoutes = require("./routes/ShowRoutes");
const paymentRoutes = require("./routes/paymentRoute");

// middleware setup
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// connections
dbConnect();
cloudinaryConnect();

// route handlers
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/cinema", cinemaRoutes);
app.use("/api/v1/movie", movieRoutes);
app.use("/api/v1/show", showRoutes);
app.use("/api/v1/payment", paymentRoutes);

// start server
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));

// default route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Your server is up and running....",
  });
});
