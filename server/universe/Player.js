import GameObject from 'universe/GameObject'

export default
class Player extends GameObject {
    constructor(id, socket, x, y, angle) {
        super(id, x, y, angle, 0, 0, 0, 0);

        this.socket = socket;
        this.score = 0;
    }
}