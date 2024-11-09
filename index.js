// https://expressjs.com/en/guide/routing.html

// REQUIRES
const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");

// mapping the file system paths to the app's virtual paths
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));


// get the root node
app.get("/create_task", function (req, res) {
    let doc = fs.readFileSync("./app/html/create_task.html", "utf8");

    // sending the text stream
    res.send(doc);
});

app.get("/", function (req, res) {
    let doc = fs.readFileSync("./app/html/index.html", "utf8");

    // sending the text stream
    res.send(doc);
});

app.get("/about", function (req, res) {
    let doc = fs.readFileSync("./app/html/about.html", "utf8");

    // sending the text stream
    res.send(doc);
});

app.get("/nav_before_login", function (req, res) {
    let doc = fs.readFileSync("./app/html/text/nav_before_login.html", "utf8");

    // sending the text stream
    res.send(doc);
});

app.get("/footer_before_login", function (req, res) {
    let doc = fs.readFileSync("./app/html/text/footer_before_login.html", "utf8");

    // sending the text stream
    res.send(doc);
});

app.get("/nav_after_login", function (req, res) {
    let doc = fs.readFileSync("./app/html/text/nav_after_login.html", "utf8");

    // sending the text stream
    res.send(doc);
});

app.get("/footer_after_login", function (req, res) {
    let doc = fs.readFileSync("./app/html/text/footer_after_login.html", "utf8");

    // sending the text stream
    res.send(doc);
});

app.get("/login", function (req, res) {
    let doc = fs.readFileSync("./app/html/login.html", "utf8");

    // sending the text stream
    res.send(doc);
});

app.get("/home", function (req, res) {
    let doc = fs.readFileSync("./app/html/home.html", "utf8");

    // sending the text stream
    res.send(doc);
});

app.get("/task_list", function (req, res) {
    let doc = fs.readFileSync("./app/html/task_list.html", "utf8");

    // sending the text stream
    res.send(doc);
});

app.get("/course_list", function (req, res) {
    let doc = fs.readFileSync("./app/html/course_list.html", "utf8");

    // sending the text stream
    res.send(doc);
});

app.get("/profile", function (req, res) {
    let doc = fs.readFileSync("./app/html/profile.html", "utf8");

    // sending the text stream
    res.send(doc);
});



// for the page not found (i.e. 404)
app.use(function (req, res, next) {
    res.status(404).send("<html><head><title>Page not found!</title></head><body><p>ERROR 404 Page not found</p></body></html>");
})

// run server
let port = 8000;
app.listen(port, function() {
    console.log("App is listening in port " + port);
})