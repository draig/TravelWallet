Template7.registerHelper('name', function (id, options) {
    //options.hash object: console.log(options.hash) -> {delimiter: ', '}
    if (typeof id === 'function') id = id.call(this);
    return service.contact.get(id).name;
});

Template7.registerHelper('format_amount', function (amount, options) {
    //options.hash object: console.log(options.hash) -> {delimiter: ', '}
    if (typeof amount === 'function') amount = amount.call(this);
    return (Math.round(amount * 100)/100).toFixed(2);
});