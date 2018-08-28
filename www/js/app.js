var $$ = Dom7,
    endpoint = 'http://192.168.1.40:3001',
    db = window.openDatabase("travel_wallet", "1.0", "Travel Wallet DB", 1000000);


var app = new Framework7({
    root: '#app',
    name: 'TravelWallet',
    id: 'com.startappsoft.travelwallet',
    version: '1.0.0',
    panel: {
        swipe: 'left'
    },

    // smartSelect: {
    //     renderPopup: function () {
    //         var ss = this;
    //         var pageTitle = ss.params.pageTitle;
    //         if (typeof pageTitle === 'undefined') {
    //             pageTitle = ss.$el.find('.item-title').text().trim();
    //         }
    //         var popupHtml = "\n      <div class=\"popup smart-select-popup\" data-select-name=\"" + (ss.selectName) + "\">\n        <div class=\"view\">\n          <div class=\"page smart-select-page" + (ss.params.searchbar ? ' page-with-subnavbar' : '') + (ss.params.selectall ? ' page-with-select-all' : '') + "\" data-name=\"smart-select-page\">\n            <div class=\"navbar" + (ss.params.navbarColorTheme ? ("theme-" + (ss.params.navbarColorTheme)) : '') + "\">\n              <div class=\"navbar-inner sliding\">\n                <div class=\"left\">\n                  <a href=\"#\" class=\"link popup-close\">\n                    <i class=\"icon icon-back\"></i>\n                    <span class=\"ios-only\">" + (ss.params.popupCloseLinkText) + "</span>\n                  </a>\n                </div>\n                " + (pageTitle ? ("<div class=\"title\">" + pageTitle + "</div>") : '') + "\n                " + (ss.params.searchbar ? ("<div class=\"subnavbar\">" + (ss.renderSearchbar()) + "</div>") : '') + "\n              </div>\n            </div>\n            " + (ss.params.searchbar ? '<div class="searchbar-backdrop"></div>' : '') + "\n            <div class=\"page-content\">\n              " + (ss.params.selectall ? "<div class=\"select-all\" style=\"text-align:  center;\">\n<a class=\"link\" href=\"#\" style=\"margin-top: 16px;font-size: 16px;\">select all</a>\n</div>\n" : '') + "<div class=\"list smart-select-list-" + (ss.id) + " " + (ss.params.virtualList ? ' virtual-list' : '') + (ss.params.formColorTheme ? ("theme-" + (ss.params.formColorTheme)) : '') + "\">\n                <ul>" + (!ss.params.virtualList && ss.renderItems(ss.items)) + "</ul>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    ";
    //         return popupHtml;
    //     },
    //     on: {
    //         opened: function () {
    //             console.log('open');
    //         }
    //     }
    // },

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
            path: '/payment/edit/:payment_id/',
            componentUrl: './pages/payment/edit.html'
        },
        {
            path: '/user/edit/',
            componentUrl: './pages/user/edit.html'
        },
        {
            path: '/currency/list/',
            componentUrl: './pages/currency/list.html'
        }
    ],
    data: function () {
        return {
            contacts: [],
            debts: [],
            payments: [],
            archived_debts: [],
            currencies: [],
            currency_rates: []
        };
    }
});

var mainView = app.views.create('.view-main');

db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS users (user_id, name, device_id, phone, log_in, ava, auth_token, sync)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS contacts (contact_id UNIQUE, name, phone, phones, ava, install_app, sync)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS debts (debt_id, title, currency, participant, owe, status, sync)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS payments (payment_id, debt_id, title, amount NUM, currency, payer, participant, deleted, sync)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS currencies (currency_id UNIQUE, title, sign)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS currency_rates (from_currency_id, to_currency_id, rate NUM, PRIMARY KEY (from_currency_id, to_currency_id))');
});

