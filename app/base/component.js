export default class Component {

  constructor(config) {
    this.events = {};

    if (config) {
      for (var name in config) {
        this[name] = config[name];
      }
    }
  }

  on(event, handler) {
    let names = event.replace(/\s+/g, ' ').split(' ');
    for (let name of names) {
      this.events[name] = this.events[name] || [];
      this.events[name].push(handler);
    }
  }

  off(event) {
    delete this.events[event];
  }

  trigger(event) {
    if (this.events[event]) {
      this.events[event].forEach(handler => {
        handler.apply(this, Array.prototype.slice.call(arguments, 1));
      });
    }
  }
}
