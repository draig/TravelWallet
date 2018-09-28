service.user = (function () {

    return {
        list: function (success, error) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM users', [], function (tx, results) {
                    var users = utils.sqlResultSetToArray(results);
                    users.forEach(function (user) {
                        user.in_app =  user.in_app === 'true';
                        user.sync =  user.sync === 'true';
                    });
                    success && success(users);
                }, function (tx, e) {
                    error && error(e);
                });
            });
        },

        getByIds: function (ids) {
            return app.data.users.filter(function (user) {
                return ids.indexOf(user.user_id) !== -1;
            });
        },

        get: function (user_id) {
            return app.data.users.find(function (user) {
                return user.user_id === user_id;
            });
        },

        create: function (data, success, error) {
            var contactData = [
                data.user_id || 'local-' + utils.uuid(),
                data.name || null,
                data.phone,
                data.ava || null,
                data.in_app || false,
                data.sync || false
            ];
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO users (user_id, name, phone, ava, in_app, sync) VALUES (?, ?, ?, ?, ?, ?)', contactData, function (tx, results) {
                    var result = app.utils.extend({}, data, {
                        user_id: contactData[0],
                        ava: contactData[3],
                        in_app: contactData[4],
                        sync: contactData[5]
                    });
                    app.data.users.push(result);
                    success && success(result);
                }, function (tx, e) {
                    error && error(e);
                });
            });
        },

        update: function (data, success, error) {
            var contactData = [
                data.user_id,
                data.name,
                data.phone,
                data.ava,
                data.in_app,
                data.sync || false,
                data.local_id || data.user_id
            ];
            db.transaction(function (tx) {
                tx.executeSql('UPDATE users SET user_id=?, name=?, phone=?, ava=?, in_app=?, sync=? WHERE user_id=?', contactData, function (tx, results) {
                    var result = app.utils.extend(service.user.get(data.user_id), data, {
                        sync: contactData[6],
                        local_id: null
                    });

                    success && success(result);
                }, function (tx, e) {
                    error && error(e);
                });
            });
        },

        forSync: function () {
            return app.data.users.filter(function (user) {
                if (user.sync === 'false') {
                    user.sync = 'pending';
                    return true;
                }
            });
        },

        syncback: function (synced_contacts) {
            synced_contacts.forEach(function (synced_contact) {
                var local_contact = service.user.get(synced_contact.local_id);
                service.user.update(app.utils.extend({}, local_contact, {
                    in_app: true,
                    sync: 'true'
                }), function (result) {
                    local_contact = result;
                });
            });
            app.data.users.forEach(function (user) {
                if (user.sync === 'pending') {
                    service.user.update(app.utils.extend({}, user, {sync: 'true'}), function (result) {
                        user = result;
                    });
                }
            });
        },

        merge_contacts: function (device_contacts) {
            device_contacts.forEach(function (device_contact) {
                var contact_w_same_id = app.data.users.find(function (user) {
                    return user.user_id === device_contact.user_id;
                });
                if (contact_w_same_id) {
                    var intersection = utils.intersection(contact_w_same_id.phones, device_contact.phones);
                    if (intersection.length) {
                        return;
                    }
                }
                var duplicate = app.data.users.find(function (user) {
                    return !!utils.intersection(device_contact.phones, user.phones).length;
                });

                if (!duplicate) {
                    service.user.create(device_contact);
                }
            });
        }
    }
})();