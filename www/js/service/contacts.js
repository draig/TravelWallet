service.contact = (function () {

    return {
        create: function (debt_id) {

        },
        list: function (success, error) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM contacts', [], function (tx, results) {
                    success && success(utils.sqlResultSetToArray(results));
                }, function (e) {
                    error && error(e);
                });
            });
        }
    }
})();