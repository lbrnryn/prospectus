const mongoose = require("mongoose");

const subject = new mongoose.Schema({
    // course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    course: { type: String, enum: ["act", "bscs", "bsit", "bsis"] },
    year: { type: String, enum: ["1st", "2nd", "3rd", "4th", "5th"] },
    trimester: { type: String, enum: ["1st", "2nd", "3rd"] },
    code: String,
    // title: String,
    // units: Number,
    // prerequisite: String,
    // grade: Number
}, { timestamps: true });

module.exports = mongoose.model("Subject", subject);