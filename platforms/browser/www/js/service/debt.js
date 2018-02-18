service.debt = (function () {
    var status = {
        ACTIVE: 'active'
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
                    success && success(results);
                }, function (e) {
                    error && error(e);
                });
            });
        },
        list: function (status) {

        }
    }
})();