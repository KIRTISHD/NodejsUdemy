const http = require('http');

const routes = require('./routes');
//One way of creating listener function is creating an actual function
//  to listen to the request.
// function rqListener(req, res) {

// }
// http.createServer(rqListener);

//Second way is to create an anonymous function inside the createServer function
// it's event driven architecture
//const server = http.createServer(routes);

const server = http.createServer(routes.handler);

// default => 8080 - port, localhost - hostname
server.listen(7070);