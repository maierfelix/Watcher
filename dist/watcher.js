(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Watcher = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global) {

  /** Cross poly */
  var observer = global.MutationObserver || global.WebKitMutationObserver || global.MozMutationObserver;

  /**
   * Default options
   * @type {Object}
   */
  var options = {
    attributes: true,
    childList: true,
    subtree: true
  };

  /**
   * Registered actions
   * to execute on each
   * mutation call
   * @type {Array}
   */
  var actions = [];

  /**
   * Watcher
   * @class Watcher
   */

  var Watcher = function () {

    /**
     * @param {HTMLElement} target
     * @param {Object} opts
     * @param {Function} resolve
     * @constructor
     */

    function Watcher(target, opts, resolve) {
      _classCallCheck(this, Watcher);

      /**
       * Watch target
       * @type {HTMLElement}
       */
      this.target = !target ? global.document.body : target;

      /**
       * Function to resolve
       * @type {Function}
       */
      this.resolve = resolve instanceof Function ? resolve : function () {};

      /**
       * Mutation observer instance
       * @type {MutationObserver}
       */
      this.instance = null;

      /**
       * Options
       * @type {Object}
       */
      this.opts = !opts || Object.keys(opts).length <= 0 ? options : opts;

      this._init();
    }

    /** Initialise observer */


    _createClass(Watcher, [{
      key: "_init",
      value: function _init() {
        var _this = this;

        this.instance = new observer(function (mutations) {
          _this._actions(mutations);
        });
      }

      /**
       * Execute all actions,
       * then callback
       * @param {Array} mutations
       */

    }, {
      key: "_actions",
      value: function _actions(mutations) {

        var action = null;
        var mutation = null;

        var ii = 0;
        var jj = 0;

        for (; ii < actions.length; ++ii) {
          action = actions[ii];
          for (jj = 0; jj < mutations.length; ++jj) {
            mutation = mutations[jj];
            if (action.rule(mutation)) {
              action.action(mutation);
            }
          };
        };

        this.resolve(mutations);
      }

      /**
       * Start watching target
       * @param {Function} resolve
       */

    }, {
      key: "start",
      value: function start() {
        this.instance.observe(this.target, this.opts);
      }

      /** Stop watching target */

    }, {
      key: "stop",
      value: function stop() {
        this.instance.disconnect();
      }

      /**
       * Register a action
       * @param {Object} obj
       * @static
       */

    }], [{
      key: "register",
      value: function register(obj) {

        if (obj && obj.rule instanceof Function && obj.action instanceof Function) {
          actions.push(obj);
        }
      }
    }]);

    return Watcher;
  }();

  (function () {
    return global.Watcher = Watcher;
  })();

  /** Add nodes */
  Watcher.register({
    rule: function rule(m) {
      return m.type === "childList" && m.addedNodes.length > 0;
    },
    action: function action(m) {
      console.log("Added", m.addedNodes[0], "to", m.target);
    }
  });

  /** Remove nodes */
  Watcher.register({
    rule: function rule(m) {
      return m.type === "childList" && m.removedNodes.length > 0;
    },
    action: function action(m) {
      console.log("Removed", m.removedNodes[0], "from", m.target);
    }
  });

  /** Style change */
  Watcher.register({
    rule: function rule(m) {
      return m.type === "attributes";
    },
    action: function action(m) {
      console.log("Changed " + m.attributeName + " of", m.target);
    }
  });

  module.exports = Watcher;
})(window);

},{}]},{},[1])(1)
});