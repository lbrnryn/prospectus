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
        const { firstname, lastname, studentId, course, campus } = req.body;
        const user = await User.create({
            firstname, lastname, studentId, course, campus
        });
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
    const students = await User.find({ role: "student" }).lean();
    // console.log(students)

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
    res.render("admin/student", { 
        student, 
        subjects,
        helpers: {
            firstYearfirstTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "1st" && subject.trimester === "1st");

                const mapSubjects = filteredSubjects.map(subject => {
                    return `
                    <div class="col-6">
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;">
                                <button type="submit" class="btn"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            firstYearsecondTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "1st" && subject.trimester === "2nd");

                const mapSubjects = filteredSubjects.map(subject => {
                    return `
                    <div class="col-6">
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center">
                            <label for="" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="text" class="border-0 border-bottom" style="width: 2rem;">
                                <button type="submit" class="btn"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            firstYearthirdTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "1st" && subject.trimester === "3rd");

                const mapSubjects = filteredSubjects.map(subject => {
                    return `
                    <div class="col-6">
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center">
                            <label for="" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="text" class="border-0 border-bottom" style="width: 2rem;">
                                <button type="submit" class="btn"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            secondYearfirstTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "2nd" && subject.trimester === "1st");

                const mapSubjects = filteredSubjects.map(subject => {
                    return `
                    <div class="col-6">
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center">
                            <label for="" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="text" class="border-0 border-bottom" style="width: 2rem;">
                                <button type="submit" class="btn"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            secondYearsecondTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "2nd" && subject.trimester === "2nd");

                const mapSubjects = filteredSubjects.map(subject => {
                    return `
                    <div class="col-6">
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center">
                            <label for="" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="text" class="border-0 border-bottom" style="width: 2rem;">
                                <button type="submit" class="btn"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            secondYearthirdTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "2nd" && subject.trimester === "3rd");

                const mapSubjects = filteredSubjects.map(subject => {
                    return `
                    <div class="col-6">
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center">
                            <label for="" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="text" class="border-0 border-bottom" style="width: 2rem;">
                                <button type="submit" class="btn"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            thirdYearfirstTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "3rd" && subject.trimester === "1st");

                const mapSubjects = filteredSubjects.map(subject => {
                    return `
                    <div class="col-6">
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center">
                            <label for="" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="text" class="border-0 border-bottom" style="width: 2rem;">
                                <button type="submit" class="btn"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            thirdYearsecondTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "3rd" && subject.trimester === "2nd");

                const mapSubjects = filteredSubjects.map(subject => {
                    return `
                    <div class="col-6">
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center">
                            <label for="" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="text" class="border-0 border-bottom" style="width: 2rem;">
                                <button type="submit" class="btn"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            thirdYearthirdTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "3rd" && subject.trimester === "3rd");

                const mapSubjects = filteredSubjects.map(subject => {
                    return `
                    <div class="col-6">
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center">
                            <label for="" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="text" class="border-0 border-bottom" style="width: 2rem;">
                                <button type="submit" class="btn"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            fourthYearfirstTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "4th" && subject.trimester === "1st");

                const mapSubjects = filteredSubjects.map(subject => {
                    return `
                    <div class="col-6">
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center">
                            <label for="" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="text" class="border-0 border-bottom" style="width: 2rem;">
                                <button type="submit" class="btn"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
        }
     });
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