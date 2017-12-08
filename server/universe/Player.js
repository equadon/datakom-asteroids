import GameObject from 'universe/GameObject'

const VIEWPORT_WIDTH = 1000;
const VIEWPORT_HEIGHT = 1000;

const WIDTH = 50;
const HEIGHT = 50;

export default
class Player extends GameObject {
    constructor(id, socket, x, y, angle, score, dbId) {
        super(id, 'player', x, y, angle, 0, 0, 0, 0, WIDTH, HEIGHT);

        this.dbId = dbId;
        this.socket = socket;
        this.score = score;
    }

    get viewport() {
        return {
            x: this.x - VIEWPORT_WIDTH / 2,
            y: this.y - VIEWPORT_HEIGHT / 2,
            width: this.x + VIEWPORT_WIDTH,
            height: this.y + VIEWPORT_HEIGHT
        };
    }
}