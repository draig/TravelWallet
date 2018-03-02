service.engine = (function () {

    var debtBookCache = {};

    function addToDebtMap(debtMap, user_id) {
        if (!debtMap[user_id]) {
            debtMap[user_id] = {
                user_id: user_id,
                pay: 0,
                owe: 0
            };
        }
    }

    function name (id) {
        return service.contact.get(id).name;
    }

    return {

        calculate: function (debt_id) {
            var payments = service.payment.getByDebtId(debt_id),
                paymentMap = {},
                creditors = [],
                debtors = [],
                debtBook = [];

            if(debtBookCache[debt_id] && (debtBookCache[debt_id].hash === payments.join().hashCode())) {
                return debtBookCache[debt_id].book;
            }

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
                return second.amount - first.amount;
            });

            debtors.sort(function (first, second) {
                return second.amount - first.amount;
            });


            while (creditors.length && debtors.length) {
                var creditor = creditors[0],
                    debtor = debtors[0],
                    extinguished = creditor.amount < debtor.amount;

                (extinguished ? debtor : creditor).amount -= (extinguished ? creditor : debtor).amount;
                (extinguished ? creditors : debtors).shift();

                debtBook.push({
                    creditor: creditor.user_id,
                    creditor_name: name(creditor.user_id),
                    debtor: debtor.user_id,
                    debtor_name: name(debtor.user_id),
                    amount: extinguished ? creditor.amount : debtor.amount
                });
            }

            debtBookCache[debt_id] = {
                hash: payments.join().hashCode(),
                book: debtBook
            };
            return debtBook;
        }
    }
})();