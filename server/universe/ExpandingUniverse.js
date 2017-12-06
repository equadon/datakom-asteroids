import HashBounds from 'hashbounds'

import Player from 'universe/Player'
import Cow from 'universe/Cow'
import Utility from 'Utility'


export default
class ExpandingUniverse {
    constructor(server) {
        this.server = server;
        this.hash = new HashBounds(10, 4, 10000);
        this.players = [];
        this.cows = [];

        this.createTestCows();
    }

    createPlayer(socket) {
        const x = Utility.randomInt(0, 400);
        const y = Utility.randomInt(0, 400);
        const angle = Utility.randomInt(0, 359);

        let player = new Player(this.server.uniqueObjectId(), socket, x, y, angle, 0);

        this.hash.insert({ id: player.id }, player.bounds);

        this.players[player.id] = player;

        return player;
    }

    updatePlayer(data) {
        let player = this.players[data.id].update(data);

        this.hash.update({ id: player.id }, player.bounds);
    }

    removePlayer(player) {
        this.hash.delete({ id: player.id });

        delete this.players[player.id];
    }

    getPlayers() {
        let all = [];
        for (let id of Object.keys(this.players)) {
            all.push(this.players[id].object);
        }
        return all;
    }

    createTestCows() {
        for (let x = 0; x < 10; x++) {
            let cow = new Cow(this.server.uniqueObjectId(), x*400, 0, 0, 1);
            console.log('Adding cow: ' + cow.id);
            this.cows[cow.id] = cow;
            this.hash.insert({ id: cow.id }, cow.bounds);

            // this.server.handler.sendCowUpdate(cow);
        }
    }

    spawnCow() {}

    createCow() {}
    removeCow(id) {}
}