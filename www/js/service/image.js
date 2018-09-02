service.image = function () {

    return {

        save: function (avatarBlob, success, error) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                utils.saveBlob(avatarBlob, utils.uuid() + ".png", fs, function (fileEntry) {
                    success && success(fileEntry.toURL());
                });
            }, function (e) { error && error(e); });
        },

        predefined: function () {
            return ['img/ava-1.png', 'img/ava-4.png', 'img/ava-3.png', 'img/ava-2.png'];
        },

        // unused: function () {
        //     var unused_images = service.image.predefined().filter(function (image) {
        //         var use_this_image = app.data.contacts.filter(function (contact) {
        //             return contact.ava === image;
        //         });
        //         return !use_this_image.length;
        //     });
        //
        //     if(unused_images.length) {
        //         return unused_images.random();
        //     }
        //
        //     return service.image.predefined().random();
        // }
    }
} ();