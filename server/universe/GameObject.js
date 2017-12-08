export default
class GameObject {
    constructor(id, type, x, y, angle, width, height) {
        this.id = id;
        this.type = type;
        this.width = width;
        this.height = height;

        this.data = {};
        this.data.x = x;
        this.data.y = y;
        this.data.angle = angle;
    }

    get x() { return this.data.x; }
    get y() { return this.data.y; }
    get angle() { return this.data.angle; }

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
        obj.type = this.type;
        return obj;
    }

    static boundsEqual(b1, b2) {
        return b1.x == b2.x &&
               b1.y == b2.y &&
               b1.width == b2.width &&
               b1.height == b2.height;
    }
}
