service.engine = (function () {

    var debtBookCache = {};
    var detailsCache = {};

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

    function isCached(debt_id, currency_id) {
        var payments = service.payment.getByDebtId(debt_id);
        return debtBookCache[debt_id] && debtBookCache[debt_id][currency_id] &&
            (debtBookCache[debt_id][currency_id].hash === JSON.stringify(payments).hashCode());
    }

    return {

        calculate: function (debt_id, currency_id) {
            if(isCached(debt_id, currency_id)) {
                return debtBookCache[debt_id][currency_id].book;
            }

            var payments = service.payment.getByDebtId(debt_id),
                paymentMap = {},
                creditors = [],
                debtors = [],
                debtBook = [];

            payments.forEach(function (payment) {
                addToDebtMap(paymentMap, payment.payer);
                paymentMap[payment.payer].pay += service.currency.exchange(payment.currency, currency_id, payment.amount);

                payment.participant.forEach(function (part) {
                    addToDebtMap(paymentMap, part);
                    paymentMap[part].owe += service.currency.exchange(payment.currency, currency_id, payment.amount) / payment.participant.length;
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

            (debtBookCache[debt_id]||(debtBookCache[debt_id] = {}))[currency_id] = {
                hash: payments.join().hashCode(),
                book: debtBook,
                map: paymentMap
            };
            return debtBook;
        },
        
        details: function (contact_id, debt_id, currency_id) {
            if(!isCached(debt_id, currency_id)) {
                service.engine.calculate(debt_id, currency_id);
            }

            var paymentMap = debtBookCache[debt_id][currency_id].map;
            addToDebtMap(paymentMap, contact_id);

            return {
                spent: paymentMap[contact_id].owe,
                pay: paymentMap[contact_id].pay,
                debtor: paymentMap[contact_id].owe > paymentMap[contact_id].pay,
                difference: Math.abs(paymentMap[contact_id].owe - paymentMap[contact_id].pay)
            };
        }
    }
})();