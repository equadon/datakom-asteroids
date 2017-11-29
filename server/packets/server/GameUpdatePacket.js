import Packet from 'packets/Packet';

export default
class GameUpdatePacket extends Packet {
    constructor(players) {
        super('update', {
            players: players
        });
    }
}