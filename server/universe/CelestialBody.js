import GameObject from 'universe/GameObject'

export default
class CelestialBody extends GameObject {
    constructor(id, type, x, y, mass, width, height) {
        super(id, type, x, y, 0, width, height);

        this.data.mass = mass;
    }

    get mass() {
        return this.data.mass;
    }
}