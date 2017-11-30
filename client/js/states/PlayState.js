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

        this.player = this.add.sprite(getRandomInt(100, 400), getRandomInt(100, 400), 'ship');



        //Groups
        this.players = this.add.group();
        this.cows = this.add.group();

        this.spawnCow(5, getRandomInt(100, 400), getRandomInt(100, 400));



        //Scale
        this.player.scale.setTo(.35, .35);
        //this.cow.scale.setTo(.35, .35);

        //Anchor and Angle
        this.player.anchor.setTo(0.5, 0.5);
        this.player.angle = -90;

        //Enable physics
        this.physics.arcade.enable(this.player);

        this.client.on('login-response', (obj) => { this.onLoginResponse(obj) });
    }

    spawnCow(id, x, y) {
	    let cow = this.add.sprite(x, y, 'cow');
	    this.cows.add(cow);
        cow.scale.setTo(.35, .35);
	    cow.id = id;
        this.physics.arcade.enable(cow);
    }

    onConnect() {
        console.log('Client connected');


        this.client.login('admin', '123');
    }

    onDisconnect() {
        console.log('Client disconnected');
        this.text.setText('Disconnected!');
    }

    onLoginResponse(login) {
	    if (login.success) {
	        console.log('Login successful!');
	        this.text.setText('Login successful!');
	        this.player.id = 1; //TODO
        } else {
	        console.log('Login failed: ' + login.message);
	        this.text.setText('Login failed:\n' + login.message);
        }
    }


    update() {

        if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            //  Move to the left
            this.player.body.angularVelocity -= 1;


        } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            //  Move to the right
            this.player.body.angularVelocity  += 1;


        } else {
            console.log(this.player);
            this.player.body.angularVelocity = 0.5;
        }
        if (this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            // Add forward acceleration
            this.physics.arcade.accelerationFromRotation(this.player.rotation, 50, this.player.body.acceleration);

        } else if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            // Add backward acceleration (Mostly for testing)
            this.physics.arcade.accelerationFromRotation(this.player.rotation, -50, this.player.body.acceleration);

        } else {
            this.player.body.acceleration.setTo(0, 0);
        }

         if (this.player.body.velocity.x != 0 || this.player.body.velocity.y != 0) {

         }
    }

   render() {
        this.game.debug.spriteInfo(this.player, 32, 32);
        this.game.debug.text('acceleration: ' + this.player.body.acceleration, 32, 200);
        this.game.debug.text('velocity: ' + this.player.body.velocity, 32, 232);

    }

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
