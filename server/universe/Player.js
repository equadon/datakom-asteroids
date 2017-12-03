import GameObject from 'universe/GameObject'

export default
class Player extends GameObject {
    constructor(id, socket, x, y, angle, score) {
        super(id, x, y, angle, 0, 0, 0, 0);

        this.socket = socket;
        this.score = score || 0;
    }
}