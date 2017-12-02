import GameClient from 'network/GameClient'



export default
class PlayState extends Phaser.State {

    init() {
        this.game.stage.disableVisibilityChange = true;
    }

    preload() {
        this.client = new GameClient();
        this.load.image('ship', 'images/rocket-green-flames.png'); //OBS
        this.load.image('cow', 'images/Ko2.png');

        this.client.on('connect', (obj) => {this.onConnect(obj) });
        this.client.on('diconnect', (obj) => {this.onDisconnect(obj) });





	}

	//Vi kommer ha ett spelar-id som kopplas till ens användare. Som lagras i databasen.

	create() {

        this.game.stage.backgroundColor = "#151A38";

        //Group of ship objects
        this.playerMap = {};

        //Group of cow objects
        this.cowMap = {};

        this.spawnCow(5, this.game.rnd.integerInRange(100, 400), this.game.rnd.integerInRange(100, 400));

        //Client on server
        this.client.on('login-response', (obj) => { this.onLoginResponse(obj) });
        this.client.on('game-update', (obj) => { this.onUpdateResponse(obj) });
        this.client.on('user-update', (obj) => { this.onUserUpdate(obj) });
        this.client.login('admin', '123');

        //Timers
        this.maxTime = 0.2;
        this.updateServer = this.maxTime;

    }

    //Spawn functions

    spawnCow(id, x, y) {
	    let cow = this.add.sprite(x, y, 'cow');
	    this.cowMap[id] = cow;
        cow.scale.setTo(0.35, 0.35);
	    cow.id = id;
        this.physics.arcade.enable(cow);
        cow.anchor.setTo(0.5, 0.5);
        cow.body.angularVelocity = 5;
    }

    spawnPlayer(id, x, y, v) {

        let ship = this.add.sprite(x, y, 'ship');
        ship.id = id;

        //Adding ship to group
        this.playerMap[id] = ship;

        //Scale and angle ship
        ship.scale.setTo(0.35, 0.35);
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = v;


        //Enable physics on ship
        this.physics.arcade.enable(ship);

        return ship;
    }

    deletePlayer(id) {
        this.playerMap[id].destroy();
        delete this.playerMap[id];
    }

    deleteCow(id) {
        this.cowMap[id].destroy();
        delete this.cowMap[id];
    }

    //Client-Server functions

    onConnect() {
        console.log('Client connected');
    }

    onDisconnect() {
        console.log('Client disconnected');
        this.text.setText('Disconnected!');
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
	        this.text.setText('Login failed:\n' + login.message);
        }
    }

    //Update the position of all ships
    onUpdateResponse(data) {
        console.log('update response:' + data);
        for (let p of data.players) {
            if (p.id != this.player.id) {
                let ship = this.playerMap[p.id];
                ship.x = p.x;
                ship.y = p.y;
                ship.angle = p.angle;
                ship.body.velocity = p.velocity;
            }
        }
    }

    /**
     * Spawn or delete Player
     * @param data Data with login information, id and type. type: 1 = CONNECTED, 0 = DISCONNECTED
     */

    onUserUpdate(data) {
        if (data.type == 1) {
            console.log('Spawn player id ' + data.id);
            this.spawnPlayer(data.id, data.x, data.y, data.angle);
        }

        else if (data.type == 0) {
            console.log('id in log-out' + data.id);
            this.deletePlayer(data.id);
        }
        else {
            console.log("ERROR in user update")
        }

    }

    update() {


        if (this.player==undefined) {
            return;
        }
        if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            //  Move to the left
            this.player.body.angularVelocity -= 1;


        } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            //  Move to the right
            this.player.body.angularVelocity  += 1;


        }
        if (this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            // Add forward acceleration
            this.physics.arcade.accelerationFromRotation(this.player.rotation, 50, this.player.body.acceleration);

        } else if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            // Add backward acceleration (Mostly for testing)
            this.physics.arcade.accelerationFromRotation(this.player.rotation, -50, this.player.body.acceleration);

        } else if (this.player!=undefined){
            this.player.body.acceleration.setTo(0, 0);
        }


         if (this.player.body.velocity.x != 0 || this.player.body.velocity.y != 0) {

         }

         //Update timer
       this.updateServer -= this.game.time.physicsElapsed;
        console.log('TIME:' + this.game.time.physicsElapsed);
       // this.client.update(this.player);

         //Update server on position, angle and velocity of ship every 0.1 seconds
       if (this.updateServer<=0) {
           console.log('UPDATE TIMER');
            this.updateServer = this.maxTime;
            this.client.update(this.player);
        }






    }

   render() {
       if (this.player!=undefined){
           this.game.debug.spriteInfo(this.player, 32, 32);
           this.game.debug.text('acceleration: ' + this.player.body.acceleration, 30, 200);
           this.game.debug.text('velocity: ' + this.player.body.velocity, 30, 220);
           this.game.debug.text('id: ' + this.player.id, 30, 240);
           this.game.debug.text('cows: ' + Object.keys(this.cowMap).length, 30, 260);
           this.game.debug.text('players: ' + Object.keys(this.playerMap).length, 30, 280);
       }
    }

}

