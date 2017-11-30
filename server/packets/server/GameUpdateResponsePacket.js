import Packet from 'packets/Packet';

export default
class GameUpdatePacket extends Packet {
    constructor(state) {
        super('update', {
            players: state.players,
            cows: state.cows
        });
    }
}