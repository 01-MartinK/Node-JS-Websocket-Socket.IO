// prequisitions
var express = require('express');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/mydb")
var Schema = mongoose.Schema;

// database schema
var cellDataSchema = new Schema({
    id: {type: Number, required: true},
    selected: Boolean,
}, {collection: 'cells'});

// cell data
var CellData = mongoose.model('CellData', cellDataSchema);

var app = express();
var server = app.listen(3310);

// set static to public doesn't exist right now
app.use(express.static('public'));

// log server
console.log("Server running at http://localhost:3310");

// websocket using io
const io = require("socket.io")(server, {cors: { origin: "*"}})

// default listing when there arent any yet
var defaultListings = [{id:1,selected:false},{id:2,selected:false},{id:3,selected:false},{id:4,selected:false},{id:5,selected:false},{id:6,selected:false},{id:7,selected:false},{id:8,selected:false},{id:9,selected:false},{id:10,selected:false},{id:11,selected:false}]

// on user/socket connection
io.on('connection', socket => {
    console.log("A new client has connected");
    // emit current cells

    // find all the listings
    CellData.find().then((doc) => {
        if (doc.length === 0)
            CellData.insertMany(defaultListings);
        io.emit('cells_changed', doc)
    })

    // on socket message receive
    socket.on('message', data => {
        console.log(data)
    })

    // on socket cell_selected receive
    socket.on('cell_selected', id => {
        console.log(id)

        // check if already selected if not then add to selected
        CellData.findOne({id:id}, (err,result) => {
            if (err) throw err;
            if (result.selected == false) { // if selected then unselect it
                CellData.update({id:id},{ $set: {selected:true}}).then(result => {
                    console.log(result)
                    // emit that cells have changed
                    CellData.find().then((doc) => {
                        io.emit('cells_changed', doc)
                    })
                 })
            } else if (result.selected == true) { // if selected then unselect it
                CellData.update({id:id},{ $set: {selected:false}}).then(result => {
                    console.log(result)
                    // emit that cells have changed
                    CellData.find().then((doc) => {
                        io.emit('cells_changed', doc)
                    })
                 })
            }
        })
        

        
    })
});

