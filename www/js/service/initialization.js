
service.init = (function () {

    var initChain = [];

    return {

        add: function (func, arg, name, require) {
            initChain.push(arguments);
        },

        start: function () {
            initChain.forEach(function (t) {
                if(t[3] && t[3].length) {

                } else {

                }
            });
        },

        finish: function (name) {

        },

        after: function (func, arg) {

        }
    }
})();