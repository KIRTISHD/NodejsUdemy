const express = require('express');
const path = require('path');

const routes = require('./routes/main');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.listen(3000);