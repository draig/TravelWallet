var $$ = Dom7,
    endpoint = 'https://example.com',
    db = window.openDatabase("travel_wallet", "1.0", "Travel Wallet DB", 1000000);


var app = new Framework7({
    root: '#app',
    name: 'TravelWallet',
    id: 'com.startappsoft.travelwallet',
    version: '1.0.0',
    panel: {
        swipe: 'left'
    },

    routes: [
        {
            path: '/login-screen/',
            loginScreen: {
                componentUrl: './pages/login-screen.html'
            }
        },
        {
            path: '/debt/list/',
            componentUrl: './pages/debt/list.html'
        },
        {
            path: '/debt/new/',
            componentUrl: './pages/debt/new.html'
        },
        {
            path: '/debt/show/:debt_id/',
            componentUrl: './pages/debt/show.html'
        },
        {
            path: '/payment/new/:debt_id/',
            componentUrl: './pages/payment/new.html'
        }
    ],
    data: function () {
        return {
            contacts: [],
            debts: [],
            payments: [],
            archived_debts: [],
            currencies: []
        };
    }
});

var mainView = app.views.create('.view-main');

db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS users (user_id, device_id, phone_number, log_in)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS contacts (contact_id, name, phone_number, phones, install_app)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS debts (debt_id, title, currency, participant, owe, status, last_synch)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS payments (payment_id, debt_id, title, amount, currency, payer, participant, synch)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS currencies (currency_id UNIQUE, title, sign)');
});

db.transaction(function (tx) {
    tx.executeSql("INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES ('usd', 'UDS', '$')");
    tx.executeSql("INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES ('eur', 'EUR', '€')");
    tx.executeSql("INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES ('byn', 'BYN', '')");
    tx.executeSql("INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES ('rub', 'RUB', '₽')");
    tx.executeSql("INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES ('kzt', 'KZT', '₽')");
    tx.executeSql("INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES ('uah', 'UAH', '')");
});

function initAppData() {

    service.init.add(service.currency.list, function (currencies) {
        app.data.currencies = currencies;
        service.init.finish('currency');
    }, 'currency');

    service.init.add(service.contact.list, function (contacts) {
        app.data.contacts = contacts;
        service.init.finish('contact');
    }, 'contact');

    service.init.add(service.payment.list, function (payments) {
        app.data.payments = payments;
        service.init.finish('payments');
    }, 'payments');

    service.init.add(service.debt.list, ['active', function (debts) {
        app.data.debts = debts;
        service.init.finish();
    }], ['currency', 'contact', 'payments']);

    service.init.add(service.user.getLogIn, function (user) {
        app.data.user = user;
        service.init.finish('user');
    }, 'user');

    service.init.start(function () {
        if (app.data.user) {
            app.views.current.router.navigate('/debt/list/', {
                animate: false
            });
        } else {
            mainView.router.navigate('/login-screen/', {
                animate: false
            });
        }
    });
}

$$(document).on('page:init', '.page[data-name="init"]', function (e) {
    initAppData();
});

$$(document).on('page:init', '.page[data-name="new-debt"]', function (e) {
    function onSuccess(contacts) {
        alert('Found ' + contacts.length + ' contacts.');
    }

    function onError(contactError) {
        alert('onError!');
    }

// find all contacts with 'Bob' in any name field
    var options = new ContactFindOptions();
    //options.filter   = "Bob";
    options.multiple = true;
    options.desiredFields = [navigator.contacts.fieldType.id];
    options.hasPhoneNumber = true;
    var fields = [navigator.contacts.fieldType.id, navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers];
    navigator.contacts.find(fields, onSuccess, onError, options);
});
