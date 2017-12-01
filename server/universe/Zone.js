/**
 * Zone that belongs to a universe which keeps track of client positions,
 * planets, cows, etc.
 */
export default
class Zone {
    constructor(universe, id, x, y, width, height) {
        this.universe = universe;
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.clients = [];

        this.generate();
    }

    /**
     * Generate random zone.
     */
    generate() {
        this.cows = [];
        this.planets = [];
    }
}