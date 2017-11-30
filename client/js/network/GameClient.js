let instance = null;

export default
class GameClient {
    constructor() {
        if (!instance) {
            instance = this;
        }

        this.socket = io('http://localhost:3000', {
            path: '/cows'
        });
    }

    connect() {
        this.socket.connect();
    }

    login(username, password) {
        console.log('Logging in user: ' + username);

        this.socket.emit('login-request', {
            username: username,
            password: password
        });
    }

    on(name, callback) {
        this.socket.on(name, callback);
    }

    update(player) {
        
        this.socket.emit('update', {
            x: player.x,
            y: player.y,
            angle: 0,
            id: player.id
            });


    //console.log('wazzup');
    }

}
