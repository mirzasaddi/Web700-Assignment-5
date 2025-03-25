/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party websites) or distributed to other students.
*
*  Name: Mirza Mohammad Ullah Sadi Student ID: 150314235 Date: March 25, 2025
*
*  Online (Vercel) Link: https://assignment-5-inky-seven.vercel.app/
********************************************************************************/
const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const collegeData = require("./modules/collegeData");

const HTTP_PORT = process.env.PORT || 8080;

require('pg'); // Required for Vercel deployment using Sequelize

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Use express-ejs-layouts
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from public
app.use(express.static(__dirname + "/public"));

// Middleware to set active route
app.use((req, res, next) => {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (
        isNaN(route.split('/')[1]) 
            ? route.replace(/\/(?!.*)/, "") 
            : route.replace(/\/(.*)/, "")
    );
    next();
});

// EJS helper for active nav
app.locals.navLink = function (url, options) {
    return '<li' +
        ((url == app.locals.activeRoute) ? ' class="nav-item active"' : ' class="nav-item"') +
        '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
};

// EJS helper to compare values
app.locals.equal = function (lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Helper 'equal' needs 2 parameters");
    return (lvalue != rvalue) ? options.inverse(this) : options.fn(this);
};

// ROUTES

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
});

app.get("/students/add", (req, res) => {
    res.render("addStudent");
});

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => res.redirect("/students"))
        .catch(() => res.json({ message: "Unable to add student" }));
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then((students) => res.render("students", { students }))
            .catch(() => res.render("students", { message: "no results" }));
    } else {
        collegeData.getAllStudents()
            .then((students) => res.render("students", { students }))
            .catch(() => res.render("students", { message: "no results" }));
    }
});

app.get("/student/:studentNum", (req, res) => {
    collegeData.getStudentByNum(req.params.studentNum)
        .then((student) => res.render("student", { student }))
        .catch(() => res.status(404).send("Student Not Found"));
});

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
        .then(() => res.redirect("/students"))
        .catch(() => res.status(500).send("Unable to update student"));
});

app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then((courses) => res.render("courses", { courses }))
        .catch(() => res.render("courses", { message: "no results" }));
});

app.get("/course/:id", (req, res) => {
    collegeData.getCourseById(req.params.id)
        .then((course) => res.render("course", { course }))
        .catch(() => res.status(404).send("Course Not Found"));
});

app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then((tas) => res.json(tas))
        .catch(() => res.json({ message: "no results" }));
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, () => {
    console.log("Server listening on port: " + HTTP_PORT);
    collegeData.initialize();
});