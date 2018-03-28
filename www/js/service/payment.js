service.payment = (function () {

    return {

        create: function (data, success, error) {
            var debtPayment = [
                data.payment_id || ('local-' + utils.uuid()),
                data.debt_id,
                data.title,
                data.currency,
                data.amount,
                data.payer,
                data.participant.join(','),
                data.sync || 'false'
            ];

            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO payments (payment_id, debt_id, title, currency, amount, payer, participant, sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', debtPayment, function (tx, results) {
                    var result = app.utils.extend(data, {
                        payment_id: debtPayment[0],
                        sync: debtPayment[7]
                    });
                    app.data.payments.push(result);
                    success && success(result);
                }, function (e) {
                    error && error(e);
                });
            });
        },

        update: function (data, success, error) {
            var debtPayment = [
                data.payment_id,
                data.title,
                data.currency,
                data.amount,
                data.payer,
                data.participant.join(','),
                data.sync || 'false',
                data.local_id || data.payment_id
            ];
            db.transaction(function (tx) {
                tx.executeSql('UPDATE payments SET payment_id=?, title=?, currency=?, amount=?, payer=?, participant=?, sync=? WHERE payment_id=?', debtPayment, function (tx, results) {
                    var result = app.utils.extend(service.payment.get(debtPayment[7]), data, {sync: debtPayment[6], local_id: null});
                    success && success(result);
                }, function (e) {
                    error && error(e);
                });
            });
        },

        getByDebtId: function (debt_id) {
            return app.data.payments.filter(function (payment) {
                return payment.debt_id === debt_id;
            });
        },

        get: function (payment_id) {
            return app.data.payments.find(function (payment) {
                return payment.payment_id === payment_id;
            });
        },

        list: function (success, error) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM payments', [], function (tx, results) {
                    var payments = utils.sqlResultSetToArray(results, {numberFields: ['amount']});
                    payments.forEach(function (payment) {
                        payment.participant = payment.participant.split(',');
                    });
                    success && success(payments);
                }, function (e) {
                    error && error(e);
                });
            });
        },

        forSync: function () {
            return app.data.payments.filter(function (payment) {
                return payment.sync === 'false';
            });
        },

        syncback: function (synced_payments) {
            synced_payments.forEach(function (synced_payment) {
                app.utils.extend(synced_payment, {sync: true});
                if(synced_payment.local_id) {
                    service.payment.update(synced_payment);
                } else if (service.payment.get(synced_payment.payment_id)) {
                    service.payment.update(synced_payment);
                } else {
                    service.payment.create(synced_payment);
                }
            });
        }
    }
})();