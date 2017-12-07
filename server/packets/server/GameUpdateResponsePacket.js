import Packet from 'packets/Packet';

export default
class GameUpdateResponsePacket extends Packet {
    constructor(players, cows, planets) {
        super('game-update', {
            players: players,
            cows: cows,
            planets: planets
        });
    }
}