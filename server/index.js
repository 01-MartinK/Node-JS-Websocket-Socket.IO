// prequisitions
var express = require('express');

var app = express();
var server = app.listen(3310);

// set static to public doesn't exist right now
app.use(express.static('public'));

// log server
console.log("Server running at http://localhost:3310");

// websocket using io
const io = require("socket.io")(server, {cors: { origin: "*"}})

// the selected cells
var selected_cells = []

// on user/socket connection
io.on('connection', socket => {
    console.log("A new client has connected");
    // emit current cells
    io.emit('cells_changed', selected_cells)

    // on socket message receive
    socket.on('message', data => {
        console.log(data)
    })

    // on socket cell_selected receive
    socket.on('cell_selected', id => {
        console.log(id)

        // check if already selected if not then add to selected
        if (!selected_cells.includes(id)) selected_cells.push(id);

        // emit that cells have changed
        io.emit('cells_changed', selected_cells)
    })
});

