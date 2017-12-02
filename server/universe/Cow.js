import GameObject from 'universe/GameObject'

let nextCowId = 0;

export default
class Cow extends GameObject {
    constructor(id, x, y, angle) {
        super(id, x, y, angle, 0, 0, 0, 0);
    }

    static getNextId() {
        return nextCowId++;
    }
}