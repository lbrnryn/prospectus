const express = require("express");
const { engine } = require("express-handlebars");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.get("/", (req, res) => {
    res.render("home")
});

app.listen(1000, () => console.log("Server running on port: 1000"));