// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  addCity
} = require("../controllers/City")


const {addCinema,updateScreen} = require("../controllers/Cinema");
const { auth,isAdmin,isViewer } = require("../middlewares/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/addCity",auth,isAdmin,addCity);

router.post("/addCinema",auth,isAdmin,addCinema);

router.post("/updateScreen",auth,isAdmin,updateScreen);

module.exports = router;