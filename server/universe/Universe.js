/**
 * Expanding universe consisting of multiple zones.
 */
export default
class Universe {
    constructor(server) {
        this.server = server;
        this.players = {};
    }

    addPlayer(player) {
        this.players[player.id] = {
            id: player.id,
            x: player.x,
            y: player.y,
            angle: player.angle,
            velocity: player.velocity
        };
    }

    updatePlayer(player) {
        this.players[player.id] = player;
    }

    removePlayer(player) {
        this.players[player.id] = undefined;
    }

    getPlayers() {
        let all = [];
        for (let id of Object.keys(this.players)) {
            all.push(this.players[id]);
        }
        return all;
    }
}
