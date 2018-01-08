var UserDetails = function () {
    return {
        isDefined: function () {
            var userId = window.localStorage.getItem("key");
            return userId !== undefined;
        }
    };
};