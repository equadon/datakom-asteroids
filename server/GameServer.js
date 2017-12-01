import PacketHandler from 'PacketHandler';
import Player from 'Player';

export default
class GameServer {
    constructor(db) {
        this.lastPlayerID = 0;
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

        // initiate packet handler
        this.handler = new PacketHandler(this, this.db);

        this.io.on('connection', (o) => this.onConnect(o));
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

            socket.on('disconnect', (reason) => {
                this.onDisconnect(socket, reason);
            });
        });
    }

    onDisconnect(socket, reason) {
        console.log('Client ' + socket.player.id + ' disconnected: ' + reason);
        this.handler.userUpdate(socket.player, 0);
    }

    getPlayers() {
        let players = [];
        for (let id of Object.keys(this.io.sockets.connected)) {
            players.push(this.io.sockets.connected[id].player);
        }
        return players;
    }
}