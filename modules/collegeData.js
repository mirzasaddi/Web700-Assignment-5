const fs = require("fs");
const path = require("path");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

function initialize() {
    return new Promise((resolve, reject) => {
        const coursesPath = path.join(__dirname, "../data/courses.json");
        const studentsPath = path.join(__dirname, "../data/students.json");

        console.log("Reading courses from:", coursesPath);
        console.log("Reading students from:", studentsPath);

        fs.readFile(coursesPath, 'utf8', (err, courseData) => {
            if (err) {
                reject("Unable to load courses");
                return;
            }

            fs.readFile(studentsPath, 'utf8', (err, studentData) => {
                if (err) {
                    reject("Unable to load students");
                    return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

function getAllStudents() {
    return new Promise((resolve, reject) => {
        if (!dataCollection || dataCollection.students.length === 0) {
            reject("query returned 0 results");
        } else {
            resolve(dataCollection.students);
        }
    });
}

function getTAs() {
    return new Promise((resolve, reject) => {
        const filtered = dataCollection.students.filter(s => s.TA === true);
        filtered.length > 0 ? resolve(filtered) : reject("query returned 0 results");
    });
}

function getCourses() {
    return new Promise((resolve, reject) => {
        if (!dataCollection || dataCollection.courses.length === 0) {
            reject("query returned 0 results");
        } else {
            resolve(dataCollection.courses);
        }
    });
}

function getStudentByNum(num) {
    return new Promise((resolve, reject) => {
        const student = dataCollection.students.find(s => s.studentNum == num);
        student ? resolve(student) : reject("query returned 0 results");
    });
}

function getStudentsByCourse(course) {
    return new Promise((resolve, reject) => {
        const filtered = dataCollection.students.filter(s => s.course == course);
        filtered.length > 0 ? resolve(filtered) : reject("query returned 0 results");
    });
}

function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        try {
            studentData.TA = studentData.TA === "true" || studentData.TA === true;
            studentData.studentNum = dataCollection.students.length + 1;
            dataCollection.students.push(studentData);
            resolve();
        } catch (err) {
            reject("Failed to add student");
        }
    });
}

function updateStudent(studentData) {
    return new Promise((resolve, reject) => {
        const index = dataCollection.students.findIndex(s => s.studentNum == studentData.studentNum);
        if (index === -1) {
            reject("Student not found");
            return;
        }

        studentData.TA = studentData.TA === "true" || studentData.TA === true;
        dataCollection.students[index] = studentData;
        resolve();
    });
}

function getCourseById(id) {
    return new Promise((resolve, reject) => {
        const course = dataCollection.courses.find(c => c.courseId == id);
        course ? resolve(course) : reject("query returned 0 results");
    });
}

// Export all methods properly
module.exports = {
    initialize,
    getAllStudents,
    getTAs,
    getCourses,
    getStudentByNum,
    getStudentsByCourse,
    addStudent,
    updateStudent,
    getCourseById
};
