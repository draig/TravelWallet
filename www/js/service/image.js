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
        }
    }
} ();