service.auth = (function () {

    return {

        send_sms: function (data, success, error) {
            app.request.post(endpoint + '/auth/send_sms', data, function (data) {
                success && success(data);
            });
        },

        verify_code: function (data, success, error) {
            app.request.post(endpoint + '/auth/verify_code', data, function (data) {
                service.user.create(app.utils.extend(data.user, {auth_token: data.auth_token}), function (tx, results) {
                    success && success(results);
                }, function (e) {
                    error && error(e);
                });
            }, function (e) {
                error && error(e)
            }, 'json');
        },

        getLogIn: function (success, error) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM auth', [], function (tx, results) {
                    if(!results.rows.length) {
                        success && success();
                    } else if (results.rows.length === 1) {
                        success && success(results.rows[0]);
                    } else {
                        tx.executeSql('DELETE FROM auth', [], function (tx, results) {
                            success && success();
                        });
                    }
                }, function (tx, e) {
                    error && error(e);
                });
            });
        },

        logIn: function (data, success, error) {
            var user_data = {in_app: true, sync: true, phone: data.phone, user_id: data.id, ava: data.ava, name: data.name || null};

            service.user.create(user_data, function (user) {
                db.transaction(function (tx) {
                    tx.executeSql('INSERT INTO auth (user_id, auth_token) VALUES (?, ?)', [data.id, data.auth_token], function (tx, results) {
                        app.data.current_user = user;
                        app.data.auth = {user_id: data.id, auth_token: data.auth_token};
                        success && success(app.data.current_user);
                    }, function (tx, e) {
                        error && error(e);
                    });
                });
            });
        }
    }
})();