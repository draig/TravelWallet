service.auth = (function () {

    return {

        send_sms: function (data, success, error) {
            app.request.post(endpoint + '/auth/send_sms', data, function (data) {
                success && success(data);
            });
        },

        verify_code: function (data, success, error) {
            app.request.post(endpoint + '/auth/verify_code', data, function (data) {
                service.user.create(app.utils.extend(data.user, {auth_token: data.auth_token}), function (tx, results) {
                    success && success(results);
                }, function (e) {
                    error && error(e);
                });
            }, function (e) {
                error && error(e)
            }, 'json');
        }
    }
})();