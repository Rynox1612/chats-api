const express = require("express");
const app = express();
exports.app = app;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError/express-error");
const session = require("express-session");

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
app.use(express.json());
app.use(express.json({ type: "application/vnd.api+json" }));

app.use(
  session({
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/chats", require("./routes/chats"));

app.get("/reqcount", (req, res) => {
  if (req.session.count) {
    req.session.count += 1;
  } else {
    req.session.count = 1;
  }
  res.send(`You have visited this site ${req.session.count} times`);
});

app.use((err, req, res, next) => {
  console.log(err);
  next(err);
});

app.use((err, req, res, next) => {
  err.status = 500;
  err.message = "Something went wrong";
  res.status(err.status).send(err.message);
});

app.listen("8080", () => {
  console.log("Server is listening on port 8080");
});
