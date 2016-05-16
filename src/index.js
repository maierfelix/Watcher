((global) => {

  /** Cross poly */
  let observer = (
    global.MutationObserver       ||
    global.WebKitMutationObserver ||
    global.MozMutationObserver
  );

  /**
   * Default options
   * @type {Object}
   */
  let options = {
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
  let actions = [];

  /**
   * Watcher
   * @class Watcher
   */
  class Watcher {

    /**
     * @param {HTMLElement} target
     * @param {Object} opts
     * @param {Function} resolve
     * @constructor
     */
    constructor(target, opts, resolve) {

      /**
       * Watch target
       * @type {HTMLElement}
       */
      this.target = (
        !target ?
        global.document.body :
        target
      );

      /**
       * Function to resolve
       * @type {Function}
       */
      this.resolve = (
        resolve instanceof Function
        ? resolve
        : () => {}
      );

      /**
       * Mutation observer instance
       * @type {MutationObserver}
       */
      this.instance = null;

      /**
       * Options
       * @type {Object}
       */
      this.opts = (
        !opts || Object.keys(opts).length <= 0
        ? options
        : opts
      );

      this._init();

    }

    /** Initialise observer */
    _init() {
      this.instance = new observer((mutations) => {
        this._actions(mutations);
      });
    }

    /**
     * Execute all actions,
     * then callback
     * @param {Array} mutations
     */
    _actions(mutations) {

      let action = null;
      let mutation = null;

      let ii = 0;
      let jj = 0;

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
    start() {
      this.instance.observe(this.target, this.opts);
    }

    /** Stop watching target */
    stop() {
      this.instance.disconnect();
    }

    /**
     * Register a action
     * @param {Object} obj
     * @static
     */
    static register(obj) {

      if (
        obj &&
        obj.rule instanceof Function &&
        obj.action instanceof Function
      ) {
        actions.push(obj);
      }

    }

  }(() => global.Watcher = Watcher)();

  /** Add nodes */
  Watcher.register({
    rule: (m) => {
      return (
        m.type === "childList" && m.addedNodes.length > 0
      );
    },
    action: (m) => {
      console.log("Added", m.addedNodes[0], "to", m.target);
    }
  });

  /** Remove nodes */
  Watcher.register({
    rule: (m) => {
      return (
        m.type === "childList" && m.removedNodes.length > 0
      );
    },
    action: (m) => {
      console.log("Removed", m.removedNodes[0], "from", m.target);
    }
  });

  /** Style change */
  Watcher.register({
    rule: (m) => {
      return (
        m.type === "attributes"
      );
    },
    action: (m) => {
      console.log(`Changed ${ m.attributeName } of`, m.target);
    }
  });

  module.exports = Watcher;

})(window);