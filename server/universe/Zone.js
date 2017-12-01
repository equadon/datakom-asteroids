const ZONE_WIDTH = 500;
const ZONE_HEIGHT = 500;

/**
 * Zone that belongs to a universe which keeps track of client positions,
 * planets, cows, etc.
 */
export default
class Zone {
    constructor(universe, id, x, y, width=ZONE_WIDTH, height=ZONE_HEIGHT) {
        this.universe = universe;
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.clients = [];

        Zone.generate();
    }

    /**
     * Generate random zone.
     */
    static generate() {
        this.cows = [];
        this.planets = [];
    }
}