service.debt = (function () {
    var status = {
        ACTIVE: 'active',
        ARCHIVED: 'archived'
    };

    return {

        create: function (data, success, error) {
            var debtData = [
                data.debt_id || ('local-' + utils.uuid()),
                data.title,
                data.currency.join(','),
                data.participant.join(','),
                status.ACTIVE,
                data.sync || 'false'
            ];
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO debts (debt_id, title, currency, participant, status, sync) VALUES (?, ?, ?, ?, ?, ?)', debtData, function (tx, results) {
                    var result = app.utils.extend(data, {
                        debt_id: debtData[0],
                        status: debtData[4],
                        sync: debtData[5]
                    });
                    success && success(result);
                }, function (e) {
                    error && error(e);
                });
            });
        },

        update: function (data, success, error) {
            var debtData = [
                data.debt_id,
                data.title,
                data.currency.join(','),
                data.participant.join(','),
                data.sync || 'false',
                data.local_id || data.debt_id
            ];
            db.transaction(function (tx) {
                tx.executeSql('UPDATE debts SET debt_id=?, title=?, currency=?, participant=?, sync=? WHERE debt_id=?', debtData, function (tx, results) {
                    var result = app.utils.extend(service.debt.get(debtData[5]), data, {sync: debtData[4], local_id: null});
                    success && success(result);
                }, function (e) {
                    error && error(e);
                });
            });
        },

        get: function (debt_id) {
            return app.data.debts.find(function (debt) {
                return debt.debt_id === debt_id;
            });
        },

        list: function (status, success, error) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM debts WHERE status=?', [status], function (tx, results) {
                    var debts = utils.sqlResultSetToArray(results);
                    debts.forEach(function (debt) {
                        debt.participant = debt.participant.split(',');
                        debt.currency = debt.currency.split(',');
                    });
                    success && success(debts);
                }, function (e) {
                    error && error(e);
                });
            });
        },

        archive: function (debt_id, success, error) {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE debts SET status=? WHERE debt_id=?', [status.ARCHIVED, debt_id], function (tx, results) {
                    var archive = app.data.debts.remove(function(el) {
                        return el['debt_id'] == debt_id;
                    });
                    if(archive.length) app.data.archived_debts.push(app.utils.extend(archive[0], {status: status.ARCHIVED}));

                    success && success(utils.sqlResultSetToArray(results));
                }, function (e) {
                    error && error(e);
                });
            });
        },

        forSync: function () {
            return app.data.debts.filter(function (debt) {
                return debt.sync === 'false';
            });
        },

        syncback: function (synced_debts) {
            synced_debts.forEach(function (synced_debt) {
                app.utils.extend(synced_debt, {sync: true});
                if(synced_debt.local_id) {
                    service.debt.update(synced_debt);
                } else if (service.debt.get(synced_debt.debt_id)) {
                    service.debt.update(synced_debt);
                } else {
                    service.debt.create(synced_debt);
                }
            });
        }
    }
})();