const mongoose = require("mongoose");

const user = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    // role: { type: String, enum: ["student", "admin"] },
    role: { type: String, enum: ["student", "admin"] },
    studentId: String,
    course: { type: String, enum: ["act", "bscs", "bsit", "bsis"] },
    // course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    // subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    // grades: [{ type: mongoose.Schema.Types.ObjectId, ref: "Grade" }]
    campus: { type: String, enum: ["cainta", "antipolo", "binangonan", "cogeo", "san mateo", "sumulong", "taytay"] }
}, { timestamps: true });

user.pre("save", function() {
    this.username = this.firstname.match(/\s/g) ? this.firstname.replace(/\s/g, ""): this.firstname;
    this.password = this.lastname.match(/\s/g) ? this.lastname.replace(/\s/g, ""): this.lastname;
    if (this.studentId) { 
        this.role = "student";
        return;
    }
})

module.exports = mongoose.model("User", user);