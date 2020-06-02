const express = require("express");

const app = express();

/*app.use("/func1", (req, res, next) => {
    console.log("This is function 1");
    res.send("<h1> This is function 1 </h1>");
});
app.use("/func2", (req, res, next) => {
    console.log("This is function 2");
});*/

app.use("/users", (req, res, next) => {
    console.log("This is the users function");
    res.send("<h1> This is the users functon </h1>");
});

app.use("/", (req, res, next) => {
    console.log("This is the home/default function");
    res.send("<h1> This is the Default function</h1>");
});

app.listen(3000);