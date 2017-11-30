
export default
class LoginHandler {
    constructor(db) {
        this.db = db;
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
        this.db.collection("users").insertOne(newUser, function (err, result) {
            if (err) throw err; // TODO: respond with failed user creation
            callback(true);
        });
    }

    /**
     * Attempt to login a user
     *
     * @callback will be called with true if either the login was successful or if
     * a new account was created, false if password was incorrect.
     *
     * @param request The data containing username and password
     * @param callback Function to call with the result of the creation
     */
    login(request, callback) {
        var _this = this;
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
                callback(valid);
            }
        });
    }
}