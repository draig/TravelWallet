var $$ = Dom7,
    endpoint = 'tcp://127.0.0.1:3000',
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
            path: '/debt/edit/:debt_id/',
            componentUrl: './pages/debt/edit.html'
        },
        {
            path: '/debt/show/:debt_id/',
            componentUrl: './pages/debt/show.html',
            tabs: [
                {
                    path: '/',
                    id: 'payments',
                    componentUrl: './pages/payment/list.html'
                },
                {
                    path: '/calculations/',
                    id: 'calculation',
                    componentUrl: './pages/payment/calculation.html'
                }
            ]
        },
        {
            path: '/payment/new/:debt_id/',
            componentUrl: './pages/payment/new.html'
        },
        {
            path: '/user/edit/',
            componentUrl: './pages/user/edit.html'
        },
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
    tx.executeSql('CREATE TABLE IF NOT EXISTS users (user_id, name, device_id, phone, log_in, ava, auth_token, sync)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS contacts (contact_id UNIQUE, name, phone, phones, ava, install_app, sync)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS debts (debt_id, title, currency, participant, owe, status, sync)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS payments (payment_id, debt_id, title, amount, currency, payer, participant, sync)');
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

db.transaction(function (tx) {
    tx.executeSql('INSERT OR IGNORE INTO contacts (contact_id, name, phone, phones, install_app) VALUES (?, ?, ?, ?, ?)',
        ['local-1', 'Andrei Dahskevich', '+375447604989', '+375447604989', true]);
    tx.executeSql('INSERT OR IGNORE INTO contacts (contact_id, name, phone, phones, install_app) VALUES (?, ?, ?, ?, ?)',
        ['local-2', 'Tom Cruise', '+375296230945', '+375296230945,+375292879876', true]);
    tx.executeSql('INSERT OR IGNORE INTO contacts (contact_id, name, phone, phones, install_app) VALUES (?, ?, ?, ?, ?)',
        ['local-3', 'Leonardo DiCaprio', '+375259085411', '+375259085411', false]);
    tx.executeSql('INSERT OR IGNORE INTO contacts (contact_id, name, phone, phones, install_app) VALUES (?, ?, ?, ?, ?)',
        ['local-4', 'Jennifer Lawrence ', '+375445890980', '+375445890980', false]);
});

function initAppData() {

    service.init.add(service.user.getLogIn, function (user) {
        app.data.user = user;
        service.init.finish('user');
    }, 'user');

    service.init.add(function () {
        if (!app.data.user) {
            app.views.current.router.navigate('/login-screen/', {
                animate: false
            });
        } else {
            service.init.finish('login');
        }
    }, [], 'login', ['user']);

    service.init.add(function () {
        if (!app.data.user.name) {
            app.views.current.router.navigate('/user/edit/', {
                animate: false
            });
        } else {
            service.init.finish('profile');
        }
    }, [], 'profile', ['login']);

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
        service.init.finish('debt');
    }], 'debt');

    service.init.start(function () {
        app.views.current.router.navigate('/debt/list/', {
            animate: false
        });
    });
}

$$(document).on('page:init', '.page[data-name="init"]', function (e) {
    initAppData();
});
