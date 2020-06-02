const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    //res.status(404).send('<h1> Page not found </h1>');
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
// alternative for above code
//const server = http.createServer(app);
//server.listen(3000);