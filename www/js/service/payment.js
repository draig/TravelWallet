service.payment = (function () {

    return {

        create: function (data, success, error) {
            var debtPayment = [
                utils.uuid(),
                data.debt_id,
                data.title,
                data.currency,
                data.payer,
                data.participant.join(','),
                false
            ];

            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO payments (payment_id, debt_id, title, currency, payer, participant, synch) VALUES (?, ?, ?, ?, ?, ?, ?)', debtPayment, function (tx, results) {
                    var result = app.utils.extend(data, {
                        payment_id: debtPayment[0],
                        participant: [],
                        synch: debtPayment[5]
                    });
                    success && success(result);
                }, function (e) {
                    error && error(e);
                });
            });
        },

        list: function (debt_id, success, error) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM payments WHERE debt_id=?', [debt_id], function (tx, results) {
                    success && success(utils.sqlResultSetToArray(results));
                }, function (e) {
                    error && error(e);
                });
            });
        }
    }
})();