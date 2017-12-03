import GameObject from 'universe/GameObject'

export default
class Cow extends GameObject {
    constructor(id, x, y, angle) {
        super(id, x, y, angle, 0, 0, 0, 0);
    }
}