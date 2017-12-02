import GameObject from 'universe/GameObject'

export default
class Player extends GameObject {
    constructor(id, x, y, angle) {
        super(id, x, y, angle, 0, 0, 0, 0);
    }
}