import HashBounds from 'hashbounds'

import Player from 'universe/Player'
import Cow from 'universe/Cow'
import Utility from 'Utility'


export default
class ExpandingUniverse {
    constructor(server) {
        this.server = server;
        this.hash = new HashBounds(10, 2, 150);
        this.players = [];
    }

    createPlayer(socket) {
        const x = Utility.randomInt(0, 400);
        const y = Utility.randomInt(0, 400);
        const angle = Utility.randomInt(0, 359);

        let player = new Player(this.server.uniqueObjectId(), socket, x, y, angle, 0);

        this.hash.insert(player, player.bounds);

        this.players[player.id] = player;

        return player;
    }

    updatePlayer(data) {
        let player = this.players[data.id].update(data);

        this.hash.update(player, player.bounds);
    }

    getPlayers() {
        let all = [];
        for (let id of Object.keys(this.players)) {
            all.push(this.players[id].object);
        }
        return all;
    }
}