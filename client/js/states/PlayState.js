import GameClient from 'network/GameClient'



export default
class PlayState extends Phaser.State {
	preload() {
        this.client = new GameClient();
        this.load.image('ship', 'images/dogrocket_pastell2.png'); //OBS
        this.load.image('cow', 'images/cow.ico');

        this.client.on('connect', (obj) => {this.onConnect(obj) });
        this.client.on('diconnect', (obj) => {this.onDisconnect(obj) });




	}

	//Vi kommer ha ett spelar-id som kopplas till ens användare. Som lagras i databasen.

	create() {

        //Groups
        this.players = this.add.group();
        this.cows = this.add.group();

        this.spawnCow(5, getRandomInt(100, 400), getRandomInt(100, 400));

        //Scale

        //this.cow.scale.setTo(.35, .35);

        //Anchor and Angle

        //Enable physics



        //Client on server
        this.client.on('login-response', (obj) => { this.onLoginResponse(obj) });
        this.client.on('update', (obj) => { this.onUpdateResponse(obj) });
        //this.client.on('update', (obj) => { this.onUserUpdate(obj) });
    }

    //Spawn functions

    spawnCow(id, x, y) {
	    let cow = this.add.sprite(x, y, 'cow');
	    this.cows.add(cow);
        cow.scale.setTo(.35, .35);
	    cow.id = id;
        this.physics.arcade.enable(cow);
    }

    spawnPlayer(id) {
        let ship = this.add.sprite(getRandomInt(100, 400), getRandomInt(100, 400), 'ship');
        ship.id = id;
        //this.players.add(player);
        ship.scale.setTo(.35, .35);
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = -90;


        //Enable physics
        this.physics.arcade.enable(ship);

        return ship;
    }

    deletePlayer(id) {
        for (let i=0; i<this.players.children.length; i++) {
            if (this.players.children[i].id == id) {
                this.players.children[i].destroy();
            }
        };
    }

    //Client-Server functions

    onConnect() {
        console.log('Client connected');


        this.client.login('admin', '123');
    }

    onDisconnect() {
        console.log('Client disconnected');
        this.text.setText('Disconnected!');
    }


    //Spawn
    onLoginResponse(login) {
	    if (login.success) {
	        console.log('Login successful!');
	        console.log(login.id);

            this.player = this.spawnPlayer(login.id);

            console.log(login);
        } else {
	        console.log('Login failed: ' + login.message);
	        this.text.setText('Login failed:\n' + login.message);
        }
    }

    onUpdateResponse(data) {
	    console.log(data);
    }

    /**
     * Spawn or delete Player
     * @param data Data with login information, id and type. type: 1 = CONNECTED, 0 = DISCONNECTED
     */

    /*onUserUpdate(data) {
        if (data.type = 1) {
            spawnPlayer(data.id);
        }

        else if (data.type = 0) {
            //deleteplayer
        }
        else {
            console.log("ERROR in user update")
        }

    }*/

    update() {

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
        else {
            return
        }

         if (this.player.body.velocity.x != 0 || this.player.body.velocity.y != 0) {

         }

         this.client.update(this.player);
    }

   render() {
        this.game.debug.spriteInfo(this.player, 32, 32);
        this.game.debug.text('acceleration: ' + this.player.body.acceleration, 32, 200);
        this.game.debug.text('velocity: ' + this.player.body.velocity, 32, 232);
       this.game.debug.text('id: ' + this.player.id, 32, 262);

    }

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
