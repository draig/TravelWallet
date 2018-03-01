service.engine = (function () {

    function addToDebtMap(debtMap, user_id) {
        if (!debtMap[user_id]) {
            debtMap[user_id] = {
                user_id: user_id,
                pay: 0,
                owe: 0
            };
        }

    }

    return {

        calculate: function (debt_id) {
            var payments = service.payment.getByDebtId(debt_id),
                paymentMap = {},
                creditors = [],
                debtors = [],
                debtBook = [];

            payments.forEach(function (payment) {
                addToDebtMap(paymentMap, payment.payer);
                paymentMap[payment.payer].pay += payment.amount;

                payment.participant.forEach(function (part) {
                    addToDebtMap(paymentMap, part);
                    paymentMap[part].owe += payment.amount / payment.participant.length;
                });
            });

            for (var user_id in paymentMap) {
                var difference = paymentMap[user_id].pay - paymentMap[user_id].owe;
                (difference > 0 ? creditors : debtors).push({
                    user_id: user_id,
                    amount: Math.abs(difference)
                });
            }

            creditors.sort(function (first, second) {
                return first.amount - second.amount;
            });

            debtors.sort(function (first, second) {
                return first.amount - second.amount;
            });


            for (var i = 0; i < creditors.length && i < debtors.length;) {
                var creditor = creditors[0],
                    debtor = debtors[0];
                if (creditor.amount > debtor.amount) {

                }

            }

        }
    }
})();