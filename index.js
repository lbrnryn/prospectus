const express = require("express");
const { engine } = require("express-handlebars");
const mongoose = require("mongoose");
const path = require("path");

(async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/prospectus");
        console.log("Database connected")
    } catch(err) { console.log(err) }
})()

// Models
const Subject = require("./models/Subject");
// const Course = require("./models/Course");
const User = require("./models/User");
const Grade = require("./models/Grade");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.set("json spaces", 2);
app.use(express.static(path.join(__dirname, "public")));
app.use("/student", express.static(path.join(__dirname, "public")));

// GET - / - Home Route
app.get("/", (req, res) => {
    res.render("home", {
        title: "Home"
    });
})

app.post("/login", (req, res) => {
    res.json(req.body)
});

app.post("/register", async (req, res) => {
    try {
        // res.json(req.body)
        // const { username, password, name, role, studentId, course } = req.body
        const { firstname, lastname, studentId, course, campus } = req.body;
        // const subjects = await Subject.find({ course: req.body.course  });
        // res.json(subjects)
        // const subjectIds = subjects.map(subject => subject._id);
        // res.json(subjectIds)
        // const user = await User.create(req.body);
        const user = await User.create({
            firstname, lastname, studentId, course, campus
            // username, password, name, role, studentId, course, campus
            // username, password, name, role, studentId, course, subjects: subjectIds
        });
        // res.status(201).json(user);
        res.status(201).redirect("/dashboard");
    } catch(err) { console.log(err) }
});

app.get("/api/users", async (req, res) => {
    try {
        // const users = await User.find().populate("course").populate("subjects");
        const users = await User.find().populate("course");
        res.json(users);
    } catch(err) { console.log(err) }
})

// GET - /dashboard - Dashboard Page (Admin/Student)
app.get("/dashboard", async  (req, res) => {
    const students = await User.find().lean();

    res.render("admin/dashboard", {
        title: "Admin - Dashboard",
        students
    })
});

app.get("/student/:id", async (req, res) => {
    const student = await User.findById(req.params.id).lean();
    // student.isBSCS = student.course === "bscs" ? true: false;
    const subjects = await Subject.find({ course: student.course }).lean();
    // console.log(subjects)
    res.render("admin/student", { student, subjects });
});

app.post("/grade/subject", async (req, res) => {
    try {
        const grade = await Grade.create(req.body);
        res.json(grade)
    } catch(err) { console.log(err) }
});

// POST - /course - Add a course
// app.post("/course", async (req, res) => {
//     try {
//         const course = await Course.create(req.body);
//         res.json(course);
//     } catch(err) { console.log(err) }
// });

// GET - /api/courses - Get all courses in json
// app.get("/api/courses", async (req, res) => {
//     try {
//         const courses = await Course.find();
//         res.json(courses);
//     } catch (err) { console.log(err) }
// });

// POST - /subject - Add a subject
app.post("/subject", async (req, res) => {
    try {
        const subject = await Subject.create(req.body);
        // res.json(subject);
        res.status(201).redirect("/dashboard");
    } catch(err) { console.log(err) }
});

// GET - /api/subjects - Get all subjects in json
// app.get("/api/subjects", async (req, res) => {
//     try {
//         const subjects = await Subject.find().populate("course");
//         res.json(subjects);
//     } catch (err) { console.log(err) }
// });
app.get("/api/subjects", async (req, res) => {
    try {
        // console.log(req.query)
        const subjects = await Subject.find(req.query).populate("course");
        res.json(subjects)
    } catch (err) { console.log(err) }
});

app.listen(1000, () => console.log("Server running on port: 1000"));