
import PlayState from 'states/PlayState';
import LoginState from 'states/LoginState';
import GameClient from 'network/GameClient'


export default
class Game extends Phaser.Game {
    constructor() {
        super('100', '100', Phaser.AUTO, 'main', null, true);
       // new ScaleManager(game, 1080, 100%);
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

