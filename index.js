var Rodm = require("./lib");

var Singleton = (function() {
  var instance = null;

  function Singleton() {}

  Singleton.get = function() {
    return instance !== null ? instance : instance = new Rodm();
  };

  return Singleton;

})();

module.exports = Singleton.get();