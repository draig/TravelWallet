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
                path: '/about/',
                url: './pages/about.html'
            },
            {
                path: '/login-screen/',
                loginScreen: {
                    componentUrl: './pages/login-screen.html'
                }
            }
        ]
        // ... other parameters
    });

var mainView = app.views.create('.view-main');

// This view will support all global routes + own additional routes
var view2 = app.views.create('.sign-up-view', {
    // These routes are only available in this view
    routesAdd: [
        {
            path: '/blog/',
            url: './pages/blog.html'
        },
        {
            path: '/post/',
            url: './pages/post.html'
        }
    ]
});