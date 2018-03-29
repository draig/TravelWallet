service.contact = (function () {

    return {
        create: function (debt_id) {

        },

        list: function (success, error) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM contacts', [], function (tx, results) {
                    var contacts = utils.sqlResultSetToArray(results);
                    contacts.forEach(function (contact) { contact.phones =  contact.phones.split(',')});
                    success && success(contacts);
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
            if (app.data.user.user_id == contact_id) return service.user.contact();
            return app.data.contacts.find(function (contact) {
                return contact.contact_id === contact_id;
            });
        },

        /*{
            addresses: null,
            birthday: null,
            categories: null,
            displayName: "Сергей Солонкевич",
            emails: null,
            id: "1",
            ims: null,
            name: {familyName: "Солонкевич", givenName:"Сергей", formatted:"Сергей Солонкевич"},
            nickname: null,
            note: null,
            organizations: null,
            phoneNumbers: [{id: "7", pref: false, value: "+375297240735", type: "mobile"}, {id: "9", pref: false, value: "+375297240735", type: "mobile"}],
            photos: null,
            rawId: "1",
            urls: null
        }*/

        sync_w_device: function (success, error) {
            function onSuccess(contacts) {
                var normalized_contacts = service.contact.normalize(contacts);
                service.contact.merge_contacts(normalized_contacts);
                success && success(contacts);
            }

            function onError(e) {
                error && error(e);
            }

            if(device.platform === 'browser') {
                return onSuccess([]);
            }

            var options = new ContactFindOptions();
            options.multiple = true;
            options.desiredFields = [navigator.contacts.fieldType.id, navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers];/*navigator.contacts.fieldType.name*/
            options.hasPhoneNumber = true;
            var fields = [navigator.contacts.fieldType.id];
            navigator.contacts.find(fields, onSuccess, onError, options);
            /*var contacts = [{
                addresses: null,
                birthday: null,
                categories: null,
                displayName: "Сергей Солонкевич",
                emails: null,
                id: "1",
                ims: null,
                name: {familyName: "Солонкевич", givenName:"Сергей", formatted:"Сергей Солонкевич"},
                nickname: null,
                note: null,
                organizations: null,
                phoneNumbers: [{id: "7", pref: false, value: "+375297240735", type: "mobile"}, {id: "9", pref: false, value: "+375297240735", type: "mobile"}],
                photos: null,
                rawId: "1",
                urls: null
            }];
            onSuccess(contacts);*/
        },

        normalize: function (plugin_contacts) {
            return plugin_contacts.map(function (plugin_contact) {
                return {
                    contact_id: 'local-' + plugin_contact.id,
                    name: plugin_contact.displayName,
                    phones: plugin_contact.phoneNumbers.map(function (phone) { return utils.normalizePhone(phone.value) })
                };
            });
        },

        add: function (data, success, error) {
            var contactData = [
                data.contact_id,
                data.name,
                data.ava || null,
                (data.phones || []).join(','),
                data.install_app || 'false',
                data.sync || 'false'
            ];
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO contacts (contact_id, name, ava, phones, install_app, sync) VALUES (?, ?, ?, ?, ?, ?)', contactData, function (tx, results) {
                    var result = app.utils.extend({}, data, {
                        sync: contactData[5]
                    });
                    app.data.contacts.push(result);
                    success && success(result);
                }, function (tx, e) {
                    error && error(e);
                });
            });
        },

        update: function (data, success, error) {
            var contactData = [
                data.contact_id,
                data.name,
                data.ava,
                (data.phones || []).join(','),
                data.install_app,
                data.sync || 'false',
                data.local_id || data.contact_id
            ];
            db.transaction(function (tx) {
                tx.executeSql('UPDATE contacts SET id=?, name=?, ava=?, phones=?, install_app=?, sync=? WHERE contact_id=?', contactData, function (tx, results) {
                    var result = app.utils.extend({}, data, {
                        //phones: contactData[4].split(','),
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
            return app.data.contacts.filter(function (contact) {
                if (contact.sync === 'false') {
                    contact.sync = 'pending';
                    return true;
                }
            });
        },

        syncback: function (synced_contacts) {
            synced_contacts.forEach(function (synced_contact) {
                var local_contact = service.contact.get(synced_contact.local_id);
                service.contact.update(app.utils.extend({}, local_contact, {
                    install_app: true,
                    sync: 'true'
                }), function (result) {
                    local_contact = result;
                });
            });
            app.data.contacts.forEach(function (contact) {
                if (contact.sync === 'pending') {
                    service.contact.update(app.utils.extend({}, contact, {sync: 'true'}), function (result) {
                        contact = result;
                    });
                }
            });
        },

        merge_contacts: function (device_contacts) {
            device_contacts.forEach(function (device_contact) {
                var contact_w_same_id = app.data.contacts.find(function (contact) {
                    return contact.contact_id === device_contact.contact_id;
                });
                if (contact_w_same_id) {
                    var intersection = utils.intersection(contact_w_same_id.phones, device_contact.phones);
                    if (intersection.length) {
                        return;
                    }
                }
                var duplicate = app.data.contacts.find(function (contact) {
                    return !!utils.intersection(device_contact.phones, contact.phones).length;
                });

                if (!duplicate) {
                    service.contact.add(device_contact);
                }
            });
        }
    }
})();