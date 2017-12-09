
import PlayState from 'states/PlayState';
import LoginState from 'states/LoginState';
import GameClient from 'network/GameClient'


export default
class Game extends Phaser.Game {
    constructor() {
        super(1080, 720, Phaser.AUTO, 'main', null, true);
        this.showDebugHeader = () => {};

        this.client = new GameClient();
        this.state.add('Play', PlayState);
        this.state.add('Login', LoginState);
        //this.stage.disableVisibilityChange = true;
    }

    start() {
        this.state.start('Play');
    }
}

