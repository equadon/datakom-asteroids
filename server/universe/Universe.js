import Cow from 'universe/Cow'

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
        this.players = {};

        delay(1000).then(result => this.spawnCow());
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

    }
}
