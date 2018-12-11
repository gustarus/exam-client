import Component from '@core/base/component';

export default class Storage extends Component {

  constructor(options) {
    super(options);

    if (!this.attributes) {
      this.attributes = {};
    }

    if (!this.key) {
      this.key = '@TheQuizStorage';
    }
  }

  set(attribute, value) {
    if (typeof attribute === 'object') {
      for (let name in attribute) {
        this.attributes[name] = attribute[name];
      }
    } else {
      this.attributes[attribute] = value;
    }

    return this;
  }

  unset(attribute) {
    delete this.attributes[attribute];
    return this;
  }

  get(attribute) {
    return this.attributes[attribute];
  }

  save() {
    sessionStorage.setItem(this.key, JSON.stringify(this.attributes));
    return this;
  }

  fetch() {
    let data = sessionStorage.getItem(this.key);
    if (data) {
      let json = JSON.parse(data);
      json && this.set(json);
    }

    return this;
  }

  clean() {
    sessionStorage.removeItem(this.key);
    return this;
  }
}
