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
            pingInterval: 10000,
            pingTimeout: 5000,
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
        socket.on('disconnect', (reason) => {
            this.onDisconnect(reason);
        });

        socket.on('login-request', (data) => {
            this.handler.loginRequest(socket, data);

            this.initializePlayer(socket);

            socket.on('update', (data) => {
                this.handler.updateRequest(socket, data);
            });

        });
    }

    initializePlayer(socket) {
        //Create the new player
        socket.player = new Player(this.lastPlayerID++, 0, 0, 0);

        //Send id to client
        //socket.emit('newplayer', socket.player);

        //Send game state to client
        this.handler.playerInit();
        console.log('Player ' + socket.player.id + ' has joined!');
    }

    onDisconnect(reason) {
        console.log('Client disconnected: ' + reason);
    }

    getPlayer(id) {
        return this.loggedInPlayers[id];
    }

    getState() {
        return {
            players: this.getAllPlayers(),
            cows: this.server.getCows()
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