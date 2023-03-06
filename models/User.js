const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const user = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    studentId: String,
    // role: { type: String, enum: ["student", "admin"] },
    role: String,
    course: { type: String, enum: ["act", "bscs", "bsit", "bsis", ""] },
    // course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    // subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    // grades: [{ type: mongoose.Schema.Types.ObjectId, ref: "Grade" }]
    campus: { type: String, enum: ["cainta", "antipolo", "binangonan", "cogeo", "san mateo", "sumulong", "taytay", ""] }
}, { timestamps: true });

user.pre("save", async function() {
    this.username = this.firstname.match(/\s/g) ? this.firstname.replace(/\s/g, ""): this.firstname;
    // this.password = this.lastname.match(/\s/g) ? this.lastname.replace(/\s/g, ""): this.lastname;
    const password = this.lastname.match(/\s/g) ? this.lastname.replace(/\s/g, ""): this.lastname;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    this.password = hashedPassword;
    if (this.studentId) { 
        this.role = "student";
    } else {
        this.role = "admin";
    }
})

module.exports = mongoose.model("User", user);