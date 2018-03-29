service.sync = (function () {

    function getData() {
        var data = {};

        data.user = service.user.forSync();
        if(!data.user) delete data.user;

        data.debts = service.debt.forSync();
        if(!data.debts.length) delete data.debts;

        data.contacts = service.contact.forSync();
        if(!data.contacts.length) delete data.contacts;

        data.payments = service.payment.forSync();
        if(!data.payments.length) delete data.payments;
        return JSON.stringify(data);
    }

    function syncback(data) {
        service.user.syncback();
        data.contacts && service.contact.syncback(data.contacts);
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