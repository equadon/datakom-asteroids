import GameClient from 'network/GameClient'


export default
class PlayState extends Phaser.State {

    init() {
        this.game.stage.disableVisibilityChange = true;

        // Disable window scrolling when window is smaller than the game area
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);
    }

    preload() {
        this.client = new GameClient();
        this.load.image('ship', 'images/rocket-green-flames.png'); //OBS
        this.load.image('cow', 'images/Ko2.png');
        this.game.load.spritesheet('ship_animated', 'images/rocket-animation-horizontal.png', 251, 176);
        this.load.image('planet','images/planet.png');
        this.client.on('connect', (obj) => {this.onConnect(obj) });
        this.client.on('disconnect', (obj) => {this.onDisconnect(obj) });
	}

	//Vi kommer ha ett spelar-id som kopplas till ens användare. Som lagras i databasen.

	create() {



        this.game.stage.backgroundColor = "#151A38";

        //Group of ship objects
        this.playerMap = {};

        //Group of cow objects
        this.cowMap = {};
        this.cows = this.game.add.group();


        //Planets
        this.planets = this.game.add.group();
        this.spawnPlanet(1, 550, 400, 1);
        this.spawnPlanet(2, 350, 200, 0.5);


        //Timers
        this.maxTime = 0.1;
        this.updateServer = this.maxTime;

        let textStyle = {font: "16px Arial", fill: "#ffffff", align: "center"};
        this.scoreTitle = this.game.add.text(this.game.width * 0.8, 30, "SCORE: ", textStyle);
        this.scoreTitle.fixedToCamera = true;
        this.scoreTitle.anchor.setTo(0.5, 0.5);

        this.scoreValue = this.game.add.text(this.game.width * 0.9, 30, "0", textStyle);
        this.scoreValue.fixedToCamera = true;
        this.scoreValue.anchor.setTo(0.5, 0.5);

        this.playerScore=0;


        //Client on server
        this.client.on('login-response', (obj) => {
            this.onLoginResponse(obj)
        });
        this.client.on('game-update', (obj) => {
            this.onUpdateResponse(obj)
        });
        this.client.on('user-update', (obj) => {
            this.onUserUpdate(obj)
        });

        this.client.on('cow-update', (obj) => {
            this.onCowUpdate(obj)
        });

        this.client.on('score-update', (obj) => {
            this.onScoreUpdate(obj);
        });

        this.client.login('admin', '123');
    }

    //Spawn functions
    spawnCow(id, x, y) {
	    let cow = this.add.sprite(x, y, 'cow');
        cow.alpha=0;
        var tween = this.game.add.tween(cow).to( { alpha: 1 }, 500, "Linear", true);
        tween.repeat(3, 0.5);
        this.cows.add(cow);
	    this.cowMap[id] = cow;
        cow.scale.setTo(0.35, 0.35);

	    cow.id = id;
        this.physics.arcade.enable(cow);
        cow.anchor.setTo(0.5, 0.5);
        cow.body.angularVelocity = 5;
    }


    spawnPlanet(id, x, y, s) {
        let planet = this.add.sprite(x, y, 'planet');
        planet.anchor.setTo(0.5, 0.5);
        this.physics.arcade.enable(planet);
        planet.g = 200*s;
        planet.id = id;
        planet.scale.setTo(s, s);
        planet.mass = 50000*s;
        planet.body.immovable = true;
        planet.body.setCircle(84);
        this.planets.add(planet);
    }

    spawnPlayer(id, x, y, v) {

        let ship = this.add.sprite(x, y, 'ship_animated');
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
        ship.body.maxVelocity = new Phaser.Point(250, 250);
        ship.body.drag = new Phaser.Point(30,30);
        ship.body.collideWorldBounds=true;

        //Set hitbox
        ship.body.setCircle(80, 88, 0);

        return ship;
    }

    //If this client collides on a cow.
    collideCow(player, cow) {
        console.log("Got cow!");
        if (player.key.includes('cow')) {
            player.pendingDestroy = true;
            console.log("collision with cow id:nr" + player.id);
            this.client.gotCow(player.id);
        }
        else if (cow.key.includes('cow')) {
            cow.pendingDestroy = true;
            console.log("cow id " + cow.id);
            this.client.gotCow(cow.id);
        }
    }



    calculateGravity(planets, player) {

        let planetsArray = planets.getAll();
        let total_a_x = 0;
        let total_a_y = 0;

        for (let planet of planetsArray) {
            let distance = Phaser.Math.distance(player.x, player.y, planet.x, planet.y);
            let angle = Phaser.Math.angleBetween(player.x, player.y, planet.x, planet.y);
            let a_x = Math.cos(angle)*planet.g*(planet.mass/(distance*distance));
            let a_y = Math.sin(angle)*planet.g*(planet.mass/(distance*distance));
            total_a_x += a_x;
            total_a_y += a_y;
        }

        //player.body.acceleration.x = total_a_x;
        //player.body.acceleration.y = total_a_y;
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
            }
        }
    }

    //Client-Server functions
    onConnect() {
        console.log('Client connected');
    }

    onDisconnect() {
        console.log('Client disconnected');
    }

    //Spawn
    //login.players = array with player id:s
    onLoginResponse(login) {
	    if (login.success) {
	        console.log('Login successful!');
            this.player = this.spawnPlayer(login.id, login.x, login.y, login.angle);

            for (let p of login.players) {
                if (p.id != this.player.id) {
                    this.spawnPlayer(p.id, p.x, p.y, p.angle);
                }
            }
        } else {
	        console.log('Login failed: ' + login.message);
        }
    }

    //Update the position of all ships and add flames if they are accelerating
    onUpdateResponse(data) {
        //console.log('update response:' + data);
        for (let p of data.players) {
            if (p.id != this.player.id) {
                let ship = this.playerMap[p.id];
                ship.x = p.x;
                ship.y = p.y;
                ship.angle = p.angle;
                ship.body.velocity = p.velocity;
                ship.body.acceleration = p.acceleration;
                console.log('player acc: ' + p.acceleration );
                ship.body.angularVelocity= p.angularVelocity;
                ship.body.angularAcceleration= p.angularAcceleration;
                if (ship.body.acceleration.x > 0 || ship.body.acceleration.y >0)  {
                console.log('playing animation');
                    ship.animations.play('flames', 30, true);
                }
                else if (ship.body.acceleration.x == 0 && ship.body.acceleration.y == 0) {
                    ship.animations.stop(null, true);
                }
                //console.log('angular vel' + p.angularVelocity);
            }
        }
    }

    /**
     * Spawn or delete Player
     * @param data Data with login information, id and type. type: 1 = CONNECTED, 0 = DISCONNECTED
     */

    onUserUpdate(data) {
        if (data.type == 'connect') {
            //console.log('Spawn player id ' + data.id);
            this.spawnPlayer(data.id, data.x, data.y, data.angle);
        }

        else if (data.type == 'disconnect') {
            console.log('id in log-out' + data.id);
            this.deletePlayer(data.id);
        }
        else {
            console.log("ERROR in user update");
        }

    }

    onCowUpdate(data) {
        if (data.status == "add") {
            this.spawnCow(data.id, data.x, data.y);
        } else if (data.status == "remove") {
            this.deleteCow(data.id);
        } else {
            console.log("ERROR in cow update");
        }
    }

    onScoreUpdate(data) {
        this.playerScore = data.score;
        console.log('received score: ' + data.score);
    }

    update() {
        
        this.scoreValue.setText(this.playerScore);

        if (this.player==undefined) {
            return;
        }

        this.game.physics.arcade.collide(this.player, this.cows, this.collideCow, null, this);
        this.game.physics.arcade.collide(this.player, this.planets);

        //Rotations
        if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            //  Move to the left
            this.player.body.angularVelocity = -150;

        } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            //  Move to the right
            this.player.body.angularVelocity  = 150;
        } else {
            this.player.body.angularVelocity = 0;
        }

        //Acceleration
        if (this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            // Add forward acceleration
            this.physics.arcade.accelerationFromRotation(this.player.rotation, 1000, this.player.body.acceleration);
            //Starting flame animation
            this.player.animations.play('flames', 30, true);
            let [a_x, a_y] = this.calculateGravity(this.planets, this.player);
            this.player.body.acceleration.x += a_x;
            this.player.body.acceleration.y += a_y;

        } /*else if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            // Add backward acceleration (Mostly for testing)
            this.physics.arcade.accelerationFromRotation(this.player.rotation, -300, this.player.body.acceleration);
            //this.player.animations.play('walk', 14, true);

        }*/ else if (this.player != undefined){

            let [total_a_x, total_a_y] = this.calculateGravity(this.planets, this.player);
            this.player.body.acceleration.x = total_a_x;
            this.player.body.acceleration.y = total_a_y;

            //Stopping animation
            this.player.animations.stop(null, true);

        }


        //Update timer
        this.updateServer -= this.game.time.physicsElapsed;
        //Update server on position, angle and velocity of ship every 0.1 seconds
        if (this.updateServer<=0) {
            this.updateServer = this.maxTime;
            this.client.update(this.player);
        }
    }

   render() {
       let start = 130;
       if (this.player!=undefined){
           this.game.debug.spriteInfo(this.player, 32, 32);
           this.game.debug.text('acceleration: ' + this.player.body.acceleration, 30, start+=20);
           this.game.debug.text('velocity: ' + this.player.body.velocity, 30, start+=20);
           this.game.debug.text('angularvelocity: ' + this.player.body.angularVelocity, 30, start+=20);
           this.game.debug.text('id: ' + this.player.id, 30, start+=20);
           this.game.debug.text('cows: ' + this.cows.length, 30, start+=20);
           this.game.debug.text('players: ' + Object.keys(this.playerMap).length, 30, start+=20);
           this.game.debug.body(this.player);

           for (let planet of this.planets.getAll()) {
            this.game.debug.body(planet);
           }
       
       }
    }
}

