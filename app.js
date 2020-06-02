const http = require('http');
const express = require('express');

const app = express();

app.use('/add-product', (req, res, next) => {
    console.log("In second middleware")
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'); // default header is text/html
});

app.use('product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

app.use('/', (req, res, next) => {
    console.log("In second middleware")
    res.send('<h1>  Inside Express </h1>'); // default header is text/html
});

app.listen(3000);
// alternative for above code
//const server = http.createServer(app);
//server.listen(3000);