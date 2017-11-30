export default
class LoginHandler {
    constructor(db) {
        this.db = db;
    }

    /**
     * Get the next user id available
     * @param callback
     */
    getNextUserId(callback) {
        this.db.collection("counters").findOneAndUpdate( { _id: "userid" }, { $inc: { seq: 1 } }, function(err, result){
            if(err) throw(err);
            callback(result.value.seq);
        } );
    }


    /**
     * Add a new user to the database
     *
     * @callback will be called with true
     *
     * @param newUser Data with username and password of new user
     * @param callback Function to call with the result of the creation
     */
    createUser(newUser, callback) {
        console.log("Creating new user " + newUser.username);
        let _this = this;

        _this.getNextUserId(function (id){
            _this.db.collection("users")
                .insertOne({username: newUser.username,
                            password: newUser.password,
                            userid: id},
                            function (err, result) {
                    if (err) throw err; // TODO: respond with failed user creation.
                    callback(true, id);
            });
        });
    }

    /**
     * Attempt to login a user
     *
     * @callback (bool, id) will be called with true if either the login was successful or if
     * a new account was created, false if password was incorrect. The id of the
     * user will be null if bool is false.
     *
     * @param request The data containing username and password
     * @param callback Function to call with the result of the creation
     */
    login(request, callback) {
        let _this = this;
        let query = { username: request.username };
        this.db.collection("users").findOne(query, function(err, result) {
            if (err) throw err; // TODO: Decide what to do on error
            if (result === null) {
                console.log("No matching user was found");
                _this.createUser(request, callback);
            } else {
                console.log("User " + result.username + " was found");
                var valid = result.password === request.password;
                if (!valid) console.log("Invalid password for username: " + result.username);
                callback(valid, valid ? result.userid : null);
            }
        });
    }
}