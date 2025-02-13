var http = require('http');

function server_request(req,res) {
    var body = 'Mój serwer działa...';
    var body_length = body.length;

    res.writeHead(200, {
        'Content-Length': body_length,
        'Content-Type': 'text/plain'
    });
    res.end(body);
}

var app = http.createServer(server_request);

app.listen(8000, () => {
    console.log('Serwer działa na porcie 8000');
});