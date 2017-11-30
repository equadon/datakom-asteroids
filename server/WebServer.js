import express from 'express'

class WebServer {
    constructor() {
        this.app = express()
        this.app.use(express.static(__dirname + '/../client'))
    }

    start(port) {
        this.app.listen(port, () => {
            console.log('Express listening on port ' + port)
        })
    }
}

export default WebServer
