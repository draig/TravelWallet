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
        }
    ],
    data: function () {
        return {
            contacts: [],
            debts: [],
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
    tx.executeSql('CREATE TABLE IF NOT EXISTS payments (payment_id, debt_id, title, currency, payer, participant, synch)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS currencies (currensy_id unique, title, sign)');
});

db.transaction(function (tx) {
    tx.executeSql('INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES (`usd`, `UDS`, `$`)');
    tx.executeSql('INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES (`eur`, `EUR`, `€`)');
    tx.executeSql('INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES (`byn`, `BYN`, ``)');
    tx.executeSql('INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES (`rub`, `RUB`, `₽`)');
    tx.executeSql('INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES (`kzt`, `KZT`, `₽`)');
    tx.executeSql('INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES (`uah`, `UAH`, ``)');
});

db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM users WHERE log_in=?', [true], function (tx, results) {
        if(!results.rows.length) {
            mainView.router.navigate('/login-screen/');
        }
    }, function (error) {
        console.log(error);
    });
});



function initAppData() {
    var initTaskCount = 3;

    function finish() {
        --initTaskCount;
        if(!initTaskCount) {
            app.views.current.router.navigate('/debt/list/', {
                animate: false
            });
        }
    }

    service.currency.list(function (currencies) {
        app.data.currencies = currencies;
        finish();
    });

    service.contact.list(function (contacts) {
        app.data.contacts = contacts;
        finish();
    });

    service.debt.list('active', function (debts) {
        app.data.debts = debts;
        finish();
    });
}

$$(document).on('page:init', '.page[data-name="init"]', function (e) {
    initAppData();
});
































$$(document).on('page:init', '.page[data-name="new-debt"]', function (e) {
    function onSuccess(contacts) {
        alert('Found ' + contacts.length + ' contacts.');
    };

    function onError(contactError) {
        alert('onError!');
    };

// find all contacts with 'Bob' in any name field
    var options = new ContactFindOptions();
    //options.filter   = "Bob";
    options.multiple = true;
    options.desiredFields = [navigator.contacts.fieldType.id];
    options.hasPhoneNumber = true;
    var fields = [navigator.contacts.fieldType.id, navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers];
    navigator.contacts.find(fields, onSuccess, onError, options);
});
