import express from 'express'

class WebServer {
    constructor() {
        this.app = express();
        this.server = require('http').createServer(this.app);
    }

    start(port) {
        this.app.use(express.static(__dirname + '/../client'))
        this.server.listen(port, () => {
            console.log('Express listening on port ' + port)
        })
    }
}

export default WebServer
