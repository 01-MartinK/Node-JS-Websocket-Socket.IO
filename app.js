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

socket.on('connect', () => {
    console.log("Has connected to socket")

    socket.on('cells_changed', data => {
        console.log(data)
        selected_cells = data
        refresh_cells()
    })

    socket.emit('message', 'test')
})

function buttonPressed(e) {
    console.log(e.id)
    if (socket.connected) {
        socket.emit('cell_selected', e.id)
    }    
}

function refresh_cells() {
    selected_cells.forEach(id => {
        document.getElementById(id).classList.remove('not_active')
        document.getElementById(id).classList.add('active')
    })
}