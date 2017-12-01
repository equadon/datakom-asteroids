import Zone from 'universe/Zone'

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
        let zone = new Zone(this, this.nextZoneId++, x, y);

        this.zones.push(zone);
    }

    getZone(x, y) {
    }
}
