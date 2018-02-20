var utils = (function () {
   return {
       uuid: function () {
           return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
               var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
               return v.toString(16);
           });
       },
       sqlResultSetToArray: function (sqlResult) {
           var plainResult = [];
           if(sqlResult && sqlResult.rows && sqlResult.rows.length) {
               for(var i = 0; i < sqlResult.rows.length; ++i) {
                   plainResult.push(sqlResult.rows.item(i));
               }
           }
           return plainResult;
       }
   }
})();

Array.prototype.remove = function(callback) {
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