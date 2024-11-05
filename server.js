const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnect = require("./config/database");
// const { upload, imageUploadUtil } = require("./helpers/cloudinary");

const authRouter = require("./routes/auth/auth-routes");

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
dbConnect();

// middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// // Add route to handle image upload using Cloudinary
// app.post("/api/upload", upload.single("file"), async (req, res) => {
//   try {
//     const result = await imageUploadUtil(req.file);
//     res.json({ message: "Upload successful", url: result.secure_url });
//   } catch (error) {
//     res.status(500).json({ error: "Upload failed", details: error.message });
//   }
// });

// route handlers
app.use("/api/auth", authRouter);

// start server
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));

// default route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Your server is up and running....",
  });
});
