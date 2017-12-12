import GameClient from 'network/GameClient'
import StarFieldPlugin from 'StarFieldPlugin'

const BG_STAR_LAYERS = 12;
const BG_STAR_COUNT = 16;
const BG_STAR_RADIUS = 2.0;
const BG_STAR_SPEED = {
    x: 30,
    y: 30
};

export default
class PlayState extends Phaser.State {

    init(login) {
        this.login = login;
        this.client = new GameClient();
        this.stars = null;

        this.client.on('game-update', (obj) => {
            this.onUpdateResponse(obj)
        });
        this.client.on('user-update', (obj) => {
            this.onUserUpdate(obj)
        });

        this.client.on('score-update', (obj) => {
            this.onScoreUpdate(obj);
        });
        this.client.on('cluster-update', (obj) => {
            this.onClusterUpdate(obj);
        });

        this.client.on('planet-collision', (obj) => {
            this.onFail(obj);
        });

        this.game.stage.disableVisibilityChange = true;
        this.game.physics.arcade.skipQuadTree = true;
        this.physics.arcade.skipQuadTree = true;

        // Disable window scrolling when window is smaller than the game area
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);
    }

    preload() {

        this.game.load.audio('mainmusic', 'images/game-music.mp3');
        this.game.load.audio('cow-sound', 'images/cowshort.mp3');
        this.load.image('ship', 'images/rocket-green-flames.png'); //OBS
        this.load.image('cow', 'images/Ko2.png');
        this.load.image('planet', 'images/planet.png');
        this.load.image('star1', 'images/star1.png');
        this.load.image('sun', 'images/sun.png');
        this.load.image('planet1', 'images/planet1.png');
        this.load.image('planet2', 'images/planet2.png');
        this.load.image('planet3', 'images/planet3.png');
        this.load.image('planet4', 'images/planet4.png');
        this.load.image('planet7', 'images/planet7.png');
        this.load.image('planet8', 'images/planet8.png');
        this.load.image('planet9', 'images/planet9.png');
        this.load.image('planet10', 'images/planet10.png');
        this.load.image('planet11', 'images/planet11.png');
        this.load.image('moon1', 'images/moon1.png');
        this.load.image('moon2', 'images/moon2.png');
        this.load.image('blackHole1', 'images/blackhole.png');
        this.load.image('arrow', 'images/arrow.png');
        this.game.load.spritesheet('rocket_flame', '/images/rocket-animation-horizontal.png', 250, 176);
        this.load.image('arrow', 'images/arrow.png');
        this.load.spritesheet('connect', '/images/connecting.png', 100, 61);
        this.load.bitmapFont('cabin-bold-48', '/images/cabin-bold-48.PNG', '/images/cabin-bold-48.fnt');
        this.load.bitmapFont('cabin-bold-24', '/images/cabin-bold-24.PNG', '/images/cabin-bold-24.fnt');

        this.client.on('connect', (obj) => {
            this.onConnect(obj)
        });
        this.client.on('disconnect', (obj) => {
            this.onDisconnect(obj)
        });
    }

    //Vi kommer ha ett spelar-id som kopplas till ens användare. Som lagras i databasen.

    create() {

        //Add musics
        this.music = this.game.add.audio('mainmusic');
        this.music.play();
        this.music.loopFull();

        this.cowsound = this.game.add.audio('cow-sound');
        this.cowsound.volume = 0.3;


        //Camera config
        this.game.camera.bounds = null;

        //Group of ship objects
        this.playerMap = {};

        //Group of cow objects
        this.cowMap = {};
        this.cows = this.game.add.group();

        this.celestialMap = {};
        this.celestial = this.game.add.group();

        this.arrows = this.game.add.group();

        //Timers
        this.maxTime = 0.1;
        this.updateServer = this.maxTime;

        this.scoreTitle = this.game.add.bitmapText(this.game.width, 0, 'cabin-bold-24', 'Score: ', 24);
        this.scoreTitle.position.x = this.game.width - this.scoreTitle.width - 20;
        this.scoreTitle.position.y = this.scoreTitle.height + 5;
        this.scoreTitle.fixedToCamera = true;
        this.scoreTitle.anchor.setTo(0.5, 0.5);

        this.playerScore = 0;

        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.input.keyboard.onUpCallback = (e) => this.onKeyUp(e);

        this.onLoginResponse(this.login);
    }

    onKeyUp(e) {
        if (e.keyCode == Phaser.Keyboard.S) {
            this.toggleStars();
        } else if (e.keyCode == Phaser.Keyboard.F) {
            if (this.game.scale.isFullScreen) {
                this.game.scale.stopFullScreen();
                this.game.transparent = true;
                this.game.stage.backgroundColor = null;
            } else {
                this.game.transparent = false;
                this.game.stage.backgroundColor = '#631375';
                this.game.scale.startFullScreen(false);
            }
        }
    }

    //Spawn functions
    spawnCow(id, x, y) {
        let cow = this.add.sprite(x, y, 'cow');
        cow.alpha = 0;
        var tween = this.game.add.tween(cow).to({
            alpha: 1
        }, 500, "Linear", true);
        tween.repeat(3, 0.5);
        this.cows.add(cow);
        this.cowMap[id] = cow;
        cow.scale.setTo(0.35, 0.35);

        cow.id = id;
        this.physics.arcade.enable(cow);
        cow.anchor.setTo(0.5, 0.5);
        cow.body.angularVelocity = 5;
    }

    spawnPlayer(id, x, y, v) {

        let ship = this.add.sprite(x, y, 'rocket_flame');

        ship.id = id;

        //Adding animation on ship
        var flames = ship.animations.add('flames');

        //Adding ship to group
        this.playerMap[id] = ship;

        //Scale and angle ship
        let scale = 0.35;
        ship.scale.setTo(scale, scale);
        ship.anchor.setTo(0.7, 0.5);
        //ship.angle = v;
        ship.mass = 100;

        //Enable physics on ship
        this.physics.arcade.enable(ship);
        ship.body.maxVelocity = new Phaser.Point(350, 350);

        //Set hitbox
        ship.body.setCircle(80, 88, 0);

        return ship;
    }

    //If this client collides on a cow.
    collideCow(player, cow) {
        console.log("Got cow!");
        if (player.key.includes('cow')) {
            this.cowsound.play();
            player.pendingDestroy = true;
            console.log("collision with cow id:nr" + player.id);
            this.client.gotCow(player.id);
        } else if (cow.key.includes('cow')) {
            this.cowsound.play();
            cow.pendingDestroy = true;
            console.log("cow id " + cow.id);
            this.client.gotCow(cow.id);
        }
    }

    //If this client collides on a cow.
    collidePlanet(player, planet) {
        console.log("Crashed!");
        this.client.planetCollision();
    }




    calculateGravity(planets, player) {

        let planetsArray = planets.getAll();
        let total_a_x = 0;
        let total_a_y = 0;

        for (let planet of planetsArray) {
            let distance = Phaser.Math.distance(player.x, player.y, planet.x, planet.y);
            let a_x = 0;
            let a_y = 0;

            if (distance < (planet.mass)/10000) {
                let angle = Phaser.Math.angleBetween(player.x, player.y, planet.x, planet.y);
                a_x = Math.cos(angle) * (planet.mass / (distance * distance));
                a_y = Math.sin(angle) * (planet.mass / (distance * distance));
            }

            total_a_x += a_x;
            total_a_y += a_y;
        }

        return [total_a_x, total_a_y];
    }

    deletePlayer(id) {
        this.playerMap[id].destroy();
        delete this.playerMap[id];
    }

    deleteCow(id) {
        for (let cow of this.cows.children) {
            if (cow.id == id) {
                cow.pendingDestroy = true;
                delete this.cowMap[id];
            }
        }
    }

    spawnCelestial(id, type, x, y, mass, radius) {
        let celestial = this.add.sprite(x, y, type);
        //celestial.scale.setTo(0.35, 0.35);

        celestial.id = id;
        celestial.mass = mass;
        celestial.type = type;
        this.physics.arcade.enable(celestial);
        celestial.anchor.setTo(0.5, 0.5);
        celestial.body.immovable = true;
        celestial.body.setCircle(celestial.height / 2);

        this.celestial.add(celestial);
        this.celestialMap[id] = celestial;
    }

    deleteCelestial(id) {
        for (let body of this.celestial.children) {
            if (body.id == id) {
                body.pendingDestroy = true;
                delete this.celestialMap[id];
            }
        }
    }

    //Client-Server functions
    onConnect() {
        console.log('Client connected');
    }

    onDisconnect() {
        console.log('Client disconnected');
        this.stars.destroy();
        this.game.state.start('Disconnected', true, false, null);
    }

    //Spawn
    //login.players = array with player id:s
    onLoginResponse(login) {
        if (login.success) {
            this.player = this.spawnPlayer(login.id, login.x, login.y, login.angle);
            this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

            this.toggleStars();
        }
    }

    toggleStars() {
        if (this.stars == null) {
            this.stars = this.game.plugins.add(StarFieldPlugin, this.player, BG_STAR_LAYERS,
                                               BG_STAR_COUNT, BG_STAR_RADIUS, BG_STAR_SPEED);
            this.game.add.tween(this.stars.sprite).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);
        } else {
            let t = this.game.add.tween(this.stars.sprite).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
            t.onComplete.add(() => {
                this.game.plugins.remove(this.stars, true);
                this.stars = null;
            }, this);
        }
    }

    //Update the position of all ships and add flames if they are accelerating
    // TODO: Add new players/cows/planets and remove those no longer in the list
    onUpdateResponse(data) {
        //console.log('update response:' + data);
        this.updateObjects(data.objects);
    }

    /**
     * Spawn or delete Player
     * @param data Data with login information, id and type. type: 1 = CONNECTED, 0 = DISCONNECTED
     */

    onUserUpdate(data) {
        if (data.type == 'connect') {
            //console.log('Spawn player id ' + data.id);
            this.spawnPlayer(data.id, data.x, data.y, data.angle);
        } else if (data.type == 'disconnect') {
            console.log('id in log-out' + data.id);
            this.deletePlayer(data.id);
        } else {
            console.log("ERROR in user update");
        }

    }

    onFail(data) {
        this.player.x = data.x;
        this.player.y = data.y;
        this.playerScore = data.score;
    }

    onScoreUpdate(data) {
        this.playerScore = data.score;
        console.log('received score: ' + data.score);
    }

    onClusterUpdate(data) {
        const camBounds = new Phaser.Rectangle(this.camera.x, this.camera.y, this.camera.width, this.camera.height);

        if (this.player != undefined) {
            // Clear old arrows
            this.arrows.removeAll();

            for (let [tX, tY] of data.clusters) {
                if (!camBounds.contains(tX, tY)) {
                    let arrow = this.game.add.sprite(this.game.world.centerX,
                        this.game.world.centerY, 'arrow');
                    arrow.anchor.setTo(1.0, 0.0);
                    arrow.fixedToCamera = true;
                    arrow.target = [tX, tY];

                    this.updateArrow(arrow);

                    this.arrows.add(arrow);
                }
            }
        }
    }

    updateArrow(arrow) {
        if (this.player != undefined) {
            // arrow.rotation = this.physics.arcade.angleToXY(this.player, targetX, targetY);
            const tX = arrow.target[0] - this.player.x;
            const tY = arrow.target[1] - this.player.y;

            const scaling = Math.min(this.camera.width / 2, this.camera.height / 2) / Math.sqrt(tX * tX + tY * tY);

            const camX = scaling * tX;
            const camY = scaling * tY;

            const offX = camX + this.camera.width / 2;
            const offY = camY + this.camera.height / 2;

            arrow.rotation = this.physics.arcade.angleToXY(this.player, arrow.target[0], arrow.target[1]);
            arrow.cameraOffset.setTo(offX, offY);
        }
    }

    update() {
        this.scoreTitle.setText(`Score: ${this.playerScore}`);

        if (this.player == undefined) {
            return;
        }

        this.game.physics.arcade.collide(this.player, this.cows, this.collideCow, null, this);
        this.game.physics.arcade.collide(this.player, this.celestial, this.collidePlanet, null, this);

        //Rotations
        if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            //  Move to the left
            this.player.body.angularVelocity = -200;
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            //  Move to the right
            this.player.body.angularVelocity = 200;
        } else {
            this.player.body.angularVelocity = 0;
        }

        //Acceleration
        if (this.input.keyboard.isDown(Phaser.Keyboard.UP)) {

            // Add forward acceleration
            this.physics.arcade.accelerationFromRotation(this.player.rotation, 500, this.player.body.acceleration);
            //Starting flame animation
            this.player.animations.play('flames', 30, true);
            let [a_x, a_y] = this.calculateGravity(this.celestial, this.player);
            this.player.body.acceleration.x += a_x;
            this.player.body.acceleration.y += a_y;

        }
        /*else if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                   // Add backward acceleration (Mostly for testing)
                   this.physics.arcade.accelerationFromRotation(this.player.rotation, -300, this.player.body.acceleration);
                   this.player.animations.play('flames', 30, true);


               }*/
        else if (this.player != undefined) {

            let [total_a_x, total_a_y] = this.calculateGravity(this.celestial, this.player);
            this.player.body.acceleration.x = total_a_x;
            this.player.body.acceleration.y = total_a_y;

            //Stopping animation
            this.player.animations.stop(null, true);

        }

        // Update arrows
        for (let arrow of this.arrows.children) {
            this.updateArrow(arrow);
        }

        //Update timer
        this.updateServer -= this.game.time.physicsElapsed;
        //Update server on position, angle and velocity of ship every 0.1 seconds
        if (this.updateServer <= 0) {
            this.updateServer = this.maxTime;
            this.client.update(this.player);
        }
    }

    /**
     * Update client's object list.
     * @param cows Array of cow objects
     */
    updateObjects(objects) {
        let existingPlayers = Object.keys(this.playerMap);
        let updatedPlayers = [];
        let existingCows = Object.keys(this.cowMap);
        let updatedCows = [];
        let existingCelestial = Object.keys(this.celestialMap);
        let updatedCelestial = [];

        // Add new objects
        for (let obj of objects) {
            if (obj.type == 'player') {
                if (obj.id != this.player.id) {
                    if (existingPlayers.includes(obj.id + '')) {
                        let ship = this.playerMap[obj.id];
                        ship.x = obj.x;
                        ship.y = obj.y;
                        ship.angle = obj.angle;
                        ship.body.velocity = obj.vel;
                        ship.body.acceleration = obj.acc;
                        ship.body.angularVelocity = obj.aVel;
                        ship.body.angularAcceleration = obj.aAcc;
                        if (ship.body.acceleration.x > 0 || ship.body.acceleration.y > 0) {
                            ship.animations.play('flames', 30, true);
                        } else if (ship.body.acceleration.x == 0 && ship.body.acceleration.y == 0) {
                            ship.animations.stop(null, true);
                        }
                    } else {
                        console.log('adding new player: ' + obj.id);
                        this.spawnPlayer(obj.id, obj.x, obj.y, obj.angle, obj.radius);
                    }
                } else {
                    this.playerScore = obj.score;
                }
                updatedPlayers.push(obj.id + '');
            } else if (obj.type == 'cow') {
                if (!existingCows.includes(obj.id + '')) {
                    this.spawnCow(obj.id, obj.x, obj.y);
                }
                updatedCows.push(obj.id + '');
            } else {
                0
                if (!existingCelestial.includes(obj.id + '')) {
                    this.spawnCelestial(obj.id, obj.type, obj.x, obj.y, obj.mass, obj.radius);
                }
                updatedCelestial.push(obj.id + '');
            }
        }

        // Remove players that are no longer visible
        let invisible = Object.keys(this.playerMap).filter((i) => {
            return updatedPlayers.indexOf(i) < 0;
        });
        for (let id of invisible) {
            this.deletePlayer(id);
        }

        // Remove cows that are no longer visible
        invisible = Object.keys(this.cowMap).filter((i) => {
            return updatedCows.indexOf(i) < 0;
        });
        for (let id of invisible) {
            this.deleteCow(id);
        }

        // Remove celestial bodies that are no longer visible
        invisible = Object.keys(this.celestialMap).filter((i) => {
            return updatedCelestial.indexOf(i) < 0;
        });
        for (let id of invisible) {
            this.deleteCelestial(id);
        }
    }

    render() {
        if (DEBUG) {
            let start = 130;
            if (this.player != undefined) {
                this.game.debug.spriteInfo(this.player, 32, 32);
                this.game.debug.cameraInfo(this.game.camera, 432, 32);
                this.game.debug.text('acceleration: ' + this.player.body.acceleration, 30,
                    start += 20);
                this.game.debug.text('velocity: ' + this.player.body.velocity, 30, start += 20);
                this.game.debug.text('angularvelocity: ' + this.player.body.angularVelocity, 30,
                    start += 20);
                this.game.debug.text('id: ' + this.player.id, 30, start += 20);
                this.game.debug.text('cows: ' + Object.keys(this.cowMap).length, 30, start += 20);
                this.game.debug.text('players: ' + Object.keys(this.playerMap).length, 30,
                    start += 20);
                this.game.debug.text('celestial bodies: ' + Object.keys(this.celestialMap).length,
                    30, start += 20);

                /*
                this.game.debug.body(this.player);

                for (let planet of this.celestial.getAll()) {
                    this.game.debug.body(planet);
                }

                for (let cow of this.cows.getAll()) {
                    this.game.debug.body(cow);
                }
                */
            }
        }
    }
}