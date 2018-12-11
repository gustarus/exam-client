/**
 * Core application model.
 * @class application
 * @property events {Object} Registered application events.
 * @property components {Object} Registered application components.
 * @property modules {Object} Registered application modules.
 * @property settings {Object} Application configuration.
 * @property stages {Object} Different stages for boot method. Stage - page loading phase. Nex stages are allowed: ready, load. Every stage contains events, components and modules.
 */
class Application {

  constructor() {
    this.events = {};
    this.components = {};
    this.modules = {};

    this.settings = {
      events: {},
      components: {},
      modules: {}
    };

    this.stages = {
      ready: {
        events: {},
        components: {},
        modules: {}
      },

      load: {
        events: {},
        components: {},
        modules: {}
      }
    };
  }

  /**
   * Merge custom settings with already set in application.
   * @param settings {Object}
   * @returns {Application}
   */
  configure(settings) {
    _.each(settings, (value, key) => {
      if (key === 'events' || key === 'components' || key === 'modules') { // configure events, components or modules
        _.each(value, (childValue, childKey) => {
          // get item configuration
          let childSource = this.settings[key][childKey] || {};
          this.settings[key][childKey] = _.merge(childSource, childValue);

          // register item loading on the needed stage
          let stage = childSource.stage || 'load';
          this.stages[stage][key][childKey] = this.settings[key][childKey];
        });
      } else { // configure other property
        this.settings[key] = value;
      }
    });

    return this;
  }

  /**
   * Boot all application components.
   */
  boot() {
    Object.keys(this.stages).forEach(stage => {
      this.bootStage(stage);
    });
  }

  /**
   * Boot application for needed stage. Must be called after this.configure and when stage needed.
   * For example, on window.onready or window.onload.
   * @param stage {String} which stage to load
   * @returns {Application}
   */
  bootStage(stage) {
    let data = this.stages[stage];
    data.events && this.bootEvents(data.events);
    data.components && this.bootComponents(data.components);
    data.modules && this.bootModules(data.modules);
    return this;
  }

  /**
   * Boot all configured events from {@link Application#settings.events} with condition true.
   */
  bootEvents(events) {
    _.each(events, (options, name) => {
      if (!this.events[name] && (!options.condition || options.condition && options.condition())) {
        this.registerEvent(name, options);
      }
    });
  }

  /**
   * Boot all configured components from {@link Application#settings.components} with flag enabled.
   */
  bootComponents(components) {
    _.each(components, (options, name) => {
      if (!this.components[name] && options.enabled) {
        this.registerComponent(name, options);
      }
    });
  }

  /**
   * Boot all configured modules from {@link Application#settings.modules} with flag enabled.
   */
  bootModules(modules) {
    _.each(modules, (options, name) => {
      if (!this.modules[name] && options.enabled) {
        this.registerModule(name, options);
      }
    });
  }

  /**
   * Register event in the application.
   * @param name {String}
   * @param options {Object}
   */
  registerEvent(name, options) {
    this.events[name] = options;
    if (typeof options.target === 'object') {
      options.target.addEventListener(options.event, options.handler, false);
    } else {
      let targets = document.querySelectorAll(options.target);
      for (let i = 0; i < targets.length; i++) {
        targets[i].addEventListener('click', options.handler);
      }
    }
  }

  /**
   * Register component in the application.
   * @param name {String}
   * @param options {Object}
   */
  registerComponent(name, options) {
    let alias = options.alias;
    let Component = options.constructor;
    delete options.alias;
    delete options.enabled;
    delete options.constructor;
    options.app = this;
    this.components[name] = new Component(options);
    this.components[name].loaded = true;

    if (alias) {
      if (!this[name]) {
        this[name] = this.components[name];
      } else {
        this.trace(`Can\'t override application property with component ${name}.`, 'error');
      }
    }
  }

  /**
   * Register module in the application.
   * @param name {String}
   * @param options {Object}
   */
  registerModule(name, options) {
    let Module = options.constructor;
    delete options.enabled;
    delete options.constructor;
    options.app = this;
    this.modules[name] = new Module(options);
  }

  /**
   * Trance message via console.
   * @param message
   * @param type
   */
  trace(message, type) {
    let isDebug = document.cookie.match('enable_logger=1');
    let isLogger = window && window.console && window.console[type];
    if (isDebug && isLogger) {
      window.console[type](message);
    }
  }

  log(message) {
    this.trace(message, 'log');
  }

  info(message) {
    this.trace(message, 'info');
  }

  warning(message) {
    this.trace(message, 'warn');
  }
}

module.exports = Application;
