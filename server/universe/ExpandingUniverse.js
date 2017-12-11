import SpatialHash from 'universe/SpatialHash'

import CelestialBody from 'universe/CelestialBody'
import Player from 'universe/Player'
import Cow from 'universe/Cow'
import Utility from 'Utility'
import KMeans from 'KMeans'


export default
class ExpandingUniverse {
    constructor(server) {
        this.server = server;
        this.hash = new SpatialHash(1300);
        this.players = {};
        this.cows = {};
        this.celestial = {};

        this.createTestCows();

        for (let y = -5; y <= 5; y++) {
            for (let x = -5; x <= 5; x++) {
                if (!(x == 0 && y == 0)) {
                    this.populateZone(x, y);
                }
            }
        }

        this.kmeans = new KMeans();
        this.clusters = []; // coordinates to clusters of players
        this.updateClusters();
    }

    getObjects(player) {
        let objects = this.hash.query(player.viewport);
        let visible = [];
        for (let obj of objects) {
            if (obj.type == 'player' && obj.id in this.players) {
                visible.push(this.players[obj.id].object);
            } else if (obj.type == 'cow' && obj.id in this.cows) {
                visible.push(this.cows[obj.id].object);
            } else if (obj.id in this.celestial) {
                visible.push(this.celestial[obj.id].object);
            }
        }
        return visible;
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
        if (player != undefined) {
            this.hash.remove(player.hash, player.bounds);

            delete this.players[player.id];
        }
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

    respawnPlayer(player) {
        const x = Utility.randomInt(0, 500);
        const y = Utility.randomInt(0, 500);

        return [x, y];
    }

    createTestCows() {
        const cols = 100;
        const rows = 100;
        const space = 600;

        for (let r = -(rows / 2); r < (rows / 2); r++) {
            for (let c = -(cols / 2); c < (cols / 2); c++) {
                let x = space * c;
                let y = space * r;
                let xrand = Utility.randomInt(x - 200, x + 200);
                let yrand = Utility.randomInt(y - 200, y + 200);
                let cow = new Cow(this.server.uniqueObjectId(), xrand, yrand, 0, 1);
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

    addCelestialBody(obj) {
        this.celestial[obj.id] = obj;
        this.hash.add(obj.hash, obj.bounds);
    }

    /**
     * Populate a zone with celestial bodies.
     * @param x x coordinate of zone to populate
     * @param y y coordinate of zone to populate
     */
    populateZone(x, y) {
        const bounds = this.hash.cellBounds(x, y);

        const pCentralBody = Math.random();

        if (pCentralBody < 0.3) {
            // Star
            const star = CelestialBody.randomStar(this.server.uniqueObjectId(), bounds);
            this.addCelestialBody(star);
            this._populateStar(star, bounds);
        } else if (pCentralBody < 0.65) {
            // Lost planet
            const planet = CelestialBody.randomPlanet(this.server.uniqueObjectId(), bounds);
            this.addCelestialBody(planet);
            this._populatePlanet(planet, bounds);
        } else if (pCentralBody < 0.75) {
            // Black hole
            const blackHole = CelestialBody.randomBlackHole(this.server.uniqueObjectId(), bounds);
            this.addCelestialBody(blackHole);
            this._populateBlackHole(blackHole, bounds);
        } else {
            // Empty space
        }
    }

    _populateStar(star, bounds) {
        let probPlanet = 0.8;

        while (Math.random() < probPlanet) {
            let planet = CelestialBody.randomPlanet(this.server.uniqueObjectId(), bounds, star);
            this.addCelestialBody(planet);
            this._populatePlanet(planet, bounds);
            probPlanet = 0.85 * probPlanet;
        }
    }

    _populateBlackHole(blackHole, bounds) {
        let probPlanet = 0.2;

        while (Math.random() < probPlanet) {
            let planet = CelestialBody.randomPlanet(this.server.uniqueObjectId(), bounds, blackHole);
            this.addCelestialBody(planet);
            this._populatePlanet(planet, bounds);
            probPlanet = 0.25 * probPlanet;
        }
    }

    _populatePlanet(planet, bounds) {
        let probMoon = 0.3;

        while (Math.random() < probMoon) {
            let moon = CelestialBody.randomMoon(this.server.uniqueObjectId(), bounds, planet);
            this.addCelestialBody(moon);
            probMoon = 0.2 * probMoon;
        }
    }

    updateClusters() {
        let positions = [];
        for (let p of Object.values(this.players)) {
            positions.push([p.x, p.y]);
        }
        this.kmeans.cluster(positions, 2);

        let clusters = [];
        this.kmeans.centroids.forEach((centroid) => {
            let minDistance = Infinity;
            let minId = null;
            for (let i = 0; i < positions.length; i++) {
                let distance = Utility.euclidean(positions[i], centroid);
                if (distance < minDistance) {
                    minDistance = distance;
                    minId = i;
                }
            }
            if (minId != null) {
                clusters.push(positions[minId]);
            }
        });
        this.clusters = clusters;

        this.server.handler.clusterUpdate(this.clusters);

        Utility.delay(1000).then(result => this.updateClusters());
    }
}