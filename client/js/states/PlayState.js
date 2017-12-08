import GameClient from 'network/GameClient'

export default
class PlayState extends Phaser.State {

    init() {

        this.client = new GameClient();

        this.client.on('login-response', (obj) => {
            this.onLoginResponse(obj)
        });
        this.client.on('game-update', (obj) => {
            this.onUpdateResponse(obj)
        });
        this.client.on('user-update', (obj) => {
            this.onUserUpdate(obj)
        });

        this.client.on('score-update', (obj) => {
            this.onScoreUpdate(obj);
        });

        this.game.stage.disableVisibilityChange = true;

        // Disable window scrolling when window is smaller than the game area
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);
    }

    preload() {
        this.load.image('ship', 'images/rocket-green-flames.png'); //OBS
        this.load.image('cow', 'images/Ko2.png');
        this.game.load.spritesheet('rocket_flame', '/images/rocket-animation-horizontal.png', 250, 176, );


        this.client.on('connect', (obj) => {this.onConnect(obj) });
        this.client.on('disconnect', (obj) => {this.onDisconnect(obj) });
	}

	//Vi kommer ha ett spelar-id som kopplas till ens användare. Som lagras i databasen.

	create() {
        this.game.camera.bounds = {
            x: Number.MIN_SAFE_INTEGER,
            y: Number.MIN_SAFE_INTEGER,
            width: Number.MAX_SAFE_INTEGER * 2,
            height: Number.MAX_SAFE_INTEGER * 2
        };

        //Group of ship objects
        this.playerMap = {};

        //Group of cow objects
        this.cowMap = {};
        this.cows = this.game.add.group();


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




    spawnPlayer(id, x, y, v) {

        let ship = this.add.sprite(x, y, 'rocket_flame');

        ship.id = id;

        //Adding animation on ship
        var flames = ship.animations.add('flames');

        //Adding ship to group
        this.playerMap[id] = ship;

        //Scale and angle ship
        ship.scale.setTo(0.35, 0.35);
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = v;

        //Enable physics on ship
        this.physics.arcade.enable(ship);
        ship.body.maxVelocity = new Phaser.Point(250, 250);
        ship.body.drag = new Phaser.Point(30,30);

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
            this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        } else {
	        console.log('Login failed: ' + login.message);
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
        }

        else if (data.type == 'disconnect') {
            console.log('id in log-out' + data.id);
            this.deletePlayer(data.id);
        }
        else {
            console.log("ERROR in user update");
        }

    }

    onScoreUpdate(data) {
        this.playerScore = data.score;
        console.log('received score: ' + data.score);
    }

    update() {
        this.scoreValue.setText(this.playerScore);

        this.game.physics.arcade.collide(this.player, this.cows, this.collideCow, null, this);

        if (this.player==undefined) {
            return;
        }

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
            this.physics.arcade.accelerationFromRotation(this.player.rotation, 300, this.player.body.acceleration);

            this.player.animations.play('flames', 30, true);


        } else if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            // Add backward acceleration (Mostly for testing)
            this.physics.arcade.accelerationFromRotation(this.player.rotation, -300, this.player.body.acceleration);
            this.player.animations.play('flames', 30, true);


        } else if (this.player != undefined){
            this.player.body.acceleration.setTo(0, 0);
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

   /**
    * Update client's object list.
    * @param cows Array of cow objects
    */
   updateObjects(objects) {
       let existingPlayers = Object.keys(this.playerMap);
       let updatedPlayers = [];
       let existingCows = Object.keys(this.cowMap);
       let updatedCows = [];

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
                       ship.body.angularVelocity= obj.aVel;
                       ship.body.angularAcceleration= obj.aAcc;
                       if (ship.body.acceleration.x > 0 || ship.body.acceleration.y > 0)  {
                           ship.animations.play('flames', 30, true);
                       }
                       else if (ship.body.acceleration.x == 0 && ship.body.acceleration.y == 0) {
                           ship.animations.stop(null, true);
                       }
                   } else {
                       console.log('adding new player: ' + obj.id);
                       this.spawnPlayer(obj.id, obj.x, obj.y, obj.angle);
                   }
               }
               updatedPlayers.push(obj.id + '');
           } else if (obj.type == 'cow') {
               if (!existingCows.includes(obj.id + '')) {
                   this.spawnCow(obj.id, obj.x, obj.y);
               }
               updatedCows.push(obj.id + '');
           }
       }

       // Remove players that are no longer visible
       for (let id of Object.keys(this.playerMap)) {
           if (updatedPlayers.indexOf(id) == -1) {
               console.log('removing player: ' + id);
               this.deletePlayer(id);
           }
       }
       // Remove cows that are no longer visible
       for (let id of Object.keys(this.cowMap)) {
           if (updatedCows.indexOf(id) == -1) {
               this.deleteCow(id);
           }
       }
   }

   render() {
       let start = 130;
       if (this.player!=undefined){
           this.game.debug.spriteInfo(this.player, 32, 32);
           this.game.debug.cameraInfo(this.game.camera, 432, 32);
           this.game.debug.text('acceleration: ' + this.player.body.acceleration, 30, start+=20);
           this.game.debug.text('velocity: ' + this.player.body.velocity, 30, start+=20);
           this.game.debug.text('angularvelocity: ' + this.player.body.angularVelocity, 30, start+=20);
           this.game.debug.text('id: ' + this.player.id, 30, start+=20);
           this.game.debug.text('cows: ' + Object.keys(this.cowMap).length, 30, start+=20);
           this.game.debug.text('players: ' + Object.keys(this.playerMap).length, 30, start+=20);
       }
    }
}

