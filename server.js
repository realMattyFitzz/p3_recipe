const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5050;
const app = express();

//Define middleware here 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assests
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build")); 
}

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
