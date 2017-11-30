import PacketHandler from 'PacketHandler'

export default
class GameServer {
    constructor(db) {
        this.server = require('http').createServer()
        this.io = require('socket.io')(this.server, {
            path: '/cows',
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false
        })

        this.db = db;

        // initiate packet handler
        this.handler = new PacketHandler(this, this.db);

        this.io.on('connection', (o) => this.onConnect(o));
    }

    start(port) {
        this.server.listen(port);
    }

    onConnect(socket) {
        socket.on('disconnect', (reason) => {
            this.onDisconnect(reason)
        });

        socket.on('login-request', (data) => {
            this.handler.loginRequest(socket, data);
        });
    }

    onDisconnect(reason) {
        console.log('Client disconnected: ' + reason);
    }
}
