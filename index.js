const http = require("http");
const app = require("./app");

const port = process.env.PORT


const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is listening on localhost: ${port} 
    open your browser on http://localhost:${port}/`);
});