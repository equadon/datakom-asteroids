export default
class GameObject {
    constructor(id, x, y, angle, velocity, acceleration, angularVelocity, angularAcceleration) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.angularVelocity = angularVelocity;
        this.angularAcceleration = angularAcceleration;
    }

    update(status) {
        this.x = status.x || this.x;
        this.y = status.y || this.y;
        this.angle = status.angle || this.angle;
        this.velocity = status.velocity || this.velocity;
        this.acceleration = status.acceleration || this.acceleration;
        this.angularVelocity = status.angularVelocity || this.angularVelocity;
        this.angularAcceleration = status.angularAcceleration || this.angularAcceleration;
    }

    toObject() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            angle: this.angle,
            velocity: this.velocity,
            acceleration: this.acceleration,
            angularVelocity: this.angularVelocity,
            angularAcceleration: this.angularAcceleration
        };
    }
}