db.transaction(function (tx) {
    tx.executeSql("INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES ('usd', 'USD', '$')");
    tx.executeSql("INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES ('eur', 'EUR', '€')");
    tx.executeSql("INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES ('byn', 'BYN', '')");
    tx.executeSql("INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES ('rub', 'RUB', '₽')");
    tx.executeSql("INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES ('uah', 'UAH', '')");
    tx.executeSql("INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES ('sek', 'SEK', '')");
    tx.executeSql("INSERT OR IGNORE INTO currencies (currency_id, title, sign) VALUES ('nok', 'NOK', '')");

    tx.executeSql("INSERT OR IGNORE INTO currency_rates (from_currency_id, to_currency_id, rate) VALUES ('usd', 'eur', 0.8768600002)");
    tx.executeSql("INSERT OR IGNORE INTO currency_rates (from_currency_id, to_currency_id, rate) VALUES ('eur', 'usd', 1.1404329081)");
    tx.executeSql("INSERT OR IGNORE INTO currency_rates (from_currency_id, to_currency_id, rate) VALUES ('usd', 'byn', 2.0523278856)");
    tx.executeSql("INSERT OR IGNORE INTO currency_rates (from_currency_id, to_currency_id, rate) VALUES ('byn', 'usd', 0.4872515776)");
    tx.executeSql("INSERT OR IGNORE INTO currency_rates (from_currency_id, to_currency_id, rate) VALUES ('usd', 'rub', 66.7078616206)");
    tx.executeSql("INSERT OR IGNORE INTO currency_rates (from_currency_id, to_currency_id, rate) VALUES ('rub', 'usd', 0.0149907369)");
    tx.executeSql("INSERT OR IGNORE INTO currency_rates (from_currency_id, to_currency_id, rate) VALUES ('usd', 'uah', 27.3295209569)");
    tx.executeSql("INSERT OR IGNORE INTO currency_rates (from_currency_id, to_currency_id, rate) VALUES ('uah', 'usd', 0.0365904694)");
    tx.executeSql("INSERT OR IGNORE INTO currency_rates (from_currency_id, to_currency_id, rate) VALUES ('usd', 'sek', 9.0979519004)");
    tx.executeSql("INSERT OR IGNORE INTO currency_rates (from_currency_id, to_currency_id, rate) VALUES ('sek', 'usd', 0.1099148480)");
    tx.executeSql("INSERT OR IGNORE INTO currency_rates (from_currency_id, to_currency_id, rate) VALUES ('usd', 'nok', 8.3572289898)");
    tx.executeSql("INSERT OR IGNORE INTO currency_rates (from_currency_id, to_currency_id, rate) VALUES ('nok', 'usd', 0.1196568864)");

});

db.transaction(function (tx) {
    tx.executeSql('INSERT OR IGNORE INTO contacts (contact_id, name, phone, phones, ava, install_app, sync) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['local-1', 'Andrei Dashkevich', '+375447604989', '+375447604989', 'img/andrei.png', false, false]);
    tx.executeSql('INSERT OR IGNORE INTO contacts (contact_id, name, phone, phones, ava, install_app, sync) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['local-2', 'Nikita Vasilevsky', '+375447171127', '+375447171127', 'img/nikita.png', false, false]);
    tx.executeSql('INSERT OR IGNORE INTO contacts (contact_id, name, phone, phones, ava, install_app, sync) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['local-3', 'Anya Osetskaya ', '+375295055856', '+375295055856', 'img/anya.png', false, false]);
    tx.executeSql('INSERT OR IGNORE INTO contacts (contact_id, name, phone, phones, ava, install_app, sync) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['local-4', 'Maria Schipanova ', '+375290000000', '+375290000000', 'img/maria.png', false, false]);
    tx.executeSql('INSERT OR IGNORE INTO contacts (contact_id, name, phone, phones, ava, install_app, sync) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['local-5', 'Stas Saprankov', '+375290000001', '+375290000001', 'img/stas.png', false, false]);
    tx.executeSql('INSERT OR IGNORE INTO contacts (contact_id, name, phone, phones, ava, install_app, sync) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['local-6', 'Alexander Tsetsersky', '+375290000002', '+375290000002', 'img/alexander.png', false, false]);
    tx.executeSql('INSERT OR IGNORE INTO contacts (contact_id, name, phone, phones, ava, install_app, sync) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['local-7', 'Olga Shasholina', '+375290000003', '+375290000003', 'img/olga.png', false, false]);
});

function initAppData() {

    service.init.add(service.user.getLogIn, function (user) {
        app.data.user = user;
        service.init.finish('user');
    }, 'user');

    service.init.add(function () {
        if (!app.data.user) {
            // TODO remove hot fix
            // app.views.current.router.navigate('/login-screen/', {
            //     animate: false
            // });

            service.user.create({id: '1', phone: '+375291234567', auth_token: 'hdoptz', ava: 'img/ava.png'}, function (tx, results) {
                service.init.finish('login');
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

    service.init.add(service.currency.rateList, function (currency_rates) {
        app.data.currency_rates = currency_rates;
        service.init.finish('currency_rates');
    }, 'currency_rates');

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

    // TODO remove hot fix
    // var finishSync = service.init.finish.bind({}, 'sync');
    // service.init.add(service.sync.start, [finishSync, finishSync], 'sync', ['contact', 'payments', 'debt', 'login', 'sync_contacts']);

    // TODO remove hot fix
    // var finishSyncContacts = service.init.finish.bind({}, 'sync_contacts');
    // service.init.add(service.contact.sync_w_device, [finishSyncContacts, finishSyncContacts], 'sync_contacts', ['contact']);

    service.init.start(function () {
        app.views.current.router.navigate('/debt/list/', {
            animate: false
        });
    });
}

$$(document).on('page:init', '.page[data-name="init"]', function (e) {
    initAppData();
});
