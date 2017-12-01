import Zone from 'universe/Zone'

const ZONE_WIDTH = 500;
const ZONE_HEIGHT = 500;

/**
 * Expanding universe consisting of multiple zones.
 */
export default
class Universe {
    constructor(server) {
        this.server = server;
        this.nextZoneId = 0;
        this.zones = [];

        this.expand();
    }

    expand() {
        this.zones.push(new Zone(this, this.nextZoneId++, x, y, ZONE_WIDTH, ZONE_HEIGHT));
    }
}
