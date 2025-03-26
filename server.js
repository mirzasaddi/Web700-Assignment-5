/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party websites) or distributed to other students.
*
*  Name: Mirza Mohammad Ullah Sadi Student ID: 150314235 Date: March 25, 2025
*
*  Online (Vercel) Link: https://web700-assignment-5-cs88ushiu.vercel.app/
********************************************************************************/

const express = require("express");
const app = express();
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const collegeData = require("./modules/collegeData");

require("pg"); // Required for deployment on Vercel

// Setup EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/main");
app.use(expressLayouts);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Active Nav Helper
app.use((req, res, next) => {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  next();
});

// EJS Helpers
app.locals.navLink = function (url, options) {
  return (
    '<li' +
    (url === app.locals.activeRoute
      ? ' class="nav-item active"'
      : ' class="nav-item"') +
    '><a class="nav-link" href="' +
    url +
    '">' +
    options.fn(this) +
    "</a></li>"
  );
};

app.locals.equal = function (lvalue, rvalue, options) {
  if (arguments.length < 3)
    throw new Error("Helper 'equal' needs 2 parameters");
  return lvalue !== rvalue ? options.inverse(this) : options.fn(this);
};

// ROUTES

app.get("/", (req, res) => res.render("home"));
app.get("/about", (req, res) => res.render("about"));
app.get("/htmlDemo", (req, res) => res.render("htmlDemo"));
app.get("/students/add", (req, res) => res.render("addStudent"));

// Add student
app.post("/students/add", (req, res) => {
  collegeData
    .addStudent(req.body)
    .then(() => res.redirect("/students"))
    .catch((err) => {
      console.error("Add Student Error:", err);
      res.json({ message: "Unable to add student" });
    });
});

// View students (with optional course filter)
app.get("/students", (req, res) => {
  if (req.query.course) {
    collegeData
      .getStudentsByCourse(req.query.course)
      .then((students) => res.render("students", { students }))
      .catch(() => res.render("students", { message: "no results found" }));
  } else {
    collegeData
      .getAllStudents()
      .then((students) => res.render("students", { students }))
      .catch(() => res.render("students", { message: "no results found" }));
  }
});

// Single student view
app.get("/student/:studentNum", (req, res) => {
  collegeData
    .getStudentByNum(req.params.studentNum)
    .then((student) => res.render("student", { student }))
    .catch(() => res.status(404).send("Student Not Found"));
});

// Update student
app.post("/student/update", (req, res) => {
  collegeData
    .updateStudent(req.body)
    .then(() => res.redirect("/students"))
    .catch((err) => {
      console.error("Update Student Error:", err);
      res.status(500).send("Unable to update student");
    });
});

// Courses
app.get("/courses", (req, res) => {
  collegeData
    .getCourses()
    .then((courses) => res.render("courses", { courses }))
    .catch(() => res.render("courses", { message: "no results" }));
});

// Single course
app.get("/course/:id", (req, res) => {
  collegeData
    .getCourseById(req.params.id)
    .then((course) => res.render("course", { course }))
    .catch(() => res.status(404).send("Course Not Found"));
});

// TAs (JSON)
app.get("/tas", (req, res) => {
  collegeData
    .getTAs()
    .then((tas) => res.json(tas))
    .catch(() => res.json({ message: "no results" }));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// Initialize & Start
(async () => {
  try {
    await collegeData.initialize();
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log("Server listening on port: " + port);
    });
  } catch (err) {
    console.error("Initialization Error:", err);
  }
})();

// Export app for Vercel
module.exports = app;
