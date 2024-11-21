const express = require("express");
const router = express.Router();

const {
  addShow,
  doLiveShow,
  getUnliveShows,
  reserveSeats,
  bookSeats,
} = require("../controllers/Show");
const { auth, isAdmin, isViewer } = require("../middlewares/auth");

module.exports = (io) => {
  router.post("/addShow", auth, isAdmin, addShow);
  router.post("/liveYourShow", auth, isAdmin, doLiveShow);
  router.get("/getUnliveShows", auth, isAdmin, getUnliveShows);
  router.post("/reserveSeats", auth, isViewer, (req, res) =>
    reserveSeats(req, res, io)
  );
  router.post("/bookSeats", auth, isViewer, (req, res) =>
    bookSeats(req, res, io)
  );

  return router;
};



