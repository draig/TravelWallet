service.init = (function () {

    var initChain = [],
        taskCount = 0,
        after = null,
        status = {
            INIT: 'init',
            WAITING: 'waiting',
            PROCESSING: 'processing',
            FINISHED: 'finished'
        };

    function checkWaitingStatus() {
        initChain.filter(function (chainEl) {
            return chainEl.status === status.WAITING;
        }).forEach(function (waitingEl) {
            initChain.some(function (chainEl) {
                return waitingEl.require.indexOf(chainEl.name) !== -1 && chainEl.status !== status.FINISHED;
            }) || callChainEl(waitingEl);
        });
    }

    function callChainEl(chainEl) {
        ++taskCount;
        chainEl.status = status.PROCESSING;
        chainEl.func.apply({}, chainEl.arg)
    }

    return {

        add: function (func, arg, name, require) {
            initChain.push({
                func: func,
                arg: Array.isArray(arg) ? arg : [arg],
                name: !Array.isArray(name) ? name : undefined,
                require: require ? require : (Array.isArray(name) ? name : []),
                status: status.INIT
            });
        },

        start: function (a) {
            after = a;
            initChain.forEach(function (chainEl) {
                if (!chainEl.require.length) {
                    callChainEl(chainEl);
                } else {
                    chainEl.status = status.WAITING;
                }
            });
        },

        finish: function (name) {
            --taskCount;

            if (name) {
                initChain.filter(function (chainEl) {
                    return chainEl.name === name;
                }).forEach(function (chainEl) {
                    chainEl.status = status.FINISHED;
                });
            }
            checkWaitingStatus();

            if (!taskCount) {
                after && after();
            }
        }
    }
})();