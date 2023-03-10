const express = require("express");
const { engine } = require("express-handlebars");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const passport = require("passport");
require("./passport")(passport);
const session = require("express-session");

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
app.use(methodOverride("_method"));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());



// GET - / - Home Route
// app.get("/", (req, res) => {
app.get("/", async (req, res) => {
    res.render("home", {
        title: "Home"
    });
})

app.post('/login', passport.authenticate('local', {
    successRedirect: "/dashboard", 
    failureRedirect: "/" 
}));

app.post("/register", async (req, res) => {
    try {
        const { firstname, lastname, studentId, course, campus } = req.body;
        const user = await User.create({
            firstname, lastname, studentId, course, campus
        });
        res.status(201).redirect("/dashboard");
    } catch(err) { console.log(err) }
});

app.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

// GET - /dashboard - Dashboard Page (Admin/Student)
app.get("/dashboard", async (req, res) => {
    // console.log(req.user)
    if (req.user === undefined) {
        res.redirect("/");
    } else if (req.user.role === "admin") {
        const students = await User.find({ role: "student" }).lean();
        res.render("admin/dashboard", {
            title: "Admin - Dashboard",
            students
        })
    } else {
        res.render("student/dashboard", { title: "Student - Dashboard" });
    }
});

app.get("/student/:id", async (req, res) => {
    const student = await User.findById(req.params.id).lean();
    // student.isBSCS = student.course === "bscs" ? true: false;
    const subjects = await Subject.find({ course: student.course }).lean();
    // console.log(subjects)
    const grades = await Grade.find().lean();
    // console.log(grades)


    res.render("admin/student", { 
        student, 
        subjects,
        helpers: {
            firstYearfirstTrime(subjects, student) {
                // console.log(student)
                subjects.forEach((subject, index) => {
                    // console.log(subject._id.toString())
                    grades.forEach(grade => {
                        if (subject._id.toString() === grade.subject.toString()) {
                            // console.log(subject)
                            subject.grade = grade.grade;
                            subject.gradeID = grade._id;
                        }
                    })
                });
                // console.log(subjects)

                const filteredSubjects = subjects.filter(subject => subject.year === "1st" && subject.trimester === "1st");

                const mapSubjects = filteredSubjects.map(subject => {
                    const noGradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" required>
                                <button type="submit" class="btn border-0 p-0"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    `;

                    const gradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" disabled>
                                <button type="button" class="btn border-0 p-0 editGradeBtn"><i class="bi bi-pencil-fill"></i></button>
                                <button type="submit" class="btn border-0 p-0 d-none editGradeSubmitBtn"><i class="bi bi-caret-right-fill"></i></button>
                                <button type="button" class="btn border-0 p-0 d-none editGradeCancelBtn"><i class="bi bi-x"></i></button>
                            </div>
                        </form>
                    `;

                    return `
                    <div class="col-6">
                        ${subject.grade ? gradeFormat: noGradeFormat}
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            firstYearsecondTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "1st" && subject.trimester === "2nd");

                const mapSubjects = filteredSubjects.map(subject => {
                    const noGradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" required>
                                <button type="submit" class="btn border-0 p-0"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    `;

                    const gradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" disabled>
                                <button type="button" class="btn border-0 p-0 editGradeBtn"><i class="bi bi-pencil-fill"></i></button>
                                <button type="submit" class="btn border-0 p-0 d-none editGradeSubmitBtn"><i class="bi bi-caret-right-fill"></i></button>
                                <button type="button" class="btn border-0 p-0 d-none editGradeCancelBtn"><i class="bi bi-x"></i></button>
                            </div>
                        </form>
                    `;

                    return `
                    <div class="col-6">
                        ${subject.grade ? gradeFormat: noGradeFormat}
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            firstYearthirdTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "1st" && subject.trimester === "3rd");

                const mapSubjects = filteredSubjects.map(subject => {
                    const noGradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" required>
                                <button type="submit" class="btn border-0 p-0"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    `;

                    const gradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" disabled>
                                <button type="button" class="btn border-0 p-0 editGradeBtn"><i class="bi bi-pencil-fill"></i></button>
                                <button type="submit" class="btn border-0 p-0 d-none editGradeSubmitBtn"><i class="bi bi-caret-right-fill"></i></button>
                                <button type="button" class="btn border-0 p-0 d-none editGradeCancelBtn"><i class="bi bi-x"></i></button>
                            </div>
                        </form>
                    `;

                    return `
                    <div class="col-6">
                        ${subject.grade ? gradeFormat: noGradeFormat}
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            secondYearfirstTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "2nd" && subject.trimester === "1st");

                const mapSubjects = filteredSubjects.map(subject => {
                    const noGradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" required>
                                <button type="submit" class="btn border-0 p-0"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    `;

                    const gradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" disabled>
                                <button type="button" class="btn border-0 p-0 editGradeBtn"><i class="bi bi-pencil-fill"></i></button>
                                <button type="submit" class="btn border-0 p-0 d-none editGradeSubmitBtn"><i class="bi bi-caret-right-fill"></i></button>
                                <button type="button" class="btn border-0 p-0 d-none editGradeCancelBtn"><i class="bi bi-x"></i></button>
                            </div>
                        </form>
                    `;

                    return `
                    <div class="col-6">
                        ${subject.grade ? gradeFormat: noGradeFormat}
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            secondYearsecondTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "2nd" && subject.trimester === "2nd");

                const mapSubjects = filteredSubjects.map(subject => {
                    const noGradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" required>
                                <button type="submit" class="btn border-0 p-0"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    `;

                    const gradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" disabled>
                                <button type="button" class="btn border-0 p-0 editGradeBtn"><i class="bi bi-pencil-fill"></i></button>
                                <button type="submit" class="btn border-0 p-0 d-none editGradeSubmitBtn"><i class="bi bi-caret-right-fill"></i></button>
                                <button type="button" class="btn border-0 p-0 d-none editGradeCancelBtn"><i class="bi bi-x"></i></button>
                            </div>
                        </form>
                    `;

                    return `
                    <div class="col-6">
                        ${subject.grade ? gradeFormat: noGradeFormat}
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            secondYearthirdTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "2nd" && subject.trimester === "3rd");

                const mapSubjects = filteredSubjects.map(subject => {
                    const noGradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" required>
                                <button type="submit" class="btn border-0 p-0"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    `;

                    const gradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" disabled>
                                <button type="button" class="btn border-0 p-0 editGradeBtn"><i class="bi bi-pencil-fill"></i></button>
                                <button type="submit" class="btn border-0 p-0 d-none editGradeSubmitBtn"><i class="bi bi-caret-right-fill"></i></button>
                                <button type="button" class="btn border-0 p-0 d-none editGradeCancelBtn"><i class="bi bi-x"></i></button>
                            </div>
                        </form>
                    `;

                    return `
                    <div class="col-6">
                        ${subject.grade ? gradeFormat: noGradeFormat}
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            thirdYearfirstTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "3rd" && subject.trimester === "1st");

                const mapSubjects = filteredSubjects.map(subject => {
                    const noGradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" required>
                                <button type="submit" class="btn border-0 p-0"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    `;

                    const gradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" disabled>
                                <button type="button" class="btn border-0 p-0 editGradeBtn"><i class="bi bi-pencil-fill"></i></button>
                                <button type="submit" class="btn border-0 p-0 d-none editGradeSubmitBtn"><i class="bi bi-caret-right-fill"></i></button>
                                <button type="button" class="btn border-0 p-0 d-none editGradeCancelBtn"><i class="bi bi-x"></i></button>
                            </div>
                        </form>
                    `;

                    return `
                    <div class="col-6">
                        ${subject.grade ? gradeFormat: noGradeFormat}
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            thirdYearsecondTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "3rd" && subject.trimester === "2nd");

                const mapSubjects = filteredSubjects.map(subject => {
                    const noGradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" required>
                                <button type="submit" class="btn border-0 p-0"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    `;

                    const gradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" disabled>
                                <button type="button" class="btn border-0 p-0 editGradeBtn"><i class="bi bi-pencil-fill"></i></button>
                                <button type="submit" class="btn border-0 p-0 d-none editGradeSubmitBtn"><i class="bi bi-caret-right-fill"></i></button>
                                <button type="button" class="btn border-0 p-0 d-none editGradeCancelBtn"><i class="bi bi-x"></i></button>
                            </div>
                        </form>
                    `;

                    return `
                    <div class="col-6">
                        ${subject.grade ? gradeFormat: noGradeFormat}
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            thirdYearthirdTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "3rd" && subject.trimester === "3rd");

                const mapSubjects = filteredSubjects.map(subject => {
                    const noGradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" required>
                                <button type="submit" class="btn border-0 p-0"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    `;

                    const gradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" disabled>
                                <button type="button" class="btn border-0 p-0 editGradeBtn"><i class="bi bi-pencil-fill"></i></button>
                                <button type="submit" class="btn border-0 p-0 d-none editGradeSubmitBtn"><i class="bi bi-caret-right-fill"></i></button>
                                <button type="button" class="btn border-0 p-0 d-none editGradeCancelBtn"><i class="bi bi-x"></i></button>
                            </div>
                        </form>
                    `;

                    return `
                    <div class="col-6">
                        ${subject.grade ? gradeFormat: noGradeFormat}
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
            fourthYearfirstTrime(subjects) {
                const filteredSubjects = subjects.filter(subject => subject.year === "4th" && subject.trimester === "1st");

                const mapSubjects = filteredSubjects.map(subject => {
                    const noGradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" required>
                                <button type="submit" class="btn border-0 p-0"><i class="bi bi-caret-right-fill"></i></button>
                            </div>
                        </form>
                    `;

                    const gradeFormat = `
                        <form action="/grade/subject/${subject._id}" class="d-flex justify-content-between align-items-center" method="post">
                            <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                            <div>
                                <input type="hidden" value="${student._id}" name="studentID">
                                <input type="hidden" value="${subject.gradeID}" name="gradeID">
                                <!-- <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" ${subject.grade ? "disabled=true": ""}> -->
                                <input type="text" class="border-0 border-bottom" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade: ""}" disabled>
                                <button type="button" class="btn border-0 p-0 editGradeBtn"><i class="bi bi-pencil-fill"></i></button>
                                <button type="submit" class="btn border-0 p-0 d-none editGradeSubmitBtn"><i class="bi bi-caret-right-fill"></i></button>
                                <button type="button" class="btn border-0 p-0 d-none editGradeCancelBtn"><i class="bi bi-x"></i></button>
                            </div>
                        </form>
                    `;

                    return `
                    <div class="col-6">
                        ${subject.grade ? gradeFormat: noGradeFormat}
                    </div>
                    `
                });
                // console.log(mapSubjects.join(""));
                return mapSubjects.join("")
            },
        }
     });
});

app.post("/grade/subject/:id", async (req, res) => {
    try {
        const grade = await Grade.create({
            subject: req.params.id,
            student: req.body.studentID,
            grade: req.body.grade
        });
        // res.json(grade);
        res.status(201).redirect(`/student/${req.body.studentID}`);
    } catch(err) { console.log(err) }
});

app.put("/grade/subject/:id", async (req, res) => {
    try {
        const updateGrade = await Grade.findByIdAndUpdate(req.body.gradeID, { grade: req.body.grade }, { new: true });
        // console.log(updateGrade)
        res.status(200).redirect(`/student/${req.body.studentID}`);
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