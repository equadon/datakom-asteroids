import Utility from 'Utility'
import LoginHandler from 'LoginHandler';
import PacketHandler from 'PacketHandler';
import BackupHandler from 'BackupHandler';
import ExpandingUniverse from 'universe/ExpandingUniverse'

export default
class GameServer {
    constructor(web, db) {
        this.__nextObjectId = 1;
        this.cows = [];
        this.io = require('socket.io')(web.server, {
            path: process.env.COWS_PATH,
            serveClient: false,
            pingInterval: 300000,
            pingTimeout: 50000,
            cookie: false
        });

        this.db = db;

        // initiate packet handler
        this.loginhandler = new LoginHandler(db);
        this.handler = new PacketHandler(this, this.db, this.loginhandler);
        this.backup = new BackupHandler(this, this.db);

        this.universe = new ExpandingUniverse(this);

        this.io.on('connection', (o) => this.onConnect(o));
    }

    uniqueObjectId() {
        return this.__nextObjectId++;
    }

    onConnect(socket) {
        socket.on('login-request', (data) => {
            this.handler.loginRequest(socket, data, () => {
                socket.on('game-update', (data) => {
                    this.handler.playerUpdate(socket, data);
                });

                socket.on('cow-update', (data) => {
                    this.handler.onCowUpdate(socket, data);
                });

                socket.on('disconnect', (reason) => {
                    this.onDisconnect(socket, reason);
                });

                // test
                Utility.delay(4000).then(result => socket.emit('game-stats', this.universe.stats));

                this.io.emit('game-stats', this.universe.stats);
            });

            socket.on('planet-collision', (data) => {
                this.handler.onPlanetCollision(socket, data);
            });
        });
    }

    onDisconnect(socket, reason) {
       // console.log('Client ' + socket.player.id + ' disconnected: ' + reason);
        this.loginhandler.logout(socket.player, () => {
            this.universe.removePlayer(socket.player);
            this.io.emit('game-stats', this.universe.stats);
        });
    }
}