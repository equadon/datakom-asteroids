import GameClient from 'network/GameClient'

export default
class DisconnectedState extends Phaser.State {
    init(login) {
        this.client = GameClient.instance;
        this.client.socket.on('connect', (socket) => this.onConnect(socket));
    }

    create() {
        this.connecting = this.add.sprite(this.game.world.centerX - 50, this.game.world.centerY - 30, 'connect');
        this.connecting.animations.add('connecting')
        this.connecting.animations.play('connecting', 20, true);

        this.disconnectedText = this.game.add.bitmapText(0, 0, 'cabin-bold-48', 'Disconnected', 48);
        this.disconnectedText.position.x = this.game.world.centerX - this.disconnectedText.width / 2;
        this.disconnectedText.position.y = this.game.world.centerY - this.disconnectedText.height - 100;

        this.text = this.game.add.bitmapText(0, 0, 'cabin-bold-24', 'Connecting to server...', 24);
        this.text.alpha = 0;
        this.text.position.x = this.game.world.centerX - this.text.width / 2;
        this.text.position.y = this.game.world.centerY + 30 + this.text.height / 2;
        this.game.add.tween(this.text).to( { alpha: 1 }, 700, Phaser.Easing.Linear.None, true, 0, 650, true);
    }

    onConnect(socket) {
        this.client.relogin();
    }
}