const EventEmitter = require('events').EventEmitter;
const autoref = require('./helpers').autoref;
const api = require('./api');


class SAFEApp extends EventEmitter {
  // internal wrapper
  constructor(appInfo) { // -> SAFEApp
    super();
    this._appInfo = appInfo;
    this._networkState = 'init';
    this._connection = null;
    Object.getOwnPropertyNames(api).forEach((key) => {
      this[key] = new api[key](this);
    });
  }

  get connection() {
    return this._connection;
  }

  get networkState() {
    return this._networkState;
  }

  get appInfo() {
    return this._appInfo;
  }

  static fromAuthUri(appInfo, authUri) {
    const app = autoref(new SAFEApp(appInfo));
    return app.auth.loginFromAuth(authUri);
  }

  connect(opts) {
    return this.auth.connect(opts
      ).then((connection) => {
        this._connection = connection;
      });
  }

  _networkStateUpdated(newState) {
    this.emit('network-state-updated', newState, this._networkState);
    this.emit(`network-state-${newState}`, this._networkState);
    this._networkState = newState;
  }

  __cleanup__() {
    // let's dereference everything
    this.container = null;
    this.immutableData = null;
    this.mutableData = null;

    // in the hopes, this all cleans up,
    // before we do in a matter of seconds from now
  }

}
module.exports = SAFEApp;