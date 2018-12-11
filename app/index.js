// import theme styles
import '@core/styles/application.styl'

// import polyfils
import 'whatwg-fetch'

// configure moment
moment.locale('ru');

// boot application instance
import Router from '@core/router'
import app from '@core/instance'
app.boot();

// render application instance
let root = document.querySelector('#root');
ReactDOM.render(Router, root);

// render spinner instance
import Spinner from '@core/views/spinner'
let spinnerEl = document.querySelector('#spinner');

// listen to api requests
let interval;
app.api.on('request', () => {
  clearInterval(interval);
  ReactDOM.render(<Spinner visible={true}/>, spinnerEl);
});

// listen to api requests completion
app.api.on('complete', () => {
  // prevent view blinking if requests queue
  interval = setInterval(() => spinnerEl.innerHTML = null, 500);
});
