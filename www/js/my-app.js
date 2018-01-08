// Initialize app
var myApp = new Framework7();
var userDetails = new UserDetails();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page


});

myApp.onPageInit('phone_number', function (page) {
    // Do something here for "about" page
    $$('#submit-phone').on('click', function (e) {
        mainView.router.load({pageName: 'about'})
    });
});

myApp.onPageInit('login-screen', function (page) {
    var pageContainer = $$(page.container);
    pageContainer.find('.list-button').on('click', function () {
        var phone = pageContainer.find('input[name="phone"]').val(),
            buttons = [
                {
                    text: 'Is this phone number correct ?\n' + phone,
                    label: true
                },
                {
                    text: 'Yes',
                    onClick: function () {
                        myApp.alert('Cancel clicked');
                    }
                },
                {
                    text: 'Change'
                }
            ];

        myApp.actions(buttons);


        // Handle username and password
        /*myApp.alert('Username: ' + username + ', Password: ' + password, function () {
            mainView.back();
        });*/
    });
});

mainView.router.loadPage('login-screen.html');