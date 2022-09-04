var express = require('express');

var app = express();
var server = app.listen(3310);

app.use(express.static('public'));

console.log("Server running at http://localhost:3310");

const io = require("socket.io")(server, {cors: { origin: "*"}})

var selected_cells = []

io.on('connection', socket => {
    console.log("A new client has connected");
    io.emit('cells_changed', selected_cells)

    socket.on('message', data => {
        console.log(data)
    })

    socket.on('cell_selected', id => {
        console.log(id)
    
        if (!selected_cells.includes(id)) selected_cells.push(id);

        io.emit('cells_changed', selected_cells)
    })
});

