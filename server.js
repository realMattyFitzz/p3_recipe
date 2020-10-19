const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const logger = require("morgan");
const PORT = process.env.PORT || 5050;
const app = express();
const passport = require("./config/passport");
const isAuthenticated = require("./config/middleware/isAuthenticated");

//Define middleware here 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assests
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build")); 
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));

// We need to use sessions to keep track of our user's login status
app.use(
  session({
    secret: "keyboard",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.post("/login", passport.authenticate("local"), function (req, res) {
  res.json({
    message: { email: req.user.email },
  });
});

app.get("/ping", isAuthenticated, function (req, res) {
  console.log(req.user);
  res.json({
    message: "ping!",
  });
});
// Define API routes here

// Send every other request to the React app
app.get("", (req,res) => {
    res.sendFile(path.join(__dirname, "./client/public/index.html"));
});

if (process.env.NODE_ENV ==="production") {
    app.use(express.static("client/build"));
    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, ""))
    });
}

app.listen(PORT, () => {
    console.log(`Server Running on port: ${PORT}!`);
});
