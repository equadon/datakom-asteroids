import PacketHandler from 'PacketHandler';
import Player from 'Player';

export default
class GameServer {
    constructor(db) {
        this.lastPlayerID = 0;
        this.loggedInPlayers = {};
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

            this.handler.playerInit(socket);

            socket.on('update', (data) => {
                this.handler.updateRequest(socket, data);
            });

            socket.on('disconnect', (reason) => {
                this.onDisconnect(socket, reason);
            });
        });
    }

    onDisconnect(socket, reason) {
        console.log('Client ' + socket.player.id + ' disconnected: ' + reason);
       // delete loggedInPlayers[socket.player.id];
        this.handler.userUpdate(socket.player, 0);
    }

    getPlayer(id) {
        return this.loggedInPlayers[id];
    }

    getState() {
        return {
            players: this.loggedInPlayers,
            cows: this.server.cows
        };
    }


    getAllPlayers() {
        var players = [];
        let _this = this;
        Object.keys(this.io.sockets.connected).forEach(function (socketID) {
            var player = _this.io.sockets.connected[socketID].player;
            if (player) players.push(player);
        });
        return players;
    }

    randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

}