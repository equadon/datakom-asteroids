export default
class Database {
    constructor() {
        this.url = process.env.COWS_DB_URL;
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
            db.nextUserId = 1;
            db.getNextUserID = function() {return this.nextUserId++;};
            _this.initialize(db, callback);
        });
    }

    initialize(db, callback) {
        db.listCollections({name: 'users'})
            .next(function (err, collinfo) {
                if (collinfo) {
                    var options = {"sort": [['userid', 'desc']]};
                    db.collection('users').findOne({}, options, function (err, doc) {
                        db.nextUserId = doc ? doc.userid + 1 : 1;
                        callback(err, db);
                    });
                } else {
                    callback(err, db);
                }
            });
    }
}