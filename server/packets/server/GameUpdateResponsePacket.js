import Packet from 'packets/Packet';

export default
class GameUpdateResponsePacket extends Packet {
    constructor(state) {
        super('game-update', {
            players: state.players,
            cows: state.cows
        });
    }
}