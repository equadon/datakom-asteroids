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

    createPlayer(socket, dbId=null, x=null, y=null, angle=null, score=null) {
        x = x || Utility.randomInt(0, 400);
        y = y || Utility.randomInt(0, 400);
        angle = angle || Utility.randomInt(0, 359);

        let player = new Player(this.server.uniqueObjectId(), socket, x, y, angle, score || 0, dbId);

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
        const cols = 100;
        const rows = 100;
        const space = 400;

        for (let x = -(cols / 2); x < (cols / 2); x++) {
            for (let y = -(rows / 2); y < (rows / 2); y++) {
                let cow = new Cow(this.server.uniqueObjectId(), space * x, space * y, 0, 1);
                this.cows[cow.id] = cow;
                this.hash.add(cow.hash, cow.bounds);
            }
        }
        console.log('Successfully created ' + (cols * rows) + ' cow(s)');
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

    getCows(player) {
        let objects = this.hash.query(player.viewport, (o) => o.type == 'cow');
        let visible = [];
        for (let obj of objects) {
            if (obj.id in this.cows) {
                visible.push(this.cows[obj.id].object);
            }
        }
        return visible;
    }
}