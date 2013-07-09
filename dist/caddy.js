(function() {
  var EventEmitter, wrap, _addListener, _nextTick, _on, _once, _removeListener, _setInterval, _setTimeout;

  EventEmitter = require('events').EventEmitter;

  module.currScope;

  module.exports.start = function() {
    return module.currScope = {};
  };

  module.exports.connect = function(req, res, next) {
    module.exports.start();
    next();
  };

  module.exports.get = function(key) {
    if (module.currScope) {
      return module.currScope[key];
    } else {
      return null;
    }
  };

  module.exports.set = function(key, data) {
    if (module.currScope) {
      return module.currScope[key] = data;
    } else {
      return null;
    }
  };

  wrap = function(callback) {
    var savedScope;
    if (module.currScope) {
      savedScope = module.currScope;
    }
    return function() {
      if (savedScope) {
        module.currScope = savedScope;
      }
      return callback.apply(this, arguments);
    };
  };

  _nextTick = process.nextTick;

  process.nextTick = function(callback) {
    var args;
    args = Array.prototype.slice.call(arguments);
    args[0] = wrap(callback);
    return _nextTick.apply(this, args);
  };

  _setTimeout = global.setTimeout;

  global.setTimeout = function(callback) {
    var args;
    args = Array.prototype.slice.call(arguments);
    args[0] = wrap(callback);
    return _setTimeout.apply(this, args);
  };

  _setInterval = global.setInterval;

  global.setInterval = function(callback) {
    var args;
    args = Array.prototype.slice.call(arguments);
    args[0] = wrap(callback);
    return _setInterval.apply(this, args);
  };

  _on = EventEmitter.prototype.on;

  EventEmitter.prototype.on = function(event, callback) {
    var args, listeners;
    args = Array.prototype.slice.call(arguments);
    args[1] = wrap(callback);
    _on.apply(this, args);
    listeners = this.listeners(event);
    listeners[listeners.length - 1]._origCallback = callback;
    return this;
  };

  _addListener = EventEmitter.prototype.addListener;

  EventEmitter.prototype.addListener = function(event, callback) {
    var args, listeners;
    args = Array.prototype.slice.call(arguments);
    args[1] = wrap(callback);
    _addListener.apply(this, args);
    listeners = this.listeners(event);
    listeners[listeners.length - 1]._origCallback = callback;
    return this;
  };

  _once = EventEmitter.prototype.once;

  EventEmitter.prototype.once = function(event, callback) {
    var args, listeners;
    args = Array.prototype.slice.call(arguments);
    args[1] = wrap(callback);
    _once.apply(this, args);
    listeners = this.listeners(event);
    listeners[listeners.length - 1]._origCallback = callback;
    return this;
  };

  _removeListener = EventEmitter.prototype.removeListener;

  EventEmitter.prototype.removeListener = function(event, callback) {
    var args, called, listener, _i, _len, _ref;
    args = Array.prototype.slice.call(arguments);
    called = false;
    _ref = this.listeners(event);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      if ((listener != null ? listener._origCallback : void 0) === callback) {
        called = true;
        args[1] = listener;
        _removeListener.apply(this, args);
        break;
      }
    }
    if (!called) {
      _removeListener.apply(this, args);
    }
    return this;
  };

}).call(this);
