'use strict';

// create application singleton
import Application from '@core/base/application';
import config from '@core/config/defaults'
const instance = new Application();

// configure the application singleton
instance.configure(config);

export default instance;
