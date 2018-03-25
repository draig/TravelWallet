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
                data.ava || '',
                data.auth_token,
                'true'
            ];
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO users (user_id, device_id, phone, log_in, ava, auth_token, sync) VALUES (?, ?, ?, ?, ?, ?, ?)', userData, function (tx, results) {
                    var result = app.data.user = {
                        user_id: data.id,
                        device_id: userData[1],
                        phone: data.phone,
                        log_in: userData[3],
                        ava: userData[4],
                        auth_token: data.auth_token,
                        sync: userData[6]
                    };
                    success && success(result);
                }, function (tx, e) {
                    error && error(e);
                });
            });
        },

        update: function (data, success, error) {
            var userData = [
                data.name || app.data.user.name,
                data.ava || app.data.user.ava,
                data.sync || app.data.user.sync,
                data.user_id || app.data.user.user_id
            ];
            db.transaction(function (tx) {
                tx.executeSql('UPDATE users SET name=?, ava=?, sync=? WHERE user_id=? AND log_in=\'true\'', userData, function (tx, results) {
                    var result = app.utils.extend(app.data.user, {
                        name: userData[0],
                        ava: userData[1],
                        sync: userData[2]
                    });
                    success && success(result);
                }, function (tx, e) {
                    error && error(e);
                });
            });
        },

        avatar: function (avatarBlob, success, error) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                utils.saveBlob(avatarBlob, "new_avatar.png", fs, function (fileEntry) {
                    service.user.update({ava: fileEntry.toURL()});
                    success && success();
                });
            }, function (e) { error && error(e); });
        },

        contact: function () {
            var u = app.data.user;
            return {
                contact_id: u.user_id,
                name: u.name,
                phone: u.phone,
                ava: u.ava,
                install_app: true,
                sync: true
            }
        },

        forSync: function () {
            if(app.data.user.sync === 'false') {
                app.data.user.sync = 'pending';
                return app.data.user;
            }
        },

        syncback: function () {
            if(app.data.user.sync === 'pending') {
                service.user.update({sync: 'true'});
            }
        }
    }
})();