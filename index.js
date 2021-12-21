// Require the libraries:
var SocketIOFileUpload = require("socketio-file-upload")
const fs = require('fs')

const express = require('express')
const app = express()
app.use(SocketIOFileUpload.router);
const http = require('http')
const { Server } = require('socket.io')
const server = http.createServer(app)
const io = new Server(server)
app.use(express.static(__dirname + '/uploads'))


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get('/deleteimage', (req, res) => {
    console.log(req.query);
    res.json(req.query.path);
    fs.unlinkSync(__dirname + "/uploads/" + req.query.path, () => {
        
    })
})

io.sockets.on("connection", function (socket) {
  // Make an instance of SocketIOFileUpload and listen on this socket:
  var uploader = new SocketIOFileUpload();
  uploader.dir = "uploads";
  uploader.listen(socket);

  // Do something when a file is saved:
  uploader.on("saved", function (event) {
      event.file.clientDetail.name = event.file.name; 
  });

  // Error handler:
  uploader.on("error", function (event) {
    console.log("Error from uploader", event);
  });
});

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
