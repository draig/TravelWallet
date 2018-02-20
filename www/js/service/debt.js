service.debt = (function () {
    var status = {
        ACTIVE: 'active',
        ARCHIVED: 'archived'
    };

    return {
        create: function (data, success, error) {
            var debtData = [
                utils.uuid(),
                data.title,
                data.currency.join(','),
                data.participant.join(','),
                0,
                status.ACTIVE,
                0
            ];

            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO debts (debt_id, title, currency, participant, owe, status, last_synch) VALUES (?, ?, ?, ?, ?, ?, ?)', debtData, function (tx, results) {
                    var result = app.utils.extend(data, {
                        uuid: debtData[0],
                        currency: [],
                        participant: [],
                        owe: debtData[4],
                        status: debtData[5],
                        last_synch: debtData[6]
                    });
                    success && success(result);
                }, function (e) {
                    error && error(e);
                });
            });
        },

        list: function (status, success, error) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM debts WHERE status=?', [status], function (tx, results) {
                    success && success(utils.sqlResultSetToArray(results));
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
        }
    }
})();