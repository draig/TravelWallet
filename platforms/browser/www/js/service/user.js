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
                utils.uuid(),
                utils.uuid(),
                data.phone,
                true
            ];
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO users (user_id, device_id, phone_number, log_in) VALUES (?, ?, ?, ?)', userData, function (tx, results) {
                    var result = app.data.user = app.utils.extend(data, {
                        user_id: userData[0],
                        device_id: userData[1]
                    });
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
                tx.executeSql('UPDATE users SET name=? WHERE user_id=?', userData, function (tx, results) {
                    var result = app.utils.extend(app.data.user, data);
                    success && success(result);
                }, function (tx, e) {
                    error && error(e);
                });
            });
        }
    }
})();