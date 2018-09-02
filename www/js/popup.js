function initPopups() {
    var contactNewCompiledTemplate = Template7.compile($$('#contact-new-template').html()),
        ava_changed = false, ava_url = '', croppie;

    app.popup.contact_new_popup = app.popup.create({
        content: contactNewCompiledTemplate({device: app.device}),
        on: {
            closed: function (popup) {
                popup.$el.find('input').val('');
                popup.$el.find('li').removeClass('item-input-invalid item-input-with-error-message');
                ava_changed = false;
            }
        }
    });

    app.popup.contact_new_popup.once('open', function (popup) {
        console.log('init');

        function validate() {
            var formData = app.form.convertToData('#participant-new-form');
            if (formData.name && formData.phone) {
                $$('#participant-new-submit').removeClass('link-disabled');
            } else {
                $$('#participant-new-submit').addClass('link-disabled');
            }
        }

        function create() {
            if (!$$('#participant-new-submit').hasClass('link-disabled')) {
                function _create(ava) {
                    var form_data = app.form.convertToData('#participant-new-form');
                    service.contact.add({name: form_data.name, phones: [form_data.phone], ava: ava}, function (result) {
                        app.popup.contact_new_popup.close();
                    }.bind(this));
                }

                if (ava_changed || croppie.get().zoom !== 1) {
                    croppie.result('blob').then(function (avaBlob) {
                        service.image.save(avaBlob, function (ava_url) {
                            _create(ava_url);
                        });
                    });
                } else {
                    _create(ava_url);
                }
            }
        }

        function change() {
            validate();
        }

        function file(e) {
            var input = e.target;

            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (event) {
                    croppie.bind({
                        url: event.target.result
                    });
                    ava_changed = true;
                };

                reader.readAsDataURL(input.files[0]);
            } else {
                console.error('FileReader API doesn\'t support');
            }
        }

        popup.$el.find('input').change(change);
        popup.$el.find('input[type="file"]').change(file);
        popup.$el.find('#participant-new-submit').click(create);

        var width = popup.$el.width(),
            height = Math.round(width * 0.6);

        $$('#avatar').parent().css({height: height + 'px', width: width + 'px'});
        app.data.croppie = croppie = new Croppie(document.getElementById('avatar'), {
            viewport: {height: height - 20, width: height - 20, type: 'square'},
            showZoomer: false
        });
    });

    app.popup.contact_new_popup.on('open', function () {
        croppie.bind({
            url: ava_url = service.image.predefined().random()
        });
    });
}