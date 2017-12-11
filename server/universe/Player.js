import MovableObject from 'universe/MovableObject'

const VIEWPORT_WIDTH = 1400;
const VIEWPORT_HEIGHT = 1000;

const WIDTH = 50;
const HEIGHT = 50;

export default
class Player extends MovableObject {
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
            width: VIEWPORT_WIDTH,
            height: VIEWPORT_HEIGHT
        };
    }

    get object() {
        let obj = super.object;
        obj.score = this.score;
        return obj;
    }
}