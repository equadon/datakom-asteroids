import GameServer from 'GameServer'
import Cow from 'universe/Cow'
import CowUpdatePacket from 'packets/server/CowUpdatePacket'

function delay(delay, value) {
    return new Promise(resolve => setTimeout(resolve, delay, value));
}
/**
 * Expanding universe consisting of multiple zones.
 */
export default
class Universe {
    constructor(server) {
        this.server = server;
        this.width = 1024;
        this.height = 720;

        this.players = {};
        this.cows = {};

        this.spawnCow();
    }

    addPlayer(player) {
        this.players[player.id] = {
            id: player.id,
            x: player.x,
            y: player.y,
            angle: player.angle,
            velocity: player.velocity,
            acceleration: player.acceleration,
            angularVelocity: player.angularVelocity,
            angularAcceleration: player.angularAcceleration
        };
    }

    updatePlayer(player) {
        this.players[player.id] = player;
    }

    removePlayer(player) {
        delete this.players[player.id];
    }

    getPlayers() {
        let all = [];
        for (let id of Object.keys(this.players)) {
            all.push(this.players[id]);
        }
        return all;
    }

    spawnCow() {
        delay(1000).then(result => this.createCow());
    }

    createCow() {
        const x = GameServer.randomInt(50, this.width - 50);
        const y = GameServer.randomInt(50, this.height - 50);

        const cow = new Cow(Cow.getNextId(), x, y, 0);
        this.cows[cow.id] = cow;

        const sockets = this.server.io.sockets.connected;
        for (let s of Object.keys(sockets)) {
            let socket = sockets[s];
            new CowUpdatePacket(cow, true).send(socket);
        }
        console.log('spawned cow and sent to clients');

        this.spawnCow();
    }
}