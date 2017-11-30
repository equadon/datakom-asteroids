import GameClient from 'network/GameClient'

export default
class PlayState extends Phaser.State {
	preload() {
        this.client = new GameClient();

        this.client.on('connect', (obj) => { this.onConnect(obj) });
        this.client.on('disconnect', (obj) => { this.onDisconnect(obj) });

        this.client.on('login-response', (obj) => { this.onLoginResponse(obj) });
	}

	create() {
	    this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY,
                                       "Connecting...",
                                       { font: "35px Arial", fill: "#eeeeee", align: "center" });
        this.text.anchor.set(0.5);

	    this.client.connect();
    }

    onConnect() {
        console.log('Client connected');
        this.text.setText('Connected.');

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
        } else {
	        console.log('Login failed: ' + login.message);
	        this.text.setText('Login failed:\n' + login.message);
        }
    }
}
