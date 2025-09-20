const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
const ExpressError = require("../ExpressError/express-error");
const wrapAsync = require("../utils/wrapAsync");

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    try {
      let chats = await Chat.find();
      if (!chats) {
        throw new ExpressError(404, "Chats not found");
      }
      res.render("index.ejs", { chats });
    } catch (err) {
      next(err);
    }
  })
);

// NEW FORM Route
router.get("/new", (req, res) => {
  res.render("new.ejs");
});

// SHOW Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
      throw new ExpressError(404, "Chat not found");
    }
    res.render("show.ejs", chat);
  })
);

// CREATE Route
router.post("", (req, res) => {
  let { from, message, to } = req.body;
  let chat = new Chat({
    from,
    message,
    to,
    date: new Date(),
  });
  chat.save();
  res.redirect("/chats");
});

// EDIT Route
router.get("/:id/edit", async (req, res) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  res.render("edit", { chat });
});

// UPDATE Route
router.patch("/:id", async (req, res) => {
  let { id } = req.params;
  let { message } = req.body;
  await Chat.findByIdAndUpdate(id, { message }, { new: true });
  res.redirect("/chats");
});

// DELETE Route
router.delete("/:id", async (req, res) => {
  let { id } = req.params;
  await Chat.findByIdAndDelete(id);
  res.redirect("/chats");
});

// 404 handler
router.all("*", (req, res, next) => {
  console.log("404 handler");
  next(new ExpressError(404, "Page Not Found"));
});

module.exports = router;
