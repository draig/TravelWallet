service.currency = (function () {

    function currencyRatesConverting(db_currency_rates) {
        var currency_rates = {};
        db_currency_rates.forEach(function (record) {
            if(!currency_rates[record.from_currency_id]) {
                currency_rates[record.from_currency_id] = {};
            }
            currency_rates[record.from_currency_id][record.to_currency_id] = record.rate;
        });

        return currency_rates;
    }

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

        rateList: function (success, error) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM currency_rates', [], function (tx, results) {
                    success && success(currencyRatesConverting(utils.sqlResultSetToArray(results)));
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
        },

        exchange: function (from_currency_id, to_currency_id, amount) {
            // TODO review amount value. Must be numeric everywhere
            amount = +amount;

            if (from_currency_id === to_currency_id) {
                return amount;
            } else if(app.data.currency_rates[from_currency_id] && app.data.currency_rates[from_currency_id][to_currency_id]) {
                return app.data.currency_rates[from_currency_id][to_currency_id] * amount;
            } else {
                return app.data.currency_rates['usd'][to_currency_id] / app.data.currency_rates['usd'][from_currency_id] * amount;
            }
        }
    }
})();