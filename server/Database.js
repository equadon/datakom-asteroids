export default
class Database {
    constructor() {
        this.url = "mongodb://localhost:27017/mydb";
        this.MongoClient = require('mongodb').MongoClient;
    }

    /**
     * Connect the database and initialize
     * @param callback
     */
    connect(callback) {
        let _this = this;
        this.MongoClient.connect(this.url, function (err, db) {
            if (err) callback(err, db);
            _this.initialize(db, callback);
        });
    }

    initialize(db, callback) {
        db.listCollections({name: 'counters'})
            .next(function (err, collinfo) {
                if (collinfo) {
                    callback(err, db);
                } else {
                    var options = { "sort": [['userid','desc']] };
                    db.collection('users').findOne({}, options , function(err, doc) {
                        let id = doc ? doc.userid : 1;
                        db.collection('counters').insertOne({_id: "userid", seq: id}, function (err, r) {
                            callback(err, db);
                        });
                    });
                }
            });
    }
}