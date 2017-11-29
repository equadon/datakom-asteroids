import PacketHandler from 'PacketHandler';

export default
class GameServer {
    constructor() {
        this.lastPlayerID = 0;
        this.server = require('http').createServer();
        this.io = require('socket.io')(this.server, {
            path: '/cows',
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false
        });

        // initiate packet handler
        this.handler = new PacketHandler(this);

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
            this.managePlayer(socket);

        });
    }

    initializePlayer(socket) {
        players = getAllPlayers();
        socket.emit('allplayers', players);

        //Add the new player
        socket.player = {
            id: server.lastPlayerID++,
            x: data.x,
            y: data.y,
            angle: data.angle
        };

        //Send id to client
        socket.emit('newplayer', socket.player);
        console.log('Player ' + socket.player.id + ' has joined!');
        socket.broadcast.emit('addplayer', socket.player);
    }

    managePlayer(socket) {
        socket.on('move', function (data) {
            socket.player.x = data.x;
            socket.player.y = data.y;
            socket.player.angle = data.angle;
        });

        socket.on('update', function () {
            socket.emit('update', getAllPlayers());
        });

    }

    onDisconnect(reason) {
        console.log('Client disconnected: ' + reason);
    }


    getAllPlayers() {
        var players = [];
        Object.keys(this.io.sockets.connected).forEach(function (socketID) {
            var player = this.io.sockets.connected[socketID].player;
            if (player) players.push(player);
        });
        return players;
    }

    randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

}