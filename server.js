const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const dbConnect = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const PORT = process.env.PORT || 5000;

const http = require("http");
const { Server } = require("socket.io");

// middleware setup
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies or headers like Authorization
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies or headers like Authorization
  },
  transports: ["websocket", "polling"], // Try WebSocket first, then fallback to polling
});

// connections
dbConnect();
cloudinaryConnect();

// importing routes
const userRoutes = require("./routes/userRoute");
const cinemaRoutes = require("./routes/cinemaRoute");
const movieRoutes = require("./routes/movieRoute");
const showRoutes = require("./routes/showRoute")(io);
const paymentRoutes = require("./routes/paymentRoute")(io);
const bookingRoutes = require("./routes/bookingRoute");

// route handlers
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/cinema", cinemaRoutes);
app.use("/api/v1/movie", movieRoutes);
app.use("/api/v1/show", showRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/booking", bookingRoutes);

// default route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Your server is up and running....",
  });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// start server
server.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
