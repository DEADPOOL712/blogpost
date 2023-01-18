//======= starting content ===========//
const homePage = [
  {
    title: "Example",
    text: " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor at cupiditate fugit consequuntur necessitatibus officiis voluptate voluptatem quibusdam. In rem voluptas quo, repellendus illum corrupti voluptatibus incidunt! Molestias dolor ad deserunt rerum accusantium animi. Quasi dolore eius labore atque minima laboriosam expedita vero magnam unde fuga doloremque, assumenda esse illo.",
  },
];
const aboutPage =
  " Welcome to ReadingRealm, a community for book enthusiasts and bloggers to share their thoughts and reviews on the latest reads. Our platform is dedicated to fostering a love of literature and encouraging the exchange of ideas among readers. Whether you're a seasoned blogger or just starting out, we invite you to join our community and share your passion for books with others. From gripping fiction to thought-provoking non-fiction, there's something for everyone on ReadingRealm. Start exploring today and discover a world of books waiting to be read. Happy blogging! ";

const contactPage =
  " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor at cupiditate fugit consequuntur necessitatibus officiis voluptate voluptatem quibusdam. In rem voluptas quo, repellendus illum corrupti voluptatibus incidunt! Molestias dolor ad deserunt rerum accusantium animi. Quasi dolore eius labore atque minima laboriosam expedita vero magnam unde fuga doloremque, assumenda esse illo.";

//==== importing =====//
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
mongoose
  .connect(url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.info("Connected to atlas");
  })
  .catch((error) => {
    console.log("Error : ", error);
  });
//===== schema of data set or collection
const postSchema = new mongoose.Schema({
  title: String,
  text: String,
});
//===== creating model using schema ====//
const Posts = mongoose.model("Posts", postSchema);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//======== handaling get request from browser || Home page ==========//
app.get("/", function (req, res) {
  Posts.find(function (err, data) {
    if (data.length === 0) {
      res.render("example");
    } else {
      res.render("home", { items: data });
    }
  });
});

//======== handaling get request from browser || Contact page ==========//
app.get("/contact", function (req, res) {
  res.render("contact", { contactPageContent: contactPage });
});

//======== handaling get request from browser || about page ==========//
app.get("/about", function (req, res) {
  res.render("about", { aboutPageContent: aboutPage });
});

// ======== compose page handaling get and post ======= //
app.get("/compose", function (req, res) {
  res.render("compose");
});
app.post("/compose", function (req, res) {
  const postNew = new Posts({
    title: req.body.postTitle,
    text: req.body.postText,
  });
  postNew.save(function (err) {
    if (err) {
      res.send(`<h1>${err}</h1>`);
      return;
    }
    console.log("Save into dataBase !!");
    res.redirect("/");
  });
});

//===== creating new response base on the click ====//
app.get("/:postName/", function (req, res) {
  const requestedId = req.params.postName;
  Posts.findOne({ _id: requestedId }, function (err, p) {
    res.render("open", { title: p.title, text: p.text });
  });
});

//======== starting the server ==========//
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
