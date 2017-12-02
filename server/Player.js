export default
class Player {
    constructor(id, x, y, angle) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.velocity = 0;
        this.acceleration = 0;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
    }

    setPos(x,y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }

    update(status) {
        this.x = status.x;
        this.y = status.y;
        this.angle = status.angle;
    }


    toObject() {
        player = {
            id: this.id,
            x: this.x,
            y: this.y,
            angle: this.angle
        };
        return player;
    }
}