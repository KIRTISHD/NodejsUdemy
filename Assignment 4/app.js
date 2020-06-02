const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const homeRoutes = require('./routes/home');
const usersRoutes = require('./routes/users');

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.use(homeRoutes);
app.use(usersRoutes.router);

app.listen(3000);