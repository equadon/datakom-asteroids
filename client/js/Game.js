import PlayState from 'states/PlayState'

export default
class Game extends Phaser.Game {
    constructor() {
        super(800, 500, Phaser.AUTO, 'main', null);
        this.showDebugHeader = () => {};

        this.state.add('Play', PlayState);
    }

    start() {
        this.state.start('Play');
    }
}

