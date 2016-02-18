FOUR.KeyCommandController = (function () {

  /**
   * Key command controller. The controller allows you to define key command
   * sets that can be activated and deactivated as required. A key command set
   * called the 'default' set is always active.
   * @constructor
   */
  function KeyCommandController (config) {
    config = config || {};

    var self = this;
    self.active = null; // the active command set
    self.enabled = config.enabled || false;
    self.listeners = {};
    self.pressed = []; // list of keys that are currently pressed
    self.sets = {
      'default': []
    };

    Object.keys(config).forEach(function (key) {
      self.config[key] = config[key];
    });
  }

  /**
   * Define key command.
   * @param {String} group Group. Use 'default' for persistent commands.
   * @param {String} command Key command
   * @param {Function} fn Function
   * @param {Element} el DOM element that will listen for events. Defaults to window
   */
  KeyCommandController.prototype.bind = function (group, command, fn, el) {
    el = el || window;
    if (!this.sets.hasOwnProperty(group)) {
      this.sets[group] = [];
    }
    this.sets[group].push({
      command: command,
      fn: fn
    });
  };

  KeyCommandController.prototype.disable = function () {
    var self = this;
    self.enabled = false;
    Object.keys(self.listeners).forEach(function (key) {
      var listener = self.listeners[key];
      listener.element.removeEventListener(listener.event, listener.fn);
      delete self.listeners[key];
    });
  };

  KeyCommandController.prototype.enable = function () {
    var self = this;
    // clear all listeners to ensure that we can never add multiple listeners
    // for the same events
    self.disable();
    function addListener(element, event, fn) {
      if (!self.listeners[event]) {
        self.listeners[event] = {
          element: element,
          event: event,
          fn: fn.bind(self)
        };
        element.addEventListener(event, self.listeners[event].fn, false);
      }
    }
    addListener(window, 'keydown', self.onKeyDown);
    addListener(window, 'keyup', self.onKeyUp);
    self.enabled = true;
  };

  /**
   * @see http://api.jquery.com/event.which/
   * @param evt
   */
  KeyCommandController.prototype.keydown = function (evt) {
    var me = this;
    me.pressed.indexOf(evt.keyCode);
    // check the default command set
    Object.keys(me.sets.default).forEach(function (command) {
      var active = command.keys.reduce(function (last, key) {
        if (me.pressed.indexOf(key) > -1) {
          last = last === null ? true : last;
        }
        return last;
      }, null);
      console.info('check default command');
    });
    // check the current command set
    Object.keys(me.sets[me.current]).forEach(function (command) {
      console.info('check command');
    });
    me.dispatchEvent({'type': 'keyup', keyCode: evt.keyCode});
  };

  KeyCommandController.prototype.keyup = function (evt) {
    var i = this.pressed.indexOf(evt.keyCode);
    if (i > -1) {
      this.pressed.slice(i, i+1);
    }
    this.dispatchEvent({'type': 'keyup', keyCode: evt.keyCode});
  };

  /**
   * Register key event callback.
   * @param {String} command Key command
   * @param {Function} callback Callback
   * @param {String} commandSet Name of command set. Defaults to 'default'
   */
  KeyCommandController.prototype.register = function (command, callback, commandSet) {
    commandSet = commandSet || 'default';
    // create the set if it doesn't already exist
    if (!this.sets.hasOwnProperty(commandSet)) {
      this.sets[commandSet] = [];
    }
    // TODO transform English key descriptions into keycodes
    var keycodes = [];
    this.sets[commandSet].push({keys: keycodes, fn: callback});
    throw new Error('not implemented');
  };

  return KeyCommandController;

}());