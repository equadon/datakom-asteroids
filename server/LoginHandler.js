export default
class LoginHandler {
    constructor(db) {
        this.db = db;
    }

    /**
     * Add a new user to the database
     *
     * @callback (bool, user_data) will be called with true. The data of the
     * user will only contain id. user_data.info will be null.
     *
     * The user_data returned in the callback contains:
     * {id, info : null}
     *
     * @param newUser Data with username and password of new user
     * @param callback Function to call with the result of the creation
     */
    createUser(newUser, callback) {
        console.log("Creating new user " + newUser.username);

        let id = this.db.getNextUserID();
        this.db.collection("users")
            .insertOne({username: newUser.username,
                        password: newUser.password,
                        userid: id},
                function (err, result) {
                    if (err) throw err; // TODO: respond with failed user creation.
                    callback(true, {id: id, info: null});
                });
    }

    /**
     * Attempt to login a user
     *
     * @callback (bool, user_data) will be called with true if either the login was successful or if
     * a new account was created, false if password was incorrect. The data of the
     * user will be null if bool is false.
     *
     * The user_data returned in the callback contains:
     * {id, info : {x, y, angle, score}}
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
                let valid = result.password === request.password;
                if (!valid) console.log("Invalid password for username: " + result.username);
                let user_data = {id: result.userid, info : result.player_info};
                callback(valid, valid ? user_data : null);
            }
        });
    }


    logout(player, callback) {
        let player_info = {x: player.data.x,
                           y: player.data.y,
                           angle: player.data.angle,
                           score: player.data.score};
        let users = this.db.collection('users');
        users.findOneAndUpdate({userid: player.dbId},
            {$set: {player_info: player_info}},
            function(err, r) {
                if (err) throw err; // TODO: Handle error
                callback();
            });
    }
}