const CIRCLE_THRESHOLD = 1.12;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export default
class StarFieldPlugin extends Phaser.Plugin {
    init(player, numLayers, numStars, radius, speed, bgColor=null, starColor=null) {
        this.active = true;
        this.visible = true;

        this.player = player;

        // Starfield configuration
        this.bgLayers = [];
        this.numBgLayers = numLayers;
        this.baseStarNum = numStars;
        this.baseStarRadius = radius;
        this.baseStarSpeed = speed;
        this.bgColor = bgColor;
        this.starColor = starColor || '#eeeeee';

        // Initialize star field
        this.bitmap = this.game.add.bitmapData(this.width, this.height);
        this.sprite = this.game.add.sprite(0, 0, this.bitmap);
        this.sprite.fixedToCamera = true;
        this.sprite.sendToBack();
        this.sprite.alpha = 0;

        for (let i = this.numBgLayers; i > 0; i--) {
            let stars = [];
            for (let j = 0; j < this.baseStarNum * i; j++) {
                let star = {
                    x: randomInt(0, this.width),
                    y: randomInt(0, this.height),
                    radius: Math.round(this.baseStarRadius / i * 100) / 100,
                    speed: {
                        x: Math.round(this.baseStarSpeed.x / i) / 100,
                        y: Math.round(this.baseStarSpeed.y / i) / 100,
                    }
                };
                stars.push(star);
            }
            this.bgLayers.push(stars);
        }
    }

    get width() {
        return this.game.width;
    }

    get height() {
        return this.game.height;
    }

    update() {
        const [velX, velY] = [this.player.body.velocity.x, this.player.body.velocity.y];

        if (velX != 0 || velY != 0) {
            for (let i = 0; i < this.bgLayers.length; i++) {
                for (let j = 0; j < this.bgLayers[i].length; j++) {
                    const star = this.bgLayers[i][j];

                    if (star.x >= 0 && star.x <= this.width && star.y >= 0 && star.y <= this.height) {
                        star.x -= velX * star.speed.x * this.game.time.physicsElapsed;
                        star.y -= velY * star.speed.y * this.game.time.physicsElapsed;
                    } else if (star.x > this.width) {
                        star.x = 1;
                        star.y = randomInt(0, this.height);
                    } else if (star.x < 0) {
                        star.x = this.width;
                        star.y = randomInt(0, this.height);
                    } else if (star.y > this.height) {
                        star.x = randomInt(0, this.width);
                        star.y = 1;
                    } else if (star.y < 0) {
                        star.x = randomInt(0, this.width);
                        star.y = this.height;
                    }
                }
            }
        }
    }

    render() {
        this.bitmap.clear();
        const ctx = this.bitmap.ctx;

        if (this.bgColor) {
            ctx.fillStyle = this.bgColor;
            ctx.strokeStyle = this.bgColor;
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.strokeRect(0, 0, this.width, this.height);
        }

        ctx.fillStyle = this.starColor;

        for (let i = 0; i < this.bgLayers.length; i++) {
            for (let j = 0; j < this.bgLayers[i].length; j++) {
                const star = this.bgLayers[i][j];

                if (star.radius >= CIRCLE_THRESHOLD) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.radius, 0, 2*Math.PI, false);
                    ctx.fill();
                } else {
                    const pixelSize = star.radius * 3;
                    ctx.fillRect(star.x, star.y, pixelSize, pixelSize);
                }
            }
        }
    }

    destroy() {
        this.bitmap.clear();
        this.bitmap = null;
        this.sprite.destroy();
    }
}