export default
class GameObject {
    constructor(id, type, x, y, angle, velocity, acceleration, angularVelocity, angularAcceleration, width, height) {
        this.id = id;
        this.type = type;
        this.width = width;
        this.height = height;

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

        return this;
    }

    get hash() {
        return {
            id: this.id,
            type: this.type
        };
    }

    get bounds() {
        return {
            x: this.data.x,
            y: this.data.y,
            width: this.width,
            height: this.height
        };
    }

    get object() {
        let obj = this.data;
        obj.id = this.id;
        return obj;
    }

    get hash() {
        return {
            id: this.id
        }
    }
}
