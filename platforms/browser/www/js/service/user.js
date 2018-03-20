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
                }, function (tx, e) {
                    error && error(e);
                });
            });
        },

        create: function (data, success, error) {
            var userData = [
                data.id,
                utils.uuid(),
                data.phone,
                true,
                data.auth_token,
                true
            ];
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO users (user_id, device_id, phone, log_in, auth_token, sync) VALUES (?, ?, ?, ?, ?, ?)', userData, function (tx, results) {
                    var result = app.data.user = {
                        user_id: data.id,
                        device_id: userData[1],
                        phone: data.phone,
                        log_in: userData[3],
                        auth_token: data.auth_token
                    };
                    success && success(result);
                }, function (tx, e) {
                    error && error(e);
                });
            });
        },

        update: function (data, success, error) {
            var userData = [
                data.name,
                data.user_id
            ];
            db.transaction(function (tx) {
                tx.executeSql('UPDATE users SET name=?, sync=\'false\' WHERE user_id=? AND log_in=\'true\'', userData, function (tx, results) {
                    var result = app.utils.extend(app.data.user, {
                        name: data.name
                    });
                    success && success(result);
                }, function (tx, e) {
                    error && error(e);
                });
            });
        }
    }
})();