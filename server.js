//requiring dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressHandlebars = require("express-handlebars");
//const axios = require("axios");

//setup for port HOST
const PORT = process.env.PORT || 3030;

//express app setup
const app = express();
//router
const router = express.Router();
//require routes file to router object
//require("./config/routes")(router);
//static directory folder
app.use(express.static(__dirname + "/public"));

//bodyParser
app.use(bodyParser.urlencoded({
    extended: false
}));

//connecting handlebars to express
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//mongoose
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, }, function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log("Mongoose connection successful!")
    }
});

//router middleware
app.use(router);
//listening on PORT
app.listen(PORT, function () {
    console.log("listening on port: " + PORT)
});

