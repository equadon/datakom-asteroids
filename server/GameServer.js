import PacketHandler from 'PacketHandler';
import Universe from 'universe/Universe'

export default
class GameServer {
    constructor(db) {
        this.__nextObjectId = 1;
        this.cows = [];
        this.server = require('http').createServer();
        this.io = require('socket.io')(this.server, {
            path: '/cows',
            serveClient: false,
            pingInterval: 300000,
            pingTimeout: 50000,
            cookie: false
        });

        this.db = db;
        this.universe = new Universe(this);

        // initiate packet handler
        this.handler = new PacketHandler(this, this.db);

        this.io.on('connection', (o) => this.onConnect(o));
    }

    uniqueObjectId() {
        return this.__nextObjectId++;
    }

    start(port) {
        this.server.listen(port);
    }

    onConnect(socket) {
        socket.on('login-request', (data) => {
            this.handler.loginRequest(socket, data);

            socket.on('game-update', (data) => {
                this.handler.gameUpdate(socket, data);
            });

            socket.on('cow-update', (data) => {
                this.handler.cowUpdate(socket, data);
            });

            socket.on('disconnect', (reason) => {
                this.onDisconnect(socket, reason);
            });
        });
    }

    onDisconnect(socket, reason) {
        console.log('Client ' + socket.player.id + ' disconnected: ' + reason);
        this.handler.userUpdate(socket.player, 0);
        this.universe.removePlayer(socket.player);
    }

    static randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }
}