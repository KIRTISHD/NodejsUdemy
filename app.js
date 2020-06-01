const http = require('http');
const fs = require('fs');
//One way of creating listener function is creating an actual function
//  to listen to the request.
// function rqListener(req, res) {

// }
// http.createServer(rqListener);

//Second way is to create an anonymous function inside the createServer function
// it's event driven architecture
const server = http.createServer((req, res) => {
    console.log(req.url, req.method, req.headers);
    const url = req.url;
    const method = req.method;
    //hard exits the event loop
    //process.exit();

    if (url === "/") {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }

    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
            const message = parsedBody.split('=')[1];
            //fs.writeFileSync('message.txt', message);
            fs.writeFile('message.txt', message, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });

    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first Page</title></head>');
    res.write('<body><h1>Cumbersome way of sending html</h1></body>');
    res.write('</html>');
    res.end();
});

// default => 8080 - port, localhost - hostname
server.listen(7070);