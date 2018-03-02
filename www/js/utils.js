var utils = (function () {
    return {
        uuid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        sqlResultSetToArray: function (sqlResult, options) {
            var plainResult = [],
                opt = options || {};
            if (sqlResult && sqlResult.rows && sqlResult.rows.length) {
                for (var i = 0; i < sqlResult.rows.length; ++i) {
                    var row = sqlResult.rows.item(i);
                    if (opt.numberFields) {
                        opt.numberFields.forEach(function (field) {
                            row[field] && (row[field] = parseFloat(row[field]));
                        });
                    }
                    plainResult.push(row);
                }
            }
            return plainResult;
        }
    }
})();

Array.prototype.remove = function (callback) {
    var i = this.length,
        result = [];
    while (i--) {
        if (callback(this[i], i)) {
            result.push(this[i]);
            this.splice(i, 1);
        }
    }
    return result;
};

String.prototype.hashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};