service.currency = (function () {

    return {

        list: function (success, error) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM currencies', [], function (tx, results) {
                    success && success(utils.sqlResultSetToArray(results));
                }, function (e) {
                    error && error(e);
                });
            });
        },

        getByIds: function (ids) {
            return app.data.currencies.filter(function (currency) {
                return ids.indexOf(currency.currency_id) !== -1;
            });
        },

        get: function (currency_id) {
            return app.data.currencies.find(function (currency) {
                return currency.currency_id === currency_id;
            });
        }
    }
})();