service.debt = (function () {
    var status = {
        ACTIVE: 'active',
        ARCHIVED: 'archived'
    };

    return {

        create: function (data, success, error) {
            var debtData = [
                'local-' + utils.uuid(),
                data.title,
                data.currency.join(','),
                data.participant.join(','),
                status.ACTIVE,
                false
            ];
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO debts (debt_id, title, currency, participant, status, sync) VALUES (?, ?, ?, ?, ?, ?)', debtData, function (tx, results) {
                    var result = app.utils.extend(data, {
                        debt_id: debtData[0],
                        status: debtData[5],
                        sync: debtData[6]
                    });
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
        
        update: function (data, success, error) {
            var debtData = [
                data.title,
                data.currency.join(','),
                data.participant.join(','),
                data.debt_id
            ];
            db.transaction(function (tx) {
                tx.executeSql('UPDATE debts SET title=?, currency=?, participant=? WHERE debt_id=?', debtData, function (tx, results) {
                    var result = app.utils.extend(service.debt.get(data.debt_id), data);
                    success && success(result);
                }, function (e) {
                    error && error(e);
                });
            });
        }
    }
})();