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
            return ['img/bat.png', 'img/bear.png', 'img/bee.png', 'img/bird.png', 'img/bug.png', 'img/butterfly.png',
                'img/camel.png', 'img/cat.png', 'img/cheetah.png', 'img/cobra.png', 'img/cow.png', 'img/crocodile.png',
                'img/dinosaur.png', 'img/dog.png', 'img/dove.png', 'img/duck.png', 'img/eagle.png', 'img/elephant.png',
                'img/fish.png', 'img/flamingo.png', 'img/fox.png', 'img/frog.png', 'img/giraffe.png', 'img/gorilla.png',
                'img/hen.png', 'img/horse.png', 'img/kangaroo.png', 'img/koala.png', 'img/leopard.png', 'img/lion.png',
                'img/monkey.png', 'img/mouse.png', 'img/panda.png', 'img/parrot.png', 'img/penguin.png', 'img/shark.png',
                'img/sheep.png', 'img/spider.png', 'img/squirrel.png', 'img/starfish.png', 'img/tiger.png', 'img/turtle.png',
                'img/wolf.png', 'img/zebra.png'];
        }
    }
} ();