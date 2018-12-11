import Component from '@core/base/component';

export default class Api extends Component {

  constructor(options) {
    super(options);

    if (!this.baseUrl) {
      this.baseUrl = window.location.origin;
    }

    if (!this.method) {
      this.method = 'get';
    }

    if (!this.headers) {
      this.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
    }
  }

  authorize(token) {
    this.token = token;
    return this;
  }

  unauthorize() {
    this.token = null;
    return this;
  }

  request(innerPath, method, data, headers = null) {
    // build the url
    let url = innerPath ? `${this.baseUrl}/${innerPath}` : this.baseUrl;
    if (this.token) {
      url = url + (url.includes('?') ? '&' : '?') + `access-token=${this.token}`;
    }

    // build the options
    let options = {};
    options.method = method ? method : this.method;
    options.headers = headers ? _.extend({}, this.headers, headers) : this.headers;

    // append data if passed
    if (data) {
      options.body = JSON.stringify(data);
    }

    // execute promise and make result as json if needed
    this.onBeforeRequest(options);
    return fetch(url, options).then(response => {
      return response.json().then(data => {
        if (response.ok) {
          this.onRequestSuccess(response, data);
        } else {
          this.onBadResponse(response, data);
          throw data;
        }

        return data;
      }).catch(result => {
        throw result;
      });
    }).catch(result => {
      if (result instanceof Error) {
        this.onBadRequest(result);
      }

      throw result;
    });
  }

  onBeforeRequest(options) {
    this.trigger('request');
  }

  onBadResponse(response, data) {
    console.error('Bad response.', response, data);
    this.trigger('error');
    this.trigger('complete');
  }

  onBadRequest(result) {
    console.error('Bad request.', result);
    this.trigger('error');
    this.trigger('complete');
  }

  onRequestSuccess(response, data) {
    this.trigger('success');
    this.trigger('complete');
  }

  get(innerPath, data = null, headers = null) {
    let query = '';
    if (data) {
      query = '?' + _.map(data, (value, key) => {
          return `${key}=${value}`;
        }).join('&');
    }

    return this.request(`${innerPath}${query}`, 'get', null, headers);
  }

  post(innerPath, data, headers = null) {
    return this.request(innerPath, 'POST', data, headers);
  }

  put(innerPath, data, headers = null) {
    return this.request(innerPath, 'PUT', data, headers);
  }

  delete(innerPath, data, headers = null) {

  }
}
