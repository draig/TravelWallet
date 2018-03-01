service.engine = (function () {

    function addToDebtMap(debtMap, user_id) {
        if(!debtMap[user_id]) {
            debtMap[user_id] = {
                pay: 0,
                owe: 0
            };
        }

    }

    return {

        calculate: function (debt_id) {
            var payments = service.payment.getByDebtId(debt_id),
                debtMap = {};
            payments.forEach(function (payment) {
                addToDebtMap(debtMap, payment.payer);
                debtMap[payment.payer].pay += payment.amount;

                payment.participant.forEach(function (part) {
                    addToDebtMap(debtMap, part);
                    debtMap[part].owe += payment.amount / payment.participant.length;
                });
            });
        }
    }
})();