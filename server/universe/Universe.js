import Player from 'universe/Player'
import Cow from 'universe/Cow'

import Utility from 'Utility'

const MAX_COWS = 5;

export default
class Universe {
    constructor(server) {
        this.server = server;
        this.width = 1024;
        this.height = 720;

        this.players = {};
        this.cows = {};

        this.spawnedCowCount = 0;

        this.spawnCow();
    }

    createPlayer(socket, id, x, y, angle, score) {
        const x_in = x ? x : Utility.randomInt(100, 400);
        const y_in = y ? y : Utility.randomInt(100, 400);
        const angle_in = angle ? angle : Utility.randomInt(0, 359);
        const score_in = score ? score : 0;

        let player = new Player(id, socket, x_in, y_in, angle_in, score_in);

        this.players[player.id] = player;

        return player;
    }

    updatePlayer(data) {
        let player = this.players[data.id];

        if (player == undefined) {
            console.warn("trying to update a non-existing player with data: " + data);
        } else {
            this.players[data.id].update(data);
        }
    }

    removePlayer(player) {
        delete this.players[player.id];
    }

    getPlayers() {
        let all = [];
        for (let id of Object.keys(this.players)) {
            all.push(this.players[id].object);
        }
        return all;
    }

    spawnCow() {
        if (this.spawnedCowCount < MAX_COWS) {
            this.spawnedCowCount++;
            Utility.delay(Utility.randomInt(800, 5000)).then(result => this.createCow());
        }
    }

    createCow() {
        const x = Utility.randomInt(50, this.width - 50);
        const y = Utility.randomInt(50, this.height - 50);

        const cow = new Cow(this.server.uniqueObjectId(), x, y, 0, 1);
        this.cows[cow.id] = cow;

        this.server.handler.sendCowUpdate(cow);

        this.spawnCow();
    }

    removeCow(id) {
        let removedCow = undefined;

        if (this.cows[id] != undefined) {
            removedCow = this.cows[id];

            delete this.cows[id];

            this.spawnedCowCount--;
        }

        this.spawnCow();

        return removedCow;
    }

    getCows() {
        let all = [];
        for (let id of Object.keys(this.cows)) {
            all.push(this.cows[id].object);
        }
        return all;
    }
}