service.contact = (function () {

    return {
        create: function (debt_id) {

        },
        list: function (success, error) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM contacts', [], function (tx, results) {
                    success && success(utils.sqlResultSetToArray(results));
                }, function (tx, e) {
                    error && error(e);
                });
            });
        },

        getByIds: function (ids) {
            return app.data.contacts.filter(function (contact) {
                return ids.indexOf(contact.contact_id) !== -1;
            });
        },

        get: function (contact_id) {
            if(app.data.user.user_id == contact_id) return service.user.contact();
            return app.data.contacts.find(function (contact) {
                return contact.contact_id === contact_id;
            });
        },
        
        sycn_w_device: function (success, error) {
            function onSuccess(contacts) {
                success && success(contacts);
            }

            function onError(e) {
                error && error(e);
            }

            var options = new ContactFindOptions();
            options.multiple = true;
            options.desiredFields = [navigator.contacts.fieldType.id];
            options.hasPhoneNumber = true;
            var fields = [navigator.contacts.fieldType.id, navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers];
            navigator.contacts.find(fields, onSuccess, onError, options);
        },

        update: function (data, success, error) {
            var contactData = [
                data.contact_id,
                data.name,
                data.ava,
                data.phone,
                data.phones,
                data.install_app,
                data.sync || 'false',
                data.local_id || data.contact_id
            ];
            db.transaction(function (tx) {
                tx.executeSql('UPDATE contacts SET id=?, name=?, ava=?, phone=?, phones=?, install_app=?, sync=? WHERE contact_id=?', contactData, function (tx, results) {
                    var result = app.utils.extend({}, data, {
                        sync: contactData[6]
                    });
                    success && success(result);
                }, function (tx, e) {
                    error && error(e);
                });
            });
        },

        forSync: function () {
            return app.data.contacts.filter(function (contact) {
                if(contact.sync === 'false') {
                    contact.sync = 'pending';
                    return true;
                }
            });
        },

        syncback: function (synced_contacts) {
            synced_contacts.each(function (synced_contact) {
                var local_contact = service.contact.get(synced_contact.local_id);
                service.contact.update(app.utils.extend({},local_contact, {install_app: true, sync: 'true'}), function (result) {
                    local_contact = result;
                });
            });
            app.data.contacts.each(function (contact) {
                if(contact.sync === 'pending') {
                    service.contact.update(app.utils.extend({}, contact, {sync: 'true'}), function (result) {
                        contact = result;
                    });
                }
            });
        }
    }
})();