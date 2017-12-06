export default
class GameObject {
    constructor(id, x, y, angle, velocity, acceleration, angularVelocity, angularAcceleration) {
        this.id = id;

        this.data = {};
        this.data.x = x;
        this.data.y = y;
        this.data.angle = angle;
        this.data.velocity = velocity;
        this.data.acceleration = acceleration;
        this.data.angularVelocity = angularVelocity;
        this.data.angularAcceleration = angularAcceleration;
    }

    get x() { return this.data.x; }
    get y() { return this.data.y; }
    get angle() { return this.data.angle; }
    get velocity() { return this.data.velocity; }
    get angularVelocity() { return this.data.angularVelocity; }
    get angularAcceleration() { return this.data.angularAcceleration; }

    update(status) {
        delete status.id;
        this.data = status;
    }

    get object() {
        let obj = this.data;
        obj.id = this.id;
        return obj;
    }
}
