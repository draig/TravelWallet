service.sync = (function () {

    function getData() {
        var data = {};

        data.debts = service.debt.forSync();
        if(!data.debts.length) delete data.debts;

        data.users = service.user.forSync();
        if(!data.users.length) delete data.users;

        data.payments = service.payment.forSync();
        if(!data.payments.length) delete data.payments;
        return JSON.stringify(data);
    }

    function syncback(data) {
        data.users && service.user.syncback(data.users);
        data.debts && service.debt.syncback(data.debts);
        data.payments && service.payments.syncback(data.payments);
    }

    return {
        start: function (success, error) {
            Framework7.request.setup({headers: {'Authorization': app.data.user.auth_token}, contentType: 'application/json'});
            setInterval(service.sync.attempt, 20000);
            service.sync.attempt(success, error);
        },

        attempt: function(success, error) {
            console.log('start sync');
            app.request.postJSON(endpoint + '/sync', getData(), function (data) {
                syncback(data);
                success && success(data);
            }, function (e) {
                error && error(e);
            });
        }
    }
})();