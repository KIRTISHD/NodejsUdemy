const requestHandler = (req, res) => {

    const url = req.url;
    const method = req.method;

    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            console.log(message);
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        });
    }

    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Assignment 1</title></head>');
        res.write('<body>');
        res.write('<h1>Add User</h1>');
        res.write('<form method="POST" action="/create-user"><input type="text" name="username"><button type="submit">Send Username</button></form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/users') {
        res.write('<html>');
        res.write('<head><title>Assignment 1</title></head>');
        res.write('<body>');
        res.write('<h1>List of User</h1>');
        res.write('<ul><li>John Reese</li><li>Harold</li><li>Shaw</li><li>Root</li></ul>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Assignment 1</title></head>');
    res.write('<body>');
    res.write('<h1>Welcome to the First Assignment Page</h1>');
    res.write('</body>');
    res.write('</html>');
    res.end();
};

module.exports = requestHandler;