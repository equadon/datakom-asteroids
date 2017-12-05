import GameObject from 'universe/GameObject'

const WIDTH = 50;
const HEIGHT = 50;

export default
class Player extends GameObject {
    constructor(id, socket, x, y, angle, score) {
        super(id, x, y, angle, 0, 0, 0, 0, WIDTH, HEIGHT);

        this.socket = socket;
        this.score = score || 0;
    }
}