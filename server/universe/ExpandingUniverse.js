import SpatialHash from 'universe/SpatialHash'

import Player from 'universe/Player'
import Cow from 'universe/Cow'
import Utility from 'Utility'


export default
class ExpandingUniverse {
    constructor(server) {
        this.server = server;
        this.hash = new SpatialHash(1000);
        this.players = [];
        this.cows = [];

        this.createTestCows();
    }

    createPlayer(socket) {
        const x = Utility.randomInt(0, 400);
        const y = Utility.randomInt(0, 400);
        const angle = Utility.randomInt(0, 359);

        let player = new Player(this.server.uniqueObjectId(), socket, x, y, angle, 0);

        this.hash.add(player.hash, player.bounds);

        this.players[player.id] = player;

        return player;
    }

    updatePlayer(data) {
        let player = this.players[data.id];
        const oldBounds = player.bounds;
        player = player.update(data);

        if (!Player.boundsEqual(oldBounds, player.bounds)) {
            this.hash.update(player.hash, oldBounds, player.bounds);
        }

        return player;
    }

    removePlayer(player) {
        this.hash.remove(player.hash, player.bounds);

        delete this.players[player.id];
    }

    getPlayers(player) {
        let objects = this.hash.query(player.viewport, (o) => o.type == 'player');
        let visible = [];
        for (let obj of objects) {
            if (obj.id in this.players) {
                visible.push(this.players[obj.id].object);
            }
        }

        return visible;
    }

    createTestCows() {
        for (let x = 0; x < 10; x++) {
            let cow = new Cow(this.server.uniqueObjectId(), x*400, 0, 0, 1);
            this.cows[cow.id] = cow;
            this.hash.add(cow.hash, cow.bounds);

            this.server.handler.sendCowUpdate(cow);
        }
    }

    removeCow(id) {
        let removedCow = undefined;

        if (this.cows[id] != undefined) {
            removedCow = this.cows[id];

            this.hash.remove(removedCow.hash, removedCow.bounds);
            delete this.cows[id];
        }

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