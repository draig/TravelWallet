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
            return app.data.contacts.find(function (contact) {
                return contact.contact_id === contact_id;
            });
        },
        
        update: function (success, error) {
            function onSuccess(contacts) {
                success && success(contacts);
            }

            function onError(e) {
                error && error(e);
            }

            var options = new ContactFindOptions();
            //options.filter   = "Bob";
            options.multiple = true;
            options.desiredFields = [navigator.contacts.fieldType.id];
            options.hasPhoneNumber = true;
            var fields = [navigator.contacts.fieldType.id, navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers];
            navigator.contacts.find(fields, onSuccess, onError, options);
        }
    }
})();