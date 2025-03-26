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
        const coursesPath = path.join(__dirname, "../data/courses.json");
        const studentsPath = path.join(__dirname, "../data/students.json");

        console.log("Reading:", coursesPath);
        console.log("Reading:", studentsPath);

        fs.readFile(coursesPath, 'utf8', (err, courseData) => {
            if (err) {
                reject("Unable to read courses.json");
                return;
            }

            fs.readFile(studentsPath, 'utf8', (err, studentData) => {
                if (err) {
                    reject("Unable to read students.json");
                    return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
};
