const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: '✅ Simple Node.js server running',
      time: new Date().toISOString()
    }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('✅ Simple server running on http://127.0.0.1:3000');
});