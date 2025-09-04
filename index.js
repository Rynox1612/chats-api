const express = require("express");
const app = express();
exports.app = app;
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError/express-error");

//Error handling wrapper function
function wrapAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
}

main()
  .then(() => {
    console.log("Connection sucessful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.listen("8080", () => {
  console.log("Server is listening on port 8080");
});

app.get("/chats", async (req, res) => {
  try {
    let chats = await Chat.find();
    if (!chats) {
      throw new ExpressError(404, "Chats not found");
    }
    res.render("index.ejs", { chats });
  } catch (err) {
    next(err);
  }
});

app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

app.get(
  "/chats/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
      throw new ExpressError(404, "Chat not found");
    }
    res.render("show.ejs", chat);
  })
);

app.post("/chats", (req, res) => {
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

app.get("/chats/:id/edit", async (req, res) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  res.render("edit", { chat });
});

app.patch("/chats/:id", async (req, res) => {
  let { id } = req.params;
  let { message } = req.body;
  await Chat.findByIdAndUpdate(id, { message }, { new: true });
  res.redirect("/chats");
});

app.delete("/chats/:id", async (req, res) => {
  let { id } = req.params;
  await Chat.findByIdAndDelete(id);
  res.redirect("/chats");
});

app.use((err, req, res, next) => {
  console.log(err.name);
  next(err);
});

app.use((err, req, res, next) => {
  err.status = 500;
  err.message = "Something went wrong";
  res.status(err.status).send(err.message);
});
