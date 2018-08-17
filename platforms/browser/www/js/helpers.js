Template7.registerHelper('name', function (id, options) {
    //options.hash object: console.log(options.hash) -> {delimiter: ', '}
    if (typeof id === 'function') id = id.call(this);
    return service.contact.get(id).name;
});

Template7.registerHelper('format_amount', function (amount, options) {
    if (typeof amount === 'function') amount = amount.call(this);
    return (Math.round(amount * 100)/100).toFixed(2);
});

Template7.registerHelper('format_currency', function (id, options) {
    if (typeof id === 'function') id = id.call(this);
    return service.currency.get(id).title;
});

Template7.registerHelper('currency', function (id, options) {
    if (typeof id === 'function') id = id.call(this);
    var currency = service.currency.get(id)
    return currency.sign || currency.title;
});

Template7.registerHelper('avatar', function (contact_id) {
    if (typeof contact_id === 'function') contact_id = contact_id.call(this);
    return service.contact.get(contact_id).ava;
});