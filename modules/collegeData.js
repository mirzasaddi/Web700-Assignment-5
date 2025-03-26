const fs = require("fs");
const path = require("path");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/courses.json', 'utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile(studentsPath, 'utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
};

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); return;
        }
        resolve(dataCollection.students);
    });
};

module.exports.getTAs = function () {
    return new Promise((resolve, reject) => {
        const filtered = dataCollection.students.filter(s => s.TA === true);
        if (filtered.length === 0) {
            reject("query returned 0 results"); return;
        }
        resolve(filtered);
    });
};

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length == 0) {
            reject("query returned 0 results"); return;
        }
        resolve(dataCollection.courses);
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        const student = dataCollection.students.find(s => s.studentNum == num);
        student ? resolve(student) : reject("query returned 0 results");
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        const filtered = dataCollection.students.filter(s => s.course == course);
        if (filtered.length === 0) {
            reject("query returned 0 results"); return;
        }
        resolve(filtered);
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        studentData.TA = studentData.TA === "true" || studentData.TA === true;
        studentData.studentNum = dataCollection.students.length + 1;
        dataCollection.students.push(studentData);
        resolve();
    });
};

module.exports.updateStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        const index = dataCollection.students.findIndex(s => s.studentNum == studentData.studentNum);
        if (index === -1) {
            reject("Student not found"); return;
        }
        studentData.TA = studentData.TA === "true" || studentData.TA === true;
        dataCollection.students[index] = studentData;
        resolve();
    });
};

module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        const course = dataCollection.courses.find(c => c.courseId == id);
        course ? resolve(course) : reject("query returned 0 results");
    });
};
