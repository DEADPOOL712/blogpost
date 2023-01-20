//==== Node Modules =====//
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const _ = require("lodash");
const mongoose = require("mongoose");
// prettier-ignore
const url = "mongodb+srv://Admin-Vaibhav:vaibhav712@cluster0.o7loowq.mongodb.net/BlogPost?retryWrites=true&w=majority";

//===== connectiong to the database =====//
mongoose.set("strictQuery", false);
mongoose.connect(url, {
  useNewUrlParser: true,
});
//===== schema of data set or collection
const postSchema = new mongoose.Schema({
  title: String,
  text: String,
  date: String,
});
//===== creating model using schema ====//
const postcollection = mongoose.model("postcollection", postSchema);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//======== handaling get request from browser || Home page ==========//
app.get("/", (req, res) => {
  postcollection.find((e, data) => {
    if (data.length === 0) {
      res.render("about");
    } else {
      res.render("home", { posts: data });
    }
  });
});
//======== Contact page ==========//
app.get("/contact", (req, res) => {
  res.render("contact");
});

//======== about page ==========//
app.get("/about", (req, res) => {
  res.render("about");
});

// ======== compose page ======= //
app.get("/compose", (req, res) => {
  res.render("compose");
});

// ======== saving post data into database ======= //
app.post("/compose", (req, res) => {
  var options = {
    // weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  var today = new Date();
  var formatedDate = today.toLocaleDateString("en-US", options);
  const newPost = new postcollection({
    title: req.body.Heading,
    text: req.body.Body,
    date: formatedDate,
  });
  newPost.save((e) => {
    if (e) {
      console.info(e);
    } else {
      console.log("Save into dataBase !!");
      res.redirect("/");
    }
  });
});

//===== creating dynamic page ====//
app.get("/posts/:postName/", function (req, res) {
  const requestedId = req.params.postName;
  console.log(requestedId);
  postcollection.findOne({ _id: requestedId }, function (err, post) {
    console.log(post);
    // console.log(__dirname);
    res.render("open", { title: post.title, text: post.text, date: post.date });
  });
});

//======== starting the server ==========//
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port 3000");
});
