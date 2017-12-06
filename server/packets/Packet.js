export default
class Packet {
    constructor(name, data) {
        this.name = name;
        this.data = data;
    }

    send(socket) {
        socket.emit(this.name, this.data);
    }

    broadcast(socket) {
        socket.broadcast.emit(this.name, this.data);
    }
}