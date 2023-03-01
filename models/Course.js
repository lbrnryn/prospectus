const mongoose = require("mongoose");

const course = new mongoose.Schema({
    abbreviation: String,
    name: String
}, { timestamps: true });

module.exports = mongoose.model("Course", course);