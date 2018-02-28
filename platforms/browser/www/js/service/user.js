service.user = (function () {

    return {

        getLogIn: function (success, error) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM users WHERE log_in=?', [true], function (tx, results) {
                    if(!results.rows.length) {
                        success && success();
                    } else if (results.rows.length === 1) {
                        success && success(results.rows[0]);
                    } else {
                        tx.executeSql('UPDATE users SET log_in=?', [false], function (tx, results) {
                            success && success();
                        });
                    }
                }, function (e) {
                    error && error(e);
                });
            });
        },

        create: function (data, success, error) {
            var userData = [
                utils.uuid(),
                utils.uuid(),
                data.phone,
                true
            ];
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO users (user_id, device_id, phone_number, log_in) VALUES (?, ?, ?, ?)', userData, function (tx, results) {
                    app.loginScreen.get().close(); //ToDo move to ajax function
                }, function (error) {
                    console.log(error);
                });
            });
        }
    }
})();