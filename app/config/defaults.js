import Api from '@core/components/api';
import Storage from '@core/components/storage';
import Translate from '@core/components/translate';

import onCursorMove from '@core/handlers/onCursorMove';

export default {
  interval: 5000,
  components: {
    api: {
      constructor: Api,
      enabled: true,
      alias: true,
      baseUrl: `${window.location.protocol}//${window.location.hostname}:3000/api`
    },

    storage: {
      constructor: Storage,
      enabled: true,
      alias: true
    },

    translate: {
      constructor: Translate,
      enabled: true,
      alias: true
    }
  }
}
