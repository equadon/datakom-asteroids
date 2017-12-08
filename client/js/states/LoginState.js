import GameClient from 'network/GameClient'

export default
class LoginState extends Phaser.State {
    preload() {
        this.client = new GameClient();
        this.load.image('login_text', 'images/logintext.png'); //OBS
    }

    create() {
        this.client.on('login-response', (obj) => {
            this.onPositiveLogin()
        });

        this.gameOver = this.add.sprite(this.game.width * 0.5, this.game.height * 0.5, 'login_text');
        this.gameOver.anchor.setTo(0.5, 0.5);
        this.gameOver.scale.setTo(2,2);
        //this.game.add.tween(this.gameOver).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1500, true);
    }

    update() {

    }

    onPositiveLogin() {
        this.game.state.start('Play');
    }
}