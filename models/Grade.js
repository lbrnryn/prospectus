const mongoose = require("mongoose");

const grade = new mongoose.Schema({
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    grade: Number
}, { timestamps: true });

module.exports = mongoose.model("Grade", grade)