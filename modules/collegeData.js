const path = require("path");
const fs = require("fs");

let students = [];
let courses = [];

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, "../data/students.json"), "utf8", (err, studentData) => {
      if (err) {
        reject("Unable to read students.json");
        return;
      }

      fs.readFile(path.join(__dirname, "../data/courses.json"), "utf8", (err, courseData) => {
        if (err) {
          reject("Unable to read courses.json");
          return;
        }

        students = JSON.parse(studentData);
        courses = JSON.parse(courseData);
        resolve();
      });
    });
  });
};

module.exports.getAllStudents = function () {
  return new Promise((resolve, reject) => {
    if (students.length > 0) resolve(students);
    else reject("no results");
  });
};

module.exports.getCourses = function () {
  return new Promise((resolve, reject) => {
    if (courses.length > 0) resolve(courses);
    else reject("no results");
  });
};

module.exports.getStudentsByCourse = function (course) {
  return new Promise((resolve, reject) => {
    const filtered = students.filter(s => s.course == course);
    if (filtered.length > 0) resolve(filtered);
    else reject("no results");
  });
};

module.exports.getStudentByNum = function (num) {
  return new Promise((resolve, reject) => {
    const found = students.find(s => s.studentNum == num);
    found ? resolve(found) : reject("no results");
  });
};

module.exports.addStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    studentData.TA = studentData.TA ? true : false;
    studentData.studentNum = students.length + 1;
    students.push(studentData);
    resolve();
  });
};

module.exports.updateStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    const index = students.findIndex(s => s.studentNum == studentData.studentNum);
    if (index === -1) {
      reject("Student not found");
      return;
    }

    studentData.TA = studentData.TA ? true : false;
    students[index] = studentData;
    resolve();
  });
};

module.exports.getCourseById = function (id) {
  return new Promise((resolve, reject) => {
    const found = courses.find(c => c.courseId == id);
    found ? resolve(found) : reject("no results");
  });
};

module.exports.getTAs = function () {
  return new Promise((resolve, reject) => {
    const tas = students.filter(s => s.TA === true);
    tas.length > 0 ? resolve(tas) : reject("no results");
  });
};
