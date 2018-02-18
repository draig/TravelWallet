
### Framework 7  
[post about it in PhoneGap blog](http://phonegap.com/blog/2015/11/30/framework7/).   
Usage:

    $ phonegap create my-app --template phonegap-template-framework7
    
    
### Plugins: https://build.phonegap.com/plugins
Contacts: https://www.npmjs.com/package/cordova-plugin-contacts

db.transaction(function (tx) {
    tx.executeSql('INSERT INTO contacts (contact_id, name, phone_number, phones, install_app) VALUES (?, ?, ?, ?, ?)', ['1', 'Andrei Dahskevich', '+375447604989', '+375447604989', true]);
    tx.executeSql('INSERT INTO contacts (contact_id, name, phone_number, phones, install_app) VALUES (?, ?, ?, ?, ?)', ['2', 'Ivan Ivanov', '+375296230945', '+375296230945,+3752328798765', true]);
});