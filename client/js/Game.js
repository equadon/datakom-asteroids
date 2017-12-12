import PlayState from 'states/PlayState';
import DisconnectedState from 'states/DisconnectedState';
import GameClient from 'network/GameClient'


export default
class Game extends Phaser.Game {
    constructor() {
        super('100', '100', Phaser.AUTO, 'main', null, true);
        this.showDebugHeader = () => {};

        this.client = new GameClient();
        this.state.add('Play', PlayState);
        this.state.add('Disconnected', DisconnectedState);
    }

    start(login) {
        this.state.start('Play', true, false, login);
    }
}

