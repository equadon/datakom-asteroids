import GameObject from 'universe/GameObject'

export default
class MovableObject extends GameObject {
    constructor(id, type, x, y, angle, velocity, acceleration, angularVelocity, angularAcceleration, width, height) {
        super(id, type, x, y, angle, width, height);

        this.data.vel = velocity;
        this.data.acc = acceleration;
        this.data.aVel = angularVelocity;
        this.data.aAcc = angularAcceleration;
    }

    get velocity() { return this.data.vel; }
    get acceleration() { return this.data.acc; }
    get angularVelocity() { return this.data.aVel; }
    get angularAcceleration() { return this.data.aAcc; }
}