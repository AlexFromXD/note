import * as http from "http";

const server = http.createServer((req, res) => {
  console.log(1);
  console.log(2);
  console.log(3);
  console.log(4);
  console.log(5);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
});

const PORT = 8000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
