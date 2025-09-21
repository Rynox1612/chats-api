const express = require("express");
const router = express.Router();

router.get("/register", (req, res) => {
  let { user = "Anonymyous" } = req.query;
  req.session.user = user;
  res.redirect("/users/hello");
});

router.get("/hello", (req, res) => {
  let { user } = req.session.user;
  res.send(`Hello ${user}`);
});

module.exports = router;
