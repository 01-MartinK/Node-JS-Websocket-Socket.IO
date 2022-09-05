// fill the buttons and inputs
var button_count = 12

var cell_container = document.querySelector('#jail_cell_container')

var i = 0
while (i < button_count) {
    var button = `<button onclick="buttonPressed(this)" class="not_active" id="${i}">Cell${i}</button>`
    cell_container.innerHTML += button
    i++;
}

var selected_cells = []

// Initialize socket and stuff
const socket = io.connect('http://localhost:3310')

// on connected to server
socket.on('connect', () => {
    console.log("Has connected to socket")

    // on received cells_changed
    socket.on('cells_changed', data => {
        // import data and update it
        console.log(data)
        selected_cells = data
        refresh_cells()
    })

    // emit a message test message
    socket.emit('message', 'test')
})

// on cell button pressed
function buttonPressed(e) {
    console.log(e.id)
    // check if socket connected
    if (socket.connected) {
        // emit cell change
        socket.emit('cell_selected', e.id)
    }    
}

// refresh the cells accordingly
function refresh_cells() {
    selected_cells.forEach(listing => {
        if (listing.selected) {
            document.getElementById(listing.id).classList.remove('not_active')
            document.getElementById(listing.id).classList.add('active')
        } else {
            document.getElementById(listing.id).classList.remove('active')
            document.getElementById(listing.id).classList.add('not_active')
        }
    })
}