export default
class Socket {
    constructor(url) {
        this.events = {};
        this.url = url;
    }

    connect() {
        if (this.socket !== undefined && this.socket.readyState !== WebSocket.CLOSED) {
            console.log("Error: WebSocket is already opened");
        } else {
            this.socket = new WebSocket(this.url);
            this.socket.onmessage = (event) => { this.handleMessage(event) };

            if ('Connect' in this.events) {
                this.socket.onopen = this.events['Connect'];
            }

            if ('Disconnect' in this.events) {
                this.socket.onclose = this.events['Disconnect'];
            }
        }
    }

    send(obj) {
        this.socket.send(JSON.stringify(obj))
    }

    on(name, callback) {
        this.events[name] = callback;
    }

    handleMessage(event) {
        let obj = JSON.parse(event.data);
        let type = obj.type;

        if (type in this.events) {
            let callback = this.events[type];
            callback(obj);
        } else {
            console.log(event.data);
            console.log('Warning: Unhandled packet: ' + type);
        }
    }
}
