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
        return data;
    }

    function syncback() {
        service.user.syncback();
    }

    return {
        start: function (success, error) {
            Framework7.request.setup({headers: {'Authorization': app.data.user.auth_token}});
            setInterval(service.sync.attempt, 20000);
            service.sync.attempt(success, error);
        },

        attempt: function(success, error) {
            console.log('start sync');
            app.request.post(endpoint + '/sync', getData(), function (data) {
                syncback();
                console.log(data);
                success && success(data);
            }, function (e) {
                error && error(e);
            }, 'json');
        }
    }
})();