const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3310 });

wss.on('connection', ws => {
    console.log("New client connected");

    ws.on("message", data => {
        console.log(`Client sent us: ${data}`);

        ws.send("Receive this browser");
    });

    ws.on("close", () => {
        console.log("Client has disconnected");
    });
});